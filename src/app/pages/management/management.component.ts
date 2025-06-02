import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ReservasService } from '../../services/reservas.service';
import { Reserva } from 'src/app/models/reserva.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
  imports: [NavbarComponent, FooterComponent, CommonModule],
})
export class ManagementComponent implements OnInit {
  reservas: Reserva[] = [];

  constructor(private reservaService: ReservasService) {}

  ngOnInit() {
    this.fetchReservas();
    this.reservas = this.reservas.sort((a, b) => {
      return (
        new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime()
      );
    });
  }

  fetchReservas(): void {
    this.reservaService.getReservas().subscribe({
      next: (data) => {
        this.reservas = data.sort((a, b) => {
          return (
            new Date(b.fecha_inicio).getTime() -
            new Date(a.fecha_inicio).getTime()
          );
        });
        console.log('Reservas fetched and sorted:', this.reservas);
      },
      error: (error) => {
        console.error('Error fetching reservas:', error);
      },
    });
  }
}
