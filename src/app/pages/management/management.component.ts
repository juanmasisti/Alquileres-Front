import { AlquileresService } from './../../services/alquileres.service';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ReservasService } from '../../services/reservas.service';
import { Reserva } from 'src/app/models/reserva.model';
import { CommonModule } from '@angular/common';
import { Maquinaria } from 'src/app/models/maquinaria.model';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { ManageModalComponent } from './manage-modal/manage-modal.component';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
  imports: [NavbarComponent, FooterComponent, CommonModule, MatDialogModule],
})
export class ManagementComponent implements OnInit {
  lista: any[] = [];
  loading: boolean = false;
  reservaExpandida: boolean = false;
  rol: string = sessionStorage.getItem('rol') ?? 'visitante';
  activeTab: 'reservas' | 'alquileres' = 'reservas';
  hoy = new Date();

  constructor(
    private reservaService: ReservasService,
    private alquilerService: AlquileresService,
    private dialog: MatDialog
  ) 
  { this.hoy.setHours(0, 0, 0, 0); }

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
    this.loading = true;
    this.reservaService.getReservas().subscribe({
      next: (data) => {
        this.lista = this.sortReservas(data);
        this.loading = false;
        console.log('Reservas fetched and sorted:', this.lista);
      },
      error: (error) => {
        console.error('Error fetching reservas:', error);
        this.loading = false;
      },
    });
  }

  private sortReservas(data: any[]): any[] {
    const statusPriority = (estado: string) => {
      switch (estado) {
        case 'Activa': return 1;
        case 'Cancelada': return 2;
        case 'Reembolsada': return 3;
        case 'Finalizada': return 3;
        default: return 4;
      }
    };

    return data.sort((a, b) => {
      const pa = statusPriority(a.estado);
      const pb = statusPriority(b.estado);

      if (pa !== pb) {
        return pa - pb;
      }

      const da = new Date(a.fecha_inicio).getTime();
      const db = new Date(b.fecha_inicio).getTime();

      if (pa === 1 || pa === 2) {
        return da - db;
      } else {
        return db - da;
      }
    });
  }

  fetchAlquileres(): void {
    this.lista = [];
    this.activeTab = 'alquileres';
    this.loading = true;
    this.alquilerService.getAlquileres().subscribe({
      next: (data) => {
        this.lista = this.sortAlquileres(data);
        this.loading = false;
        console.log('Alquileres fetched and sorted: ', this.lista);
      },
      error: (error) => {
        console.error('Error fetching alquileres: ', error);
        this.loading = false;
      },
    });
  }

  private sortAlquileres(data: any[]): any[] {
    const statusPriority = (estado: string) => {
      switch (estado) {
        case 'Activo': return 1;
        case 'Finalizado': return 2;
        default: return 2;
      }
    };

    return data.sort((a, b) => {
      const pa = statusPriority(a.estado);
      const pb = statusPriority(b.estado);

      if (pa !== pb) {
        return pa - pb;
      }

      const da = new Date(a.fecha_inicio).getTime();
      const db = new Date(b.fecha_inicio).getTime();

      if (pa === 1) {
        return da - db;
      } else {
        return db - da;
      }
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
        this.cancelarReserva(id);
      }
    });
  }

  cancelarReserva(id: number): void {
    this.reservaService.cancelarReserva(id).subscribe({
      next: () => {
        console.log(`Reserva ${id} cancelled successfully`);
        this.fetchReservas();
      },
      error: (error) => {
        console.error(`Error cancelling reserva ${id}:`, error);
      },
    });
  }

  modalConfirmarReserva( id: number , maquina: Maquinaria): void {
      const dialogRef = this.dialog.open(ConfirmModalComponent, {
        width: '400px',
        data: {
          title: `¿Confirmar entrega de ${maquina.nombre}?`,
          description: `Se confirmará la entrega de ${ maquina.nombre }.`,
          confirmText: 'Confirmar',
          cancelText: 'Atrás',
        },
  });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.confirmarReserva(id, 'entregado');
      }
    });
  }

  modalConfirmarReembolso(
    id: number,
    maquina: Maquinaria,
    precioTotal: number
  ): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
      data: {
        title: `¿Confirmar reembolso de ${maquina.nombre}?`,
        description: `Se confirmará el reembolso de ${maquina.nombre} con un costo total de $${precioTotal}.`,
        confirmText: 'Confirmar',
        cancelText: 'Atrás',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.confirmarReserva(id, 'reembolso');
      }
    });
  }

  confirmarReserva(id: number, estado: string): void {
    this.reservaService.confirmarReserva(id).subscribe({
      next: () => {

        if (estado === 'entregado') {
          console.log(`Reserva ${id} confirmada. Se entregó la maquinaria.`);
        }
        else if (estado === 'reembolso') {
          console.log(`Reserva ${id} reembolsada.`);
        }
        this.fetchReservas();
      },
      error: (error) => {
        console.error(`Error confirmando reserva ${id}:`, error);
      },
    });
  }

  modalPuntuarAlquiler(alquiler : any): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
      data: {
        title: `¿Puntuar alquiler de ${alquiler.maquinaria.nombre}?`,
        description: `Se puntuara el alquiler de ${alquiler.maquinaria.nombre}.`,
        confirmText: 'Puntuar',
        cancelText: 'Atrás',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // Puntaje + comentario de testeo
        // comentario es opcional
        const puntaje = 5
        let comentario = null

        if (comentario === null) this.puntuarAlquiler(alquiler.id, puntaje);
        else this.puntuarAlquiler(alquiler.id, puntaje, comentario);
      }
    })
  }

  puntuarAlquiler(id: number, puntaje: number, comentario?: string): void {
    this.alquilerService.puntuarAlquiler(id, puntaje, comentario).subscribe({
      next: () => {
        console.log(`Alquiler ${id} puntuado.`);
        this.fetchAlquileres();
      },
      error: (error) => {
        console.error(`Error puntuando alquiler ${id}:`, error);
      },
    });
  }

  modalConfirmarAlquiler(alquiler: any): void {
    this.dialog.open(ManageModalComponent, {
      width: '500px', // podés ajustar el ancho
      data: { alquiler: alquiler, callback: this.fetchAlquileres.bind(this) }, // Pasar la función de actualización
    });
  }

  toggleExpandida(reserva: any) {
    this.reservaExpandida = this.reservaExpandida === reserva ? null : reserva;
  }

  diasEntre(fechaInicio: string, fechaFin: string): number {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return Math.ceil(
      (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  confirmarAlquiler(id: number, comentario?: string): void {
    this.alquilerService.confirmarAlquiler(id, comentario).subscribe({
      next: () => {
        console.log(`Recepción de alquiler ${id} confirmada.`);
        this.fetchAlquileres();
      },
      error: (error) => {
        console.error(`Error confirmando recepción de alquiler ${id}:`, error);
      },
    });
  }

  reservaIniciada(fecha_inicio: string) {
    const reservaDate = new Date(fecha_inicio);
    reservaDate.setHours(0, 0, 0, 0);
    return reservaDate <= this.hoy;
  }
}
