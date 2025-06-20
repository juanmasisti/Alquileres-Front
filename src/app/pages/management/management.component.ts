import { AlquileresService } from './../../services/alquileres.service';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ReservasService } from '../../services/reservas.service';
import { Reserva } from 'src/app/models/reserva.model';
import { CommonModule } from '@angular/common';
import { Maquinaria } from 'src/app/models/maquinaria.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
  imports: [NavbarComponent, FooterComponent, CommonModule],
})
export class ManagementComponent implements OnInit {
  lista: any[] = [];
  loading: boolean = true;
  rol: string = sessionStorage.getItem('rol') ?? 'visitante';
  activeTab: 'reservas' | 'alquileres' = 'reservas'; // Default to reservas

  constructor(
    private reservaService: ReservasService,
    private alquilerService: AlquileresService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchReservas();
    this.lista = this.lista.sort((a, b) => {
      return (
        new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime()
      );
    });
  }

  fetchReservas(): void {
    this.lista = [];
    this.activeTab = 'reservas';
    this.reservaService.getReservas().subscribe({
      next: (data) => {
        this.lista = data.sort((a, b) => {
          return (
            new Date(b.fecha_inicio).getTime() -
            new Date(a.fecha_inicio).getTime()
          );
        });
        this.loading = false;
        console.log('Reservas fetched and sorted:', this.lista);
      },
      error: (error) => {
        console.error('Error fetching reservas:', error);
        this.loading = false;
      },
    });
  }

  fetchAlquileres(): void {
    this.lista = [];
    this.activeTab = 'alquileres';
    this.alquilerService.getAlquileres().subscribe({
      next: (data) => {
        this.lista = data.sort((a, b) => {
          return (
            new Date(b.fecha_inicio).getTime() -
            new Date(a.fecha_inicio).getTime()
          );
        });
        this.loading = false;
        console.log('Alquileres fetched and sorted: ', this.lista);
      },
      error: (error) => {
        console.error('Error fetching alquileres: ', error);
        this.loading = false;
      },
    });
  }

  modalCancelarReserva(
    id: number,
    maquina: Maquinaria,
    precioTotal: number
  ): void {
    let politica = String(maquina.politica);
    if (this.rol !== 'cliente') {
      politica = '100%';
    }
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
      data: {
        title: `¿Cancelar Reserva de ${maquina.nombre}?`,
        description: `Se cancelará la reserva de ${
          maquina.nombre
        } con un costo total de $${precioTotal}.\nY se reembolsará el ${politica} del importe. $${
          precioTotal * (parseInt(politica) / 100)
        }.`,
        confirmText: 'Cancelar Reserva',
        cancelText: 'Atrás',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.cancelarReserva(id); // ← Solo se ejecuta si el usuario confirmó
      }
    });
  }

  cancelarReserva(id: number): void {
    this.reservaService.cancelarReserva(id).subscribe({
      next: () => {
        console.log(`Reserva ${id} cancelled successfully`);
        this.fetchReservas(); // Refresh the list after cancellation
      },
      error: (error) => {
        console.error(`Error cancelling reserva ${id}:`, error);
      },
    });
  }
}
