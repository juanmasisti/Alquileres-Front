import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
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
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ingresar-codigo',
  templateUrl: './ingresar-codigo.component.html',
  styleUrls: ['./ingresar-codigo.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
    RouterModule,
  ],
})
export class IngresarCodigoComponent implements OnInit {
  CodeForm: FormGroup;
  loading = false;
  loginError: string | null = null;
  email = localStorage.getItem('email');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.CodeForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{4}$/)]],
    });
  }

  ngOnInit() {}

  IngresarAdmin() {
    this.loading = true;
    this.loginError = null;

    const email = localStorage.getItem('email');
    const code = this.CodeForm.value.code;

    this.authService.loginTwoFactor({ email: email || '', code }).subscribe({
      next: (response) => {
        console.log('Login exitoso: ', response);
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('rol', response.rol);
        sessionStorage.setItem('id', response.id);
        localStorage.removeItem('email');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error al iniciar sesión: ', error);
        this.loginError = 'Código incorrecto o expirado. Inténtalo de nuevo.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
