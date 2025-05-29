// maquinary-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material imports para datepicker + Luxon adapter
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LuxonDateModule, MAT_LUXON_DATE_ADAPTER_OPTIONS } from '@angular/material-luxon-adapter';

import { DateTime } from 'luxon';

import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { MaquinariaService } from 'src/app/services/maquinaria.service';
import { MercadoPagoService } from 'src/app/services/mercadoPago.service';
import { PagoModel } from 'src/app/models/pago.model';
import { environment } from 'src/environments/environment';
import { Maquinaria, MaquinariaState } from 'src/app/models/maquinaria.model';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';

declare var MercadoPago: any;

@Component({
  selector: 'app-maquinary-profile',
  templateUrl: './maquinary-profile.component.html',
  styleUrls: ['./maquinary-profile.component.scss'],
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    LuxonDateModule,
  ],
})
export class MaquinaryProfileComponent implements OnInit {
  maquinaria: Maquinaria | null = null;
  isLoading = true;
  error: string | null = null;
  mostrarModal = false;
  mostrarPagar = false;
  diasSeleccionados: number = 0;
  precioTotal: number = 0;
  beginDate?: Date;
  endDate?: Date;

    isAdmin =
    sessionStorage.getItem('rol') === 'admin' ||
    sessionStorage.getItem('rol') === 'empleado';

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    const startDate = new Date(Date.now());
    const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días a partir de hoy

    if (view === 'month') {
      return cellDate >= startDate && cellDate <= endDate ? 'custom-date-class' : '';
    }
    return '';
  }

  fechasOcupadas: { fecha_inicio: string, fecha_fin: string }[] = [];

  minDate = new Date(); // Fecha mínima para el datepicker (hoy)

  private bricksBuilder: any = null;
  private mp: any = null;

  constructor(
    private route: ActivatedRoute,
    private maquinariaService: MaquinariaService,
    private mercadoPagoService: MercadoPagoService,
    private dialog: MatDialog
    , private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.initMercadoPago();

    if (id) {
      this.loadMaquinaria(+id);
    } else {
      this.error = 'No se encontró el ID de la maquinaria';
      this.isLoading = false;
    }
  }

  private initMercadoPago() {
    const publicKey = environment.mercadoPagoPublicKey;
    this.mp = new MercadoPago(publicKey);
  }

  private initBricks() {
    this.bricksBuilder = this.mp.bricks();
  }

  private async renderWalletBrick(preferenceId: string) {
    await this.bricksBuilder.create('wallet', 'walletBrick_container', {
      initialization: {
        preferenceId,
        redirectMode: 'self',
      },
      customization: {
        theme: 'default',
        customStyle: {
          borderRadius: '10px',
          verticalPadding: '10px',
          horizontalPadding: '10px',
          hideValueProp: true,
        },
      },
    })

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
      },
      },
    );
    // Cargar fechas ocupadas
    this.maquinariaService.getFechasOcupadas(id).subscribe({
      next: (res: any) => {
        this.fechasOcupadas = res;
      },
      error: (err: any) => {
        console.error('Error cargando fechas ocupadas', err);
      },
    });
  }

  // Cuando el usuario selecciona rango en el datepicker
 onDateChanged(): void {
  if (this.beginDate && this.endDate) {
    // Normalizamos las fechas eliminando la parte de la hora
    const start = new Date(this.beginDate);
    const finish = new Date(this.endDate);

    start.setHours(0, 0, 0, 0);
    finish.setHours(0, 0, 0, 0);

    const msInDay = 1000 * 60 * 60 * 24;
    const diffInMs = finish.getTime() - start.getTime();
    const diffInDays = Math.floor(diffInMs / msInDay) + 1;

    if (diffInDays <= 0) {
      this.diasSeleccionados = 0;
      this.precioTotal = 0;
      this.mostrarPagar = false;
      return;
    }

    this.diasSeleccionados = diffInDays;
    const precioDia = this.maquinaria?.precio ?? 0;
    this.precioTotal = this.diasSeleccionados * precioDia;

    this.mostrarPagar = false;
    this.showMercadoPago(this.diasSeleccionados);

    console.log('Desde:', start);
    console.log('Hasta:', finish);
    console.log('Días:', this.diasSeleccionados);
    console.log('Precio:', this.precioTotal);
  } else {
    this.diasSeleccionados = 0;
    this.precioTotal = 0;
    this.mostrarPagar = false;
  }
}



isDateEnabled = (date: Date | null): boolean => {
  if (!date) return false;

  const luxonDate = DateTime.fromJSDate(date).startOf('day');

  // Si la fecha está dentro de un rango ocupado, devolver false
  const isOcupada = this.fechasOcupadas.some(({ fecha_inicio, fecha_fin }) => {
    const inicio = DateTime.fromISO(fecha_inicio).startOf('day');
    const fin = DateTime.fromISO(fecha_fin).startOf('day');
    return luxonDate >= inicio && luxonDate <= fin;
  });

  return !isOcupada;
};

formatearFecha(date: Date | null): string {
  return date ? DateTime.fromJSDate(date).toFormat('dd/MM/yyyy') : '';
}


  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = this.mostrarPagar = false;
    this.diasSeleccionados = 0;
    this.precioTotal = 0;
    this.beginDate = this.endDate = undefined
  }

  showMercadoPago(dias: number) {
    if (!this.maquinaria || !dias) return;

    const item: PagoModel = {
      id: this.maquinaria.id,
      days: dias,
    };

    this.mercadoPagoService.getPreferenceId(item).subscribe({
      next: (res) => {
        this.initBricks();
        this.renderWalletBrick(res.id);
        this.mostrarPagar = true;
      },
      error: (err) => {
        console.error('Error con MercadoPago', err);
      },
    });
  }

onStateChange(nuevoEstado: MaquinariaState) {
  if (this.maquinaria!.state === nuevoEstado) return;

  const dialogRef = this.dialog.open(ConfirmModalComponent, {
    width: '400px',
    data: {
      title: 'Confirmar cambio de estado',
      description: `¿Estás seguro de cambiar el estado a "${nuevoEstado}"?`,
      confirmText: 'Sí, cambiar',
      cancelText: 'Cancelar'
    }
  });

  dialogRef.afterClosed().subscribe((confirmado: boolean) => {
    if (confirmado) {
      this.maquinariaService.actualizarEstado(this.maquinaria!.id, nuevoEstado).subscribe({
        next: () => {
          this.maquinaria!.state = nuevoEstado; // ✅ Solo lo cambiamos si se confirma
          this.snackBar.open('Estado actualizado correctamente.', 'Cerrar', { duration: 3000 });
        },
        error: (err) => {
          console.error('Error al actualizar el estado:', err);
          this.snackBar.open('Ocurrió un error al actualizar el estado.', 'Cerrar', { duration: 3000 });
        }
      });
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

