import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [NavbarComponent]
})
export class HeaderComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
