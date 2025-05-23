import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-testear',
  templateUrl: './testear.component.html',
  styleUrls: ['./testear.component.css'],
})
export class TestComponent implements OnInit {
  constructor() {}
  ngOnInit() {}

  //El componente se aloja en http://localhost:4200/test

  //cambia el endpoint segun tu necesidad
  private endpoint = 'ejemplo';
  private readonly baseUrl = `${environment.apiUrl}/${this.endpoint}`;

  input = document.getElementById('input');
  button = document.getElementById('btn');
}
