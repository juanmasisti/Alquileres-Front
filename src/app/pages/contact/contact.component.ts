import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [HeaderComponent]
  
})
export class ContactComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
