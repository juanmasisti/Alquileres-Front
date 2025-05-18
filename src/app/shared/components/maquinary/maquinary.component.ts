import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Maquinaria, MaquinariaFilters } from 'src/app/models/maquinaria.model';
import { MaquinariaService } from 'src/app/services/maquinaria.service';

@Component({
  selector: 'app-maquinary',
  templateUrl: './maquinary.component.html',
  styleUrls: ['./maquinary.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ]
})
export class MaquinaryComponent implements OnInit {

  maquinarias: Maquinaria[] = [];
  filters: MaquinariaFilters = {};
  categorias: string[] = [];
  politicas: string[] = [];
  sucursales: string[] = [];
  estados: string[] = [];

  constructor(private maquinariaService: MaquinariaService) {}

  ngOnInit() {
      this.loadFilterOptions();
      this.fetchMachines();
    }

  fetchMachines() { // Busca las maquinarias por los filtros
    this.maquinariaService.getAll(this.filters).subscribe(data => {
      this.maquinarias = data;
    });
  }

  loadFilterOptions() {
    this.maquinariaService.getCategorias().subscribe(data => this.categorias = data);
    this.maquinariaService.getPoliticas().subscribe(data => this.politicas = data);
    this.maquinariaService.getSucursales().subscribe(data => this.sucursales = data);
    this.maquinariaService.getEstados().subscribe(data => this.estados = data);
  }

  clearFilters() {
    this.filters = {};
    this.fetchMachines();
  }

}

