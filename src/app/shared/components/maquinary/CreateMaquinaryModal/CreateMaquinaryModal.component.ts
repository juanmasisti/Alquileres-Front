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
  loading = false;
  createError: string | null = null;

  // Enums expuestos al HTML
  locations = Object.values(Location);
  policies = Object.values(ReturnPolicy);
  categories = Object.values(MaquinariaCategory);
  states = Object.values(MaquinariaState);
  currentYear: number = new Date().getFullYear();
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private maquinariaService: MaquinariaService,
    public dialogRef: MatDialogRef<MaquinariaModalComponent>
  ) {}

  ngOnInit(): void {
    this.maquinariaForm = this.fb.group({
      //image: [''],
      inventario: ['', Validators.required],
      nombre: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio_adquisicion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      sucursal: ['', Validators.required],
      politica: ['', Validators.required],
      categoria: ['', Validators.required],

      //state: ['', Validators.required],
    });

    console.log('Controles del formulario:', this.maquinariaForm.controls);
  }

  guardarMaquinaria() {
    if (this.maquinariaForm.invalid) {
      this.maquinariaForm.markAllAsTouched();
      return;
    }

    const formValue = this.maquinariaForm.value;

    //const formData = new FormData();
    const formData = this.maquinariaForm.value;

    this.loading = true;
    this.createError = null;

    console.log('Datos del formulario:', formData);
    this.maquinariaService.create(formData).subscribe({
      next: (response) => {
        console.log('Maquinaria creada con éxito:', response);
        this.maquinariaForm.reset();
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Error al crear maquinaria:', err);
        this.createError = err?.error?.message || 'Error desconocido.';
        this.loading = false;
      },
    });
  }

  corregirAnio() {
    const control = this.maquinariaForm.get('anio_adquisicion');
    let value = Number(control?.value);

    if (isNaN(value)) return;

    if (value < 1900) {
      control?.setValue(1900);
    } else if (value > this.currentYear) {
      control?.setValue(this.currentYear);
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}
