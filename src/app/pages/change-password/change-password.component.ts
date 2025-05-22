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

  constructor(private fb: FormBuilder) {
    this.changePassForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  private markAllAsTouched() {
    Object.values(this.changePassForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  ngOnInit() {}

  changePassword() {
    if (this.changePassForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formData = this.changePassForm.value;
    console.log('Formulario válido:', formData);

    //formData.password = formData.newPassword;

    const serialized = JSON.stringify(formData);
    console.log('JSON serializado:', serialized);

    sessionStorage.setItem('Usuario', serialized);

    // Leerlo inmediatamente para verificar
    /* const saved = sessionStorage.getItem('registroUsuario');
    console.log('Leído desde sessionStorage:', saved); */
  }
}
