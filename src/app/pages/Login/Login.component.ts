import { Component, OnInit } from '@angular/core';
import { Form } from '@angular/forms';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.scss'],
  imports: [FormsModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
ingresar() {
throw new Error('Method not implemented.');
}
  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;

  constructor() {
    this.email = new FormControl('');
    this.password = new FormControl('');

    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit() {}
}
