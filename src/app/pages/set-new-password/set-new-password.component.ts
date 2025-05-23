import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.scss'],
  imports: [
    NavbarComponent,
    FooterComponent,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class SetNewPasswordComponent implements OnInit {
  NewPassForm: FormGroup;
  cambioExitoso = false;
  changeError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private UserService: UserService
  ) {
    this.NewPassForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirm_password: ['', [Validators.required, Validators.minLength(8)]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  ngOnInit() {
    this.NewPassForm.get('confirm_password')?.valueChanges.subscribe(() => {
      this.NewPassForm.updateValueAndValidity({ onlySelf: true });
    });
  }

  passwordsMatchValidator: ValidatorFn = (
    form: AbstractControl
  ): ValidationErrors | null => {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirm_password')?.value;
    if (!password || !confirmPassword) return null;

    return password === confirmPassword ? null : { passwordMismatch: true };
  };

  registrarUsuario() {
    if (this.NewPassForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formData = this.NewPassForm.value;

    this.UserService.RecoverPassword(formData).subscribe({
      next: () => {
        this.cambioExitoso = true; // mostrar modal
      },
    });
  }

  irALogin() {
    this.cambioExitoso = false;
    this.router.navigate(['/ingresar']);
  }

  private markAllAsTouched() {
    Object.values(this.NewPassForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  changePass() {
    const formData = this.NewPassForm.value;
    console.log('Nueva Contraseña', formData);

    alert(
      'La contraseña se ha cambiado correctamente. Por favor, inicie sesión nuevamente.'
    );
  }
}
