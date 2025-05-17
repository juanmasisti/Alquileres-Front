import { Component, OnInit } from '@angular/core';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { ManageComponent } from "./manage/manage.component";

@Component({
  selector: 'app-person-profile',
  templateUrl: './person-profile.component.html',
  styleUrls: ['./person-profile.component.scss'],
  imports: [NavbarComponent, FooterComponent, ManageComponent],
})
export class PersonProfileComponent implements OnInit {
  name: string = 'Nombre';
  lastName: string = 'Apellido ';
  email: string = 'eMail@test.com';
  phone: string = '2212345678';
  DNI: string = '44254667';
  BirthDate: string = '17/03/1999';

  constructor() {}

  ngOnInit() {}
}
