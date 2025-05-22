import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaquinariaService } from '../../services/maquinaria.service';
import { Maquinaria } from '../../models/maquinaria.model';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maquinary-profile',
  templateUrl: './maquinary-profile.component.html',
  styleUrls: ['./maquinary-profile.component.scss'],
  imports: [NavbarComponent, FooterComponent, CommonModule],
  standalone: true
})
export class MaquinaryProfileComponent implements OnInit {
  maquinaria: Maquinaria | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private maquinariaService: MaquinariaService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.loadMaquinaria(+id);
    } else {
      this.error = 'No se encontró el ID de la maquinaria';
      this.isLoading = false;
    }
  }

  private loadMaquinaria(id: number): void {
    this.maquinariaService.getById(id).subscribe({
      next: (data) => {
        this.maquinaria = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles de la maquinaria';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  getStatusClass(status: string): string {
    switch(status.toLowerCase()) {
      case 'disponible': return 'available';
      case 'alquilada': return 'rented';
      case 'mantenimiento': return 'maintenance';
      default: return '';
    }
  }
}