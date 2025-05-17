import { Component, OnInit } from '@angular/core';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';

@Component({
  selector: 'app-maquinary-profile',
  templateUrl: './maquinary-profile.component.html',
  styleUrls: ['./maquinary-profile.component.scss'],
  imports: [NavbarComponent, FooterComponent],
})
export class MaquinaryProfileComponent implements OnInit {
  name: string = 'Maquina ejemplo';
  price: number = 1000;
  category: string = 'Categoria ejemplo';
  state: string = 'Estado ejemplo';
  politic: string = 'Politica ejemplo';
  branch: string = 'Sucursal ejemplo';

  brand: string = 'Marca ejemplo';
  model: string = 'Modelo ejemplo';
  year: number = 2023;

  constructor() {}

  ngOnInit() {}
}
