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
  reservas: Reserva[] = [];

  constructor(
    private reservaService: ReservasService,
    private dialog: MatDialog
  ) {}

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

  modalCancelarReserva(
    id: number,
    maquina: Maquinaria,
    precioTotal: number
  ): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
      data: {
        title: `¿Cancelar Reserva de ${maquina.nombre}?`,
        description: `Se cancelará la reserva de ${
          maquina.nombre
        } con un costo total de $${precioTotal}. Y se te reembolsará el ${
          maquina.politica
        } del importe. $${precioTotal * (parseInt(maquina.politica) / 100)}.`,
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
