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
import { RouterModule, Router, Route, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { PasswordService } from 'src/app/services/password.service';

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
  token: string | null = null;
  email: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private PasswordService: PasswordService,
    private route: ActivatedRoute
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
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.email = params['email'];
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

  changePass() {
    if (this.NewPassForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formData = this.NewPassForm.value;
    if (!this.token || !this.email) {
      return;
    }
    this.PasswordService.changePassword({
      token: this.token,
      email: this.email,
      newPassword: formData.password,
    }).subscribe({
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
}
