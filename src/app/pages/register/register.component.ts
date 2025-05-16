import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  name: FormControl;
  lastName: FormControl;
  email: FormControl;
  password: FormControl;
  dni: FormControl;
  birthDate: FormControl;

  constructor() {
    this.name = new FormControl('');
    this.lastName = new FormControl('');
    this.email = new FormControl('');
    this.password = new FormControl('');
    this.dni = new FormControl('');
    this.birthDate = new FormControl('');

    this.registerForm = new FormGroup({
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      dni: this.dni,
      birthDate: this.birthDate,
    });
  }

  minDate!: string;
  maxDate!: string;

  ngOnInit() {
    const today = new Date();
    //edad minima, hace 18 años
    const maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    this.maxDate = maxDate.toISOString().split('T')[0];

    //edad maxima, hace 80 años
    const minDate = new Date(
      today.getFullYear() - 80,
      today.getMonth(),
      today.getDate()
    );
    this.minDate = minDate.toISOString().split('T')[0];
  }

  registrarUsuario() {
    console.log(this.registerForm.value);
  }
}
