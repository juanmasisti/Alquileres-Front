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
import { AuthService } from 'src/app/services/auth.service';
import { PasswordService } from 'src/app/services/password.service';
import { UserService } from 'src/app/services/user.service';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  imports: [
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
    RouterModule,
    CommonModule,
  ],
})
export class ChangePasswordComponent implements OnInit {
  changePassForm: FormGroup;
  cambioExitoso = false;
  isAuthenticated = sessionStorage.getItem('token') !== null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private passwordService: PasswordService,
    private authService: AuthService
  ) {
    this.changePassForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: [
        '',
        [Validators.required, Validators.minLength(8)],
      ],
    },
    { validators: this.passwordsMatchValidator() } // validador para todo el grupo
    );
  }

  private markAllAsTouched() {
    Object.values(this.changePassForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const newPassword = formGroup.get('newPassword')?.value;
      const confirmNewPassword = formGroup.get('confirmNewPassword')?.value;

      if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
        return { passwordsMismatch: true };
      }
      return null;
    };
  }

  ngOnInit() {}

  changePassword() {
    if (this.changePassForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formData = {
      email: this.authService.getUserEmail() || '',
      newPassword: this.changePassForm.value.newPassword,
      currentPassword: this.changePassForm.value.password,
      // token: sessionStorage.getItem('token') || '',
    };

    //formData.token = sessionStorage.getItem('token') || '';
    console.log('Formulario válido:', formData);


    this.passwordService.changePassword(formData).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.cambioExitoso = true;
        this.errorMessage = null; // limpiamos si antes hubo error
      },
      error: (error) => {
        console.error('Error al cambiar la contraseña:', error);
        this.errorMessage = error?.error?.message || 'Error desconocido al cambiar la contraseña.';
      },
    });
  }

  irALogin() {
    this.cambioExitoso = false;
    sessionStorage.clear(); // Limpiar sessionStorage al ir al login
    this.authService.logout();
    this.router.navigate(['/ingresar']);
  }
}
