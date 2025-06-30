import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { RegisterService } from 'src/app/services/register.service';
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent]
})
export class CreateClientComponent implements OnInit {

  userForm!: FormGroup;
  maxDate!: string;
  errorMessage: string = '';
  success: boolean = false;

  readonly NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s']+$/;
  readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  readonly DNI_REGEX = /^\d{7,8}$/;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private dialog: MatDialog,
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

  const data = { ...this.userForm.value };

  // Abrir loader antes de enviar la petición
  const loaderRef = this.dialog.open(ConfirmModalComponent, {
    disableClose: true,
    data: {
      title: 'Registrando cliente...',
      description: 'Por favor, espera unos segundos.',
      loading: true // propiedad para mostrar spinner en tu modal genérico
    }
  });

  this.registerService.register(data).subscribe({
    next: () => {
      loaderRef.close(); // cerrar loader

      // Mostrar modal de éxito
      this.dialog.open(ConfirmModalComponent, {
        data: {
          title: 'Registro exitoso',
          description: 'El cliente fue registrado correctamente.',
          confirmText: 'Aceptar',
          icon: 'success'
        }
      }).afterClosed().subscribe(() => {
        this.router.navigate(['/']); // redirecciona donde necesites
      });
    },
    error: (err) => {
      loaderRef.close(); // cerrar loader

      // Mostrar modal de error
      this.dialog.open(ConfirmModalComponent, {
        data: {
          title: 'Error al registrar',
          description: err?.error?.message || 'Ocurrió un error al registrar el cliente. Intentá nuevamente.',
          confirmText: 'Aceptar',
          icon: 'error'
        }
      });
    }
  });
}


  cancel(): void {
    this.router.navigate(['/']); // o ruta anterior
  }
}