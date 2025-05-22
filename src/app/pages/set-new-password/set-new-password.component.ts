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
import { RouterLink, RouterModule } from '@angular/router';

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

  constructor(private fb: FormBuilder) {
    this.NewPassForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {}

  changePass() {
    const formData = this.NewPassForm.value;
    console.log('Nueva Contraseña', formData);

    alert(
      'La contraseña se ha cambiado correctamente. Por favor, inicie sesión nuevamente.'
    );
  }
}
