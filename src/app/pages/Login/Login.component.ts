import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';

@Component({
  selector: 'app-Login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
    RouterModule,
    CommonModule,
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  // Expresiones regulares
  private readonly EMAIL_REGEX =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          this.validateRegex(this.EMAIL_REGEX, 'invalidEmail'),
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

  ngOnInit() {}

  private markAllAsTouched() {
    Object.values(this.loginForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  ingresar() {
    if (this.loginForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formData = this.loginForm.value;
    console.log('Formulario válido:', formData);

    const serialized = JSON.stringify(formData);
    console.log('JSON serializado:', serialized);

    sessionStorage.setItem('Usuario', serialized);

    // Leerlo inmediatamente para verificar
    /* const saved = sessionStorage.getItem('registroUsuario');
    console.log('Leído desde sessionStorage:', saved); */
  }
}
