import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaquinariaService } from 'src/app/services/maquinaria.service';
import { AlquileresService } from 'src/app/services/alquileres.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { RatingModule } from 'ngx-bootstrap/rating';

@Component({
  selector: 'app-puntuar-modal',
  templateUrl: './puntuar-modal.component.html',
  styleUrls: ['./puntuar-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RatingModule, FormsModule],
})
export class PuntuarModalComponent implements OnInit {

  manageForm!: FormGroup;
  loading = false;
  alquiler: any = null;
  valorRating = 5

  constructor(
    private fb: FormBuilder,
    private maquinariaService: MaquinariaService,
    private alquilerService: AlquileresService,
    private dialogRef: MatDialogRef<PuntuarModalComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any //recibo la data del alquiler desde el componente management.component.ts
  ) {}

  ngOnInit() {
    this.alquiler = this.data.alquiler;
    this.manageForm = this.fb.group({
      observacion: [''],
    });
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

  openConfirmModal(): void {
    if (this.manageForm.invalid) return;

    const observacion = this.manageForm.get('observacion')?.value;

    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
      data: {
        title: `¿Confirmar puntuacion?`,
        description: `Estás confirmando la puntuacion de ${this.valorRating} estrella${this.valorRating > 1 ? 's' : ''} de la maquinaria "${this.alquiler.maquinaria.nombre}".`,
        confirmText: 'Confirmar',
        cancelText: 'Atrás',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loading = true;
        this.puntuarAlquiler(this.alquiler.id, this.valorRating, observacion);
      }
    });
  }

  puntuarAlquiler(id: number, puntaje: number, comentario?: string): void {
    this.alquilerService.puntuarAlquiler(id, puntaje, comentario).subscribe({
      next: () => {
        console.log(`Alquiler ${id} puntuado con puntaje: ${puntaje} ${comentario ? `y comentario: ${comentario}` : ''}`);
        this.dialogRef.close(true)
      },
      error: (error) => {
        console.error(`Error puntuando alquiler ${id}:`, error);
      },
    });
  }
}
