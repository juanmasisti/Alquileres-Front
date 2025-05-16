import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { LoginComponent } from '../Login/Login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
  ],
})
export class ContactComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
