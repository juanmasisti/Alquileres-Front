import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaquinariaService } from 'src/app/services/maquinaria.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
export class SelectDateModalComponent implements OnInit {
  minDate = new Date(); // Fecha mínima para el datepicker (hoy)
  fechaMantenimiento!: Date;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private maquinariaService: MaquinariaService,
    private dialogRef: MatDialogRef<SelectDateModalComponent>,
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
        description: `Se cancelaran todas las reservas ${
          this.fechaMantenimiento
            ? `desde ${this.formtDate(new Date())} hasta ${this.formtDate(
                this.fechaMantenimiento
              )}`
            : ''
        } de la maquinaria`,
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
            this.data.maquinaria.id,
            this.data.newState,
            this.fechaMantenimiento
          )
          .subscribe({
            next: () => {
              this.snackBar.open(
                'Estado actualizado correctamente.',
                'Cerrar',
                { duration: 3000 }
              );
              this.closeModal(true);
            },
            error: (err) => {
              console.error('Error al actualizar el estado:', err);
              const mensajeError =
                '❌ ' + err?.error?.message ||
                '❌ Error al actualizar el estado de la maquinaria';

              this.snackBar.open(mensajeError, 'Cerrar', {
                duration: 4000,
                panelClass: ['error-snackbar'],
              });

              this.closeModal();
            },
          });
      }
    });
  }

  private formtDate(date: any) {
    return Intl.DateTimeFormat('es-AR').format(date).toString();
  }

  closeModal(val: boolean = false) {
    this.dialogRef.close(val);
  }
}
