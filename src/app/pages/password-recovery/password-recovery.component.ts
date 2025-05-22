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

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
  imports: [
    NavbarComponent,
    FooterComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class PasswordRecoveryComponent implements OnInit {
  EmailForm: FormGroup;

  // Expresiones regulares
  private readonly EMAIL_REGEX =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(private fb: FormBuilder) {
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
    return;
  }

  ngOnInit() {}
}
