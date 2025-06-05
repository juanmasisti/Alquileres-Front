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
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { UserService } from 'src/app/services/user.service';
import { PasswordService } from '../../services/password.service';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
  imports: [
    NavbarComponent,
    FooterComponent,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class PasswordRecoveryComponent implements OnInit {
  EmailForm: FormGroup;
  mailEnviado = false;

  // Expresiones regulares
  private readonly EMAIL_REGEX =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordService,
    private dialog: MatDialog,
  ) {
    this.EmailForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          this.validateRegex(this.EMAIL_REGEX, 'invalidEmail'),
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

  private markAllAsTouched() {
    Object.values(this.EmailForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  EnviarMail() {
    this.markAllAsTouched();
    const formData = this.EmailForm.value;
    this.passwordService.recoverPassword(formData).subscribe({
      next: () => {
        this.mailEnviado = true; // mostrar modal
      },
      error: (error) => {
        console.error('Error al enviar el correo:', error);
        // Aquí podrías manejar el error, por ejemplo, mostrar un mensaje al usuario
        this.dialog.open(ConfirmModalComponent, {
          data: {
            title: 'Error',
            message: '',
            description: error.error.message || 'Error al enviar el correo electrónico.',
            confirmText: 'Cerrar',
            icon: 'error'

      },
    });
      }
    });
  }


  ngOnInit() {}
}
