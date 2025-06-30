import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { RegisterService } from 'src/app/services/register.service';
import { UserService } from 'src/app/services/user.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CreateUserModalComponent implements OnInit {
userForm!: FormGroup;
  minDate!: string;
  maxDate!: string;
  errorMessage: string = '';
  success: boolean = false;

  readonly NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s']+$/;
  readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  readonly DNI_REGEX = /^\d{7,8}$/;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private registerService: RegisterService,
    public dialogRef: MatDialogRef<CreateUserModalComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { tipoCuenta: 'cliente' | 'empleado'; titulo: string; accionLabel: string }
  ) {}

  ngOnInit(): void {
    this.setDateLimits();
    this.initForm();
  }

  private setDateLimits(): void {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    this.maxDate = maxDate.toISOString().split('T')[0];
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), this.regexValidator(this.NAME_REGEX, 'invalidName')]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), this.regexValidator(this.NAME_REGEX, 'invalidLastName')]],
      email: ['', [Validators.required, Validators.email, this.regexValidator(this.EMAIL_REGEX, 'invalidEmail')]],
      telefono: ['', [Validators.required, this.phoneValidator('invalidPhone')]],
      dni: ['', [Validators.required, this.regexValidator(this.DNI_REGEX, 'invalidDni')]],
      nacimiento: ['', [Validators.required, this.ageValidator(18)]],
    });
  }

  regexValidator(pattern: RegExp, errorKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return pattern.test(control.value) ? null : { [errorKey]: true };
    };
  }

  phoneValidator(errorKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return isValidPhoneNumber(control.value) ? null : { [errorKey]: true };
    };
  }

  ageValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      return age >= minAge ? null : { tooYoung: { message: `Debe ser mayor de ${minAge}` } };
    };
  }

createUser(): void {
  if (this.userForm.invalid) {
    this.userForm.markAllAsTouched();
    return;
  }

  console.log('Formulario válido createUser():', this.userForm.value);

  const data = {
    ...this.userForm.value,
  };

  // Mostrar loader al iniciar
  const loaderRef = this.dialog.open(ConfirmModalComponent, {
    disableClose: true,
    data: {
      title: 'Registrando usuario...',
      description: 'Por favor, espera unos segundos.',
      loading: true // propiedad para que muestre un spinner en tu modal genérico
    }
  });

  this.registerService.register(data).subscribe({
    next: () => {
      loaderRef.close(); // cerrar loader

      // Mostrar modal de éxito
      this.dialog.open(ConfirmModalComponent, {
        data: {
          title: 'Registro exitoso',
          description: 'El usuario fue registrado correctamente.',
          confirmText: 'Aceptar',
          icon: 'success'
        }
      }).afterClosed().subscribe(() => {
        this.dialogRef.close(true); // cerrar modal de crear usuario
      });
    },
    error: (err) => {
      loaderRef.close(); // cerrar loader

      // Mostrar modal de error
      this.dialog.open(ConfirmModalComponent, {
        data: {
          title: 'Error al registrar',
          description: err?.error?.message || 'Ocurrió un error al registrar el usuario. Intentá nuevamente.',
          confirmText: 'Aceptar',
          icon: 'error'
        }
      });
    }
  });
}

  cerrar(): void {
    this.dialogRef.close(false);
  }
}
