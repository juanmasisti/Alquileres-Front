import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {
  Location,
  ReturnPolicy,
  MaquinariaCategory,
  MaquinariaState,
} from '../../../../models/maquinaria.model';
import { CommonModule } from '@angular/common';
import { MaquinariaService } from '../../../../services/maquinaria.service';

@Component({
  selector: 'app-CreateMaquinaryModal',
  templateUrl: './CreateMaquinaryModal.component.html',
  styleUrls: ['./CreateMaquinaryModal.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class MaquinariaModalComponent {
  maquinariaForm!: FormGroup;
  img_default: string =
    'https://img.pikbest.com/illustration/20250510/powerful-yellow-bulldozer-heavy-machinery-icon-side-view-for-engineering_11706143.jpg!sw800';

  loading = false;
  createError: string | null = null;

  // Enums expuestos al HTML
  locations = Object.values(Location);
  policies = Object.values(ReturnPolicy);
  categories = Object.values(MaquinariaCategory);
  states = Object.values(MaquinariaState);
  hoy!: string;

  constructor(
    private fb: FormBuilder,
    private maquinariaService: MaquinariaService,
    public dialogRef: MatDialogRef<MaquinariaModalComponent>
  ) {}

  ngOnInit(): void {
    this.maquinariaForm = this.fb.group({
      //imagen: [''],
      nombre: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio_adquisicion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      sucursal: ['', Validators.required],
      politica: ['', Validators.required],
      categoria: ['', Validators.required],
      inventario: ['', Validators.required],
      //state: ['', Validators.required],
    });
    const today = new Date();
    this.hoy = today.toISOString().split('T')[0];
  }

  guardarMaquinaria() {
    if (this.maquinariaForm.invalid) {
      this.maquinariaForm.markAllAsTouched();
      return;
    }

    const formValue = { ...this.maquinariaForm.value };

    // Si no se proporciona imagen, usar la predeterminada
    /* if (!formValue.imagen || formValue.imagen.trim() === '') {
      formValue.imagen = this.img_default;
    } */

    this.loading = true;
    this.createError = null;

    this.maquinariaService.create(formValue).subscribe({
      next: (response) => {
        console.log('Maquinaria creada con éxito:', response);
        this.maquinariaForm.reset();
      },
      error: (err) => {
        console.error('Error al crear maquinaria:', err);
        this.createError = err?.error?.message || 'Credenciales inválidas.';
        this.loading = false;
      },
    });
  }

  cerrar() {
    this.dialogRef.close();
  }
}
