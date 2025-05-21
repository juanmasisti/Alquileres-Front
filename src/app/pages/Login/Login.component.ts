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
import { Router, RouterModule } from '@angular/router';
import { LoginResModel } from 'src/app/models/login.model';
import { AutenticationService } from 'src/app/services/autentication.service';
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

  private readonly router = inject(Router)

  constructor(private fb: FormBuilder, private authService: AutenticationService) {
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

    this.authService.login(formData).subscribe({
      next: (data: LoginResModel) => {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('rol', data.rol);
        this.router.navigate(['inicio'])
      },
      error: (err) => {
        console.error(err);
      }
    })

    // Leerlo inmediatamente para verificar
    /* const saved = sessionStorage.getItem('registroUsuario');
    console.log('Leído desde sessionStorage:', saved); */
  }
}
