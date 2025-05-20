import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
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

  isLoading = false;
  private searchText$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private maquinariaService: MaquinariaService) {}

  ngOnInit() {
      this.loadFilterOptions();
      this.setupSearchDebounce();
      this.fetchMachines();
    }

 fetchMachines(): void {
    this.isLoading = true;
    this.maquinariaService.getAll(this.filters).subscribe({
      next: (data) => {
        this.maquinarias = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

   onSearchChange(): void {
    this.searchText$.next(this.filters.text || '');
  }

  loadFilterOptions() {
    this.maquinariaService.getCategorias().subscribe(data => this.categorias = data);
    this.maquinariaService.getPoliticas().subscribe(data => this.politicas = data);
    this.maquinariaService.getSucursales().subscribe(data => this.sucursales = data);
    this.maquinariaService.getEstados().subscribe(data => this.estados = data);
  }

  private setupSearchDebounce(): void {
    this.searchText$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.fetchMachines());
  }

  clearFilters() {
    this.filters = {};
    this.fetchMachines();
  }

   trackByMaquinariaId(index: number, maquinaria: Maquinaria): number {
    return maquinaria.id!;
  }

}

