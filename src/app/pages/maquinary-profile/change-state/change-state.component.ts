import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
} from '@angular/forms';
import { MaquinariaService } from 'src/app/services/maquinaria.service';
import { AlquileresService } from 'src/app/services/alquileres.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { LuxonDateModule } from '@angular/material-luxon-adapter';
import { Maquinaria } from 'src/app/models/maquinaria.model';
import { DateTime } from 'luxon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { CommentsComponent } from '../comments/comments.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-state',
  templateUrl: './change-state.component.html',
  styleUrls: ['./change-state.component.scss'],
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
    CommentsComponent
  ],
})
  
export class ChangeStateComponent implements OnInit {
  loading = false;

  minDate = new Date(); // Fecha mínima para el datepicker (hoy)
  maquinaria: Maquinaria | null = null;
  isLoading = true;
  error: string | null = null;
  mostrarModal = false;
  mostrarPagar = false;
  mostrarReservar: boolean = false;
  diasSeleccionados: number = 0;
  precioTotal: number = 0;
  beginDate?: Date;
  endDate?: Date;
  isAdmin = sessionStorage.getItem('rol') === 'admin'
  isEmployee = sessionStorage.getItem('rol') === 'empleado'
  isClient = sessionStorage.getItem('rol') === 'cliente'

  // Para el autocomplete de usuarios
  allUsers: any[] = [];
  filteredUsers: any[] = [];
  selectedClientEmail: string = '';
  emailExists: boolean = true;

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    const startDate = new Date(Date.now());
    const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días a partir de hoy

    if (view === 'month') {
      return cellDate >= startDate && cellDate <= endDate
        ? 'custom-date-class'
        : '';
    }
    return '';
  };

  constructor(
    private maquinariaService: MaquinariaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    //console.log('Alquiler recibido:', this.data.alquiler);
  }

  ngAfterViewInit() {
    const textarea = document.querySelector(
      'textarea.auto-grow'
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      });
    }
  }

  isDateEnabled = (date: Date | null): boolean => {
    if (!date) return false;
    return true;
  };

  onDateChanged(): void {
    if (this.beginDate && this.endDate) {
      // Normalizamos las fechas eliminando la parte de la hora
      const start = new Date(this.beginDate);
      const finish = new Date(this.endDate);

      start.setHours(0, 0, 0, 0);
      finish.setHours(0, 0, 0, 0);

      // Verificar que no se seleccione mas de 30 dias
      const maxDays = 30;
      if (finish.getTime() - start.getTime() > maxDays * 24 * 60 * 60 * 1000) {
        this.snackBar.open(
          `No se puede reservar por más de ${maxDays} días`,
          'Cerrar',
          { duration: 3000 }
        );
        this.beginDate = this.endDate = undefined;
        this.diasSeleccionados = this.precioTotal = 0;
        this.mostrarPagar = false;
        return;
      }

      const msInDay = 1000 * 60 * 60 * 24;
      const diffInDays = Math.ceil(
        (finish.getTime() - start.getTime()) / msInDay
      );

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

  openConfirmModal() {
    
  }
}
