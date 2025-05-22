import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
    RouterModule,
  ],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  minDate!: string;
  maxDate!: string;

  // Expresiones regulares (las mismas que antes)
  private readonly NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s']+$/;
  private readonly EMAIL_REGEX =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  private readonly DNI_REGEX = /^\d{7,8}$/;
  private readonly PHONE_REGEX = /\d*$/;
  private readonly router = inject(Router)
  
  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService
  ) {
    this.registerForm = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          this.validateRegex(this.NAME_REGEX, 'invalidName'),
        ],
      ],
      apellido: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          this.validateRegex(this.NAME_REGEX, 'invalidLastName'),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          this.validateRegex(this.EMAIL_REGEX, 'invalidEmail'),
        ],
      ],
      telefono: [
        '',
        [
          Validators.required,
          this.validateRegex(this.PHONE_REGEX, 'invalidPhone'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          // this.validateRegex(this.PASSWORD_REGEX, 'weakPassword')
        ],
      ],
      dni: [
        '',
        [Validators.required, this.validateRegex(this.DNI_REGEX, 'invalidDni')],
      ],
      nacimiento: ['', [Validators.required, this.validateAgeRange(18, 80)]],
    });
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

  ngOnInit() {
    this.setDateLimits();
  }

  private setDateLimits() {
    const today = new Date();
    // Edad mínima (18 años)
    const maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    this.maxDate = maxDate.toISOString().split('T')[0];

    // Edad máxima (80 años)
    const minDate = new Date(
      today.getFullYear() - 80,
      today.getMonth(),
      today.getDate()
    );
    this.minDate = minDate.toISOString().split('T')[0];
  }

  registrarUsuario() {
    if (this.registerForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formData = this.registerForm.value;

    this.registerService.register(formData).subscribe({
      next: (value) => {
        console.log(value)
        this.router.navigate(['ingresar'])
      },
      error: (err) => {
        console.log(err)
      },
    })

    // Leerlo inmediatamente para verificar
    /* const saved = sessionStorage.getItem('registroUsuario');
    console.log('Leído desde sessionStorage:', saved); */
  }

  private markAllAsTouched() {
    Object.values(this.registerForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}
