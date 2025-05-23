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
import { AuthService } from 'src/app/services/auth.service';
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
  loading = false;
  loginError: string | null = null;

  // Expresiones regulares
  private readonly EMAIL_REGEX =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  private readonly router = inject(Router)

  constructor(private fb: FormBuilder, private authService: AuthService) {
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

    this.loading = true;
    this.loginError = null;

    const formData = this.loginForm.value;

    this.authService.login(formData).subscribe({
      next: (res: LoginResModel) => {
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('rol', res.rol);
        sessionStorage.setItem('id', res.id);
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.loginError = err?.error?.message || 'Credenciales inválidas.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
