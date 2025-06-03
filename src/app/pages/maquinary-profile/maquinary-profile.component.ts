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
import { AuthService } from 'src/app/services/auth.service';
import { ReservasService } from 'src/app/services/reservas.service';

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
  mostrarReservar: boolean = false
  diasSeleccionados: number = 0;
  precioTotal: number = 0;
  beginDate?: Date;
  endDate?: Date;
  isAdmin = sessionStorage.getItem('rol') === 'admin'

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
  private paymentBrickController: any = null

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private maquinariaService: MaquinariaService,
    private mercadoPagoService: MercadoPagoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.minDate.setDate(this.minDate.getDate() + 1)
  }

  isClient() {
    return !!this.authService.getToken() && !this.isAdmin;
  }

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

  // https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-settings/user-interface/auxiliary-callbacks
  private async renderWalletBrick(preferenceId: string, cb: Function = () => { }) {
    if (this.creandoBrick) return
    this.creandoBrick = true
    this.paymentBrickController = await this.bricksBuilder.create('wallet', 'walletBrick_container', {
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
      callbacks: {
        onSubmit: cb,
        onReady: () => {
          this.creandoBrick = false
          this.mostrarPagar = true
        }
     },
    })
  }

  private loadMaquinaria(id: number): void {
    this.maquinariaService.getById(id).subscribe({
      next: (data) => {
        this.maquinaria = data;
        if (this.maquinaria.state == MaquinariaState.Disponible && this.isClient()) {
          this.setFechasOcupadas(id)
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles de la maquinaria';
        this.isLoading = false;
        console.error(err);
      },
      },
    );
  }

  private setFechasOcupadas(id: number) {
    this.maquinariaService.getFechasOcupadas(id).subscribe({
      next: (res: any) => {
        this.fechasOcupadas = res;
        this.mostrarReservar = true
        this.printFechasOcupadas()
      },
      error: (err: any) => {
        console.error('Error cargando fechas ocupadas', err);
        this.mostrarReservar = true
      },
    });
  }

  private printFechasOcupadas() {
    this.fechasOcupadas.forEach(({ fecha_fin, fecha_inicio }) => {
      const inicio_formated = DateTime.fromISO(fecha_inicio);
      const fin_formated = DateTime.fromISO(fecha_fin)
      console.log(
        `---- Fecha ocupada ----\n`,
        `Inicio: ${inicio_formated.day}-${inicio_formated.month}-${inicio_formated.year}\n`,
        `Fin: ${fin_formated.day}-${fin_formated.month}-${fin_formated.year}\n`,
      ) 
    })
  }

  private containsOccupiedDatesInRange (start: Date, end: Date): boolean {
  const startDate = DateTime.fromJSDate(start).startOf('day');
  const endDate = DateTime.fromJSDate(end).startOf('day');

  for (const { fecha_inicio, fecha_fin } of this.fechasOcupadas) {
    const inicioOcupada = DateTime.fromISO(fecha_inicio).startOf('day');
    const finOcupada = DateTime.fromISO(fecha_fin).startOf('day');

    if (inicioOcupada <= endDate && finOcupada >= startDate) {
      // Hay superposición entre el rango seleccionado y una fecha ocupada
      return true;
    }
  }

  return false;
}

  // Cuando el usuario selecciona rango en el datepicker
  onDateChanged(): void {
    if (this.beginDate && this.endDate) {
      // Normalizamos las fechas eliminando la parte de la hora
      const start = new Date(this.beginDate);
      const finish = new Date(this.endDate);

      start.setHours(0, 0, 0, 0);
      finish.setHours(0, 0, 0, 0);

      this.destroyMp()

      // ⚠ Verificamos si el rango cruza fechas ocupadas
      if (this.containsOccupiedDatesInRange(start, finish)) {
        this.snackBar.open('El rango contiene fechas ya reservadas', 'Cerrar', { duration: 3000 });
        this.beginDate = this.endDate = undefined;
        this.diasSeleccionados = this.precioTotal = 0;
        this.mostrarPagar = false;
        return;
      }

      const msInDay = 1000 * 60 * 60 * 24;
      const diffInDays = Math.ceil((finish.getTime() - start.getTime()) / msInDay);

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

    const formatDate = DateTime.fromISO(date.toString())
    let ocupada = false

    for (const { fecha_inicio, fecha_fin } of this.fechasOcupadas) {
      const inicio = DateTime.fromISO(fecha_inicio).startOf('day');
      const fin = DateTime.fromISO(fecha_fin).startOf('day');
      if (formatDate >= inicio && formatDate <= fin) {
        ocupada = true;
        break;
      }
    }

    return !ocupada;
  };

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = this.mostrarPagar = false;
    this.diasSeleccionados = 0;
    this.precioTotal = 0;
    this.beginDate = this.endDate = undefined
  }

  destroyMp() {
    if (this.paymentBrickController != null) {
      this.paymentBrickController.unmount()
      this.paymentBrickController = null
    }
  }

  private creandoBrick = false

  showMercadoPago(dias: number) {
    if (!this.maquinaria || !dias || !this.beginDate || !this.endDate) return;

    const item: PagoModel = {
      maq_id: this.maquinaria.id,
      days: dias,
      startDate: this.beginDate,
      endDate: this.endDate
    };

    if(this.creandoBrick) return

    this.destroyMp()

    this.mercadoPagoService.getPreferenceId(item).subscribe({
      next: async (res) => {
        this.initBricks();
        this.renderWalletBrick(res.id)
      },
      error: (err) => {
        console.error('Error con MercadoPago', err);
      },
    });
  }

  onStateChange(event: any) {

    const nuevoEstado = event.target.value

    if (this.maquinaria == null) return
    if (this.maquinaria.state === nuevoEstado) return;

    const prevState = this.maquinaria!.state
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
      this.destroyMp()
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
      } else {
        event.target.value = prevState
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