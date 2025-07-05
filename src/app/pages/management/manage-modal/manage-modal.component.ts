import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MaquinariaService } from 'src/app/services/maquinaria.service';
import { AlquileresService } from 'src/app/services/alquileres.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-manage-modal',
  templateUrl: './manage-modal.component.html',
  styleUrls: ['./manage-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ManageModalComponent implements OnInit {
  //estados: string[] = [];
  manageForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private maquinariaService: MaquinariaService,
    private alquilerService: AlquileresService,
    private dialogRef: MatDialogRef<ManageModalComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any //recibo la data del alquiler desde el componente management.component.ts
  ) {}

  ngOnInit() {
    console.log('Alquiler recibido:', this.data.alquiler);

    this.manageForm = this.fb.group({
      //estado: ['', Validators.required],
      observacion: [''],
    });

    //this.loadStatesOptions();
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

  /* loadStatesOptions() {
    this.maquinariaService
      .getEstados()
      .subscribe((data) => (this.estados = data));
  } */

  openConfirmModal(): void {
    if (this.manageForm.invalid) return;

    const observacion = this.manageForm.get('observacion')?.value;

    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
      data: {
        title: `¿Confirmar devolución?`,
        description: `Estás confirmando la devolución de la maquinaria "${
          this.data.alquiler.maquinaria.nombre
        }" a la sucursal de "${this.data.alquiler.maquinaria.sucursal}".
        ${
          this.data.alquiler.deuda > 0
            ? 'El retraso de la devolucion genero una deuda pendiente de $' +
              this.data.alquiler.deuda +
              '.'
            : ''
        }`,
        confirmText: 'Confirmar',
        cancelText: 'Atrás',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loading = true;
        this.alquilerService
          .confirmarAlquiler(this.data.alquiler.id, observacion)
          .subscribe({
            next: (res) => {
              console.log('Alquiler confirmado correctamente:', res);
              this.loading = false;

              this.data.callback(); // Llamar al callback para actualizar la lista de alquileres
              this.dialogRef.close(true);
            },
            error: (err) => {
              console.error('Error al confirmar alquiler:', err);
              this.loading = false;

              // Mostrar un modal con el mensaje de error
              this.dialog.open(ConfirmModalComponent, {
                width: '400px',
                data: {
                  title: 'Error al confirmar',
                  description:
                    'Ocurrió un error al confirmar la devolución. Por favor, intentá nuevamente más tarde.',
                  confirmText: 'Cerrar',
                },
              });
              this.dialogRef.close();
            },
          });
      }
    });
  }
}
