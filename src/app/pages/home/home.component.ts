import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [NavbarComponent],
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
