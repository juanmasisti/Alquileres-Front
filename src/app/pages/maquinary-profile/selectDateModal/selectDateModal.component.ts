import { Maquinaria } from './../../../models/maquinaria.model';
import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MaquinariaService } from 'src/app/services/maquinaria.service';
import { AlquileresService } from 'src/app/services/alquileres.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { LuxonDateModule } from '@angular/material-luxon-adapter';
import { DateTime } from 'luxon';

import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-selectDateModal',
  templateUrl: './selectDateModal.component.html',
  styleUrls: ['./selectDateModal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    LuxonDateModule,
  ],
})
export class selectDateModalComponent implements OnInit {
  minDate = new Date(); // Fecha mínima para el datepicker (hoy)
  fechaMantenimiento!: Date;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private maquinariaService: MaquinariaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar // ← esto es lo que faltaba
  ) {}

  ngOnInit() {}

  isDateEnabled = (date: Date | null): boolean => {
    if (!date) return false;
    return true;
  };

  onDateChanged(): void {
    if (this.fechaMantenimiento) {
      const fechaLuxon = DateTime.fromJSDate(this.fechaMantenimiento);
      fechaLuxon.toISODate();
    }
  }

  openConfirmModal() {
    console.log('Abriendo modal de confirmación');
    console.log('fechaMantenimiento:', this.fechaMantenimiento);
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
      data: {
        title: `¿Está seguro de que desea cambiar el estado de ${this.data.maquinaria.nombre} de ${this.data.currentState} a ${this.data.newState}?`,
        confirmText: 'Sí, cambiar',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      console.log('Modal cerrado, confirmado:', confirmado);
      if (confirmado) {
        console.log('Actualizando estado de la maquinaria');
        this.maquinariaService
          .actualizarEstado(
            this.data.id,
            this.data.newState,
            this.fechaMantenimiento
          )
          .subscribe({
            next: () => {},
            error: (err) => {
              console.error('Error al actualizar el estado:', err);
              this.snackBar.open(
                '❌ Error al actualizar el estado de la maquinaria',
                'Cerrar',
                {
                  duration: 4000,
                  panelClass: ['error-snackbar'],
                }
              );
            },
          });
      } else {
        console.log('Cambio de estado cancelado');
      }
      this.closeModal();
    });
  }

  closeModal() {
    this.dialog.closeAll();
  }
}
