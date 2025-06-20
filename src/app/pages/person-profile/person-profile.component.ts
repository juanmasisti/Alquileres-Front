import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
  MinLengthValidator,
} from '@angular/forms';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-person-profile',
  templateUrl: './person-profile.component.html',
  styleUrls: ['./person-profile.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
    RouterLink,
  ],
})
export class PersonProfileComponent implements OnInit {
  personDataForm!: FormGroup;
  minDate!: string;
  maxDate!: string;
  // Expresiones regulares (las mismas que antes)
  private readonly NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s']+$/;
  private readonly EMAIL_REGEX =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  private readonly DNI_REGEX = /^\d{7,8}$/;

  loading: boolean = false;
  user!: User;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) { }

  isClient() {
    return this.authService.getUserRole() == 'cliente'
  }

  ngOnInit() {
    this.userService.getProfile().subscribe((user: User) => {
      this.user = user;
      console.log('Usuario obtenido:', this.user);
      this.inicializarFormulario();
    });
  }

  inicializarFormulario() {
    this.personDataForm = this.fb.group({
      nombre: [
        { value: this.user.nombre, disabled: true },
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
          this.validateRegex(this.NAME_REGEX, 'invalidName'),
        ],
      ],
      apellido: [
        { value: this.user.apellido, disabled: true },
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
          this.validateRegex(this.NAME_REGEX, 'invalidLastName'),
        ],
      ],
      email: [
        { value: this.user.email, disabled: true },
        [Validators.required, Validators.email],
      ],
      telefono: [
        { value: this.user.telefono, disabled: true },
        [
          Validators.required,
          this.validatePhone('invalidPhone')
        ],
      ],
      dni: [
        { value: this.user.dni, disabled: true },
        [Validators.required, this.validateRegex(this.DNI_REGEX, 'invalidDni')],
      ],
      nacimiento: [
        { value: this.user.nacimiento, disabled: true },
        [Validators.required, this.validateAgeRange(18, 100)],
      ],
    });
  }

  private validatePhone(errorKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null
      const isValid = isValidPhoneNumber(control.value);
      return isValid ? null : { [errorKey]: { value: control.value } };
    };
  }

  private validateRegex(regex: RegExp, errorKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No validar si está vacío (dejamos eso a Validators.required)
      }
      const isValid = regex.test(control.value);
      return isValid ? null : { [errorKey]: { value: control.value } };
    };
  }

  private validateAgeRange(minAge: number, maxAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // Ajustar si aún no ha pasado el mes de cumpleaños
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < minAge) {
        return {
          tooYoung: {
            requiredAge: minAge,
            actualAge: age,
            message: `Debes tener al menos ${minAge} años`,
          },
        };
      }

      if (age > maxAge) {
        return {
          tooOld: {
            requiredAge: maxAge,
            actualAge: age,
            message: `La edad máxima permitida es ${maxAge} años`,
          },
        };
      }

      return null;
    };
  }

  isEditing = false;

  deleteProfile() {
  const dialogRef = this.dialog.open(ConfirmModalComponent, {
    data: {
      title: '¿Estás seguro/a?',
      description: 'Esta acción eliminará tu cuenta permanentemente.',
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      //icon: 'error' // Mostramos ícono de advertencia
    }
  });

  dialogRef.afterClosed().subscribe((confirmed: boolean) => { // nos subscribimos al observable que devuelve afterClosed
    // confirmed será true si el usuario hizo clic en "Sí, eliminar"
    // o false si hizo clic en "Cancelar"
    if (confirmed) {
      this.userService.deleteProfile().subscribe({ // nos subscribimos al observable que devuelve deleteProfile
        // Si la eliminación es exitosa
        next: () => {
          this.dialog.open(ConfirmModalComponent, {
            data: {
              title: 'Cuenta eliminada',
              description: 'Tu cuenta fue eliminada correctamente.',
              confirmText: 'Aceptar',
              icon: 'success'
            }
          }).afterClosed().subscribe(() => {
            sessionStorage.clear();
            this.router.navigate(['/']);
          });
        },
        // Si ocurre un error al eliminar la cuenta
        error: (err) => {
          this.dialog.open(ConfirmModalComponent, {
            data: {
              title: 'Error al eliminar',
              description: err.error.message || 'Ocurrió un error al eliminar tu cuenta. Por favor, intentá nuevamente.',
              confirmText: 'Aceptar',
              icon: 'info'
            }
          });
        }
      });
    }
  });
}

  editarDatos() {
    if (this.isEditing) {
      if (this.personDataForm.valid) {
        const newUser: Partial<User> = {};
        const dataEntries = Object.entries(this.personDataForm.value);
        let hasChanged = false;

        for (const [key, value] of dataEntries) {
          if ((this.user as any)[key] != value) {
            hasChanged = true;
            break;
          }
        }

        if (!hasChanged) {
          this.isEditing = false;
          this.loading = false;
          return;
        }

        dataEntries.forEach(([key, value]) => ((newUser as any)[key] = value));

        this.personDataForm.disable();
        this.isEditing = false;
        this.loading = true;

       this.userService.updateProfile(newUser).subscribe({
          next: () => {
            this.loading = false;

            this.dialog.open(ConfirmModalComponent, {
              data: {
                title: '¡Perfil actualizado!',
                description: 'Tus datos fueron guardados correctamente.',
                confirmText: 'Aceptar',
                cancelText: '',
                icon: 'success',
              },
              width: '400px'
            });
          },
          error: (err) => {
            // Revertir datos
            dataEntries.forEach(([key, value]) => {
              const obj = this.personDataForm.get(key);
              if (obj) obj.setValue((this.user as any)[key]);
            });

            this.loading = false;

            this.dialog.open(ConfirmModalComponent, {
              data: {
                title: 'Error al actualizar',
                description: 'Ocurrió un error al guardar los cambios. Por favor, intentá nuevamente.',
                confirmText: 'Cerrar',
                cancelText: ''
              },
              width: '400px'
            });
          }
        });
      } else {
        this.personDataForm.markAllAsTouched();
      }
    } else {
      this.personDataForm.enable();
      this.isEditing = true;
    }
  }
}
