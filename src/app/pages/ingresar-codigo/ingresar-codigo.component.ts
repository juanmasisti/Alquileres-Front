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
  email = 'EmailEjemplo@test.com';

  constructor(private fb: FormBuilder) {
    this.CodeForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    });
  }

  ngOnInit() {}

  private markAllAsTouched() {
    Object.values(this.CodeForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  IngresarAdmin() {
    this.loading = true;
  }
}
