import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {
  Location,
  ReturnPolicy,
  MaquinariaCategory,
  MaquinariaState,
} from '../../../../models/maquinaria.model';
import { CommonModule } from '@angular/common';
import { MaquinariaService } from '../../../../services/maquinaria.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImagesService } from 'src/app/services/images.service';

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
  alfa_regex: RegExp = /^[a-zA-Z0-9]+$/;
  invalidFile: boolean = false
  allowedExtensions: string[] = []

  // Enums expuestos al HTML
  locations = Object.values(Location);
  policies = Object.values(ReturnPolicy);
  categories = Object.values(MaquinariaCategory);
  states = Object.values(MaquinariaState);
  currentYear: number = new Date().getFullYear();
  selectedFile: File | null = null;
  cargaExitoso = false;

  private readonly router = inject(Router);

  constructor(
    private fb: FormBuilder,
    private maquinariaService: MaquinariaService,
    public dialogRef: MatDialogRef<MaquinariaModalComponent>,
    private imagesService: ImagesService
  ) {}

  ngOnInit(): void {
    this.setExtensions()
    this.maquinariaForm = this.fb.group({
      inventario: [
        '',
        [Validators.required, Validators.pattern(this.alfa_regex)],
      ],
      nombre: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio_adquisicion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      sucursal: ['', Validators.required],
      politica: ['', Validators.required],
      categoria: ['', Validators.required],
    });

    console.log('Controles del formulario:', this.maquinariaForm.controls);
  }

  private setExtensions() {
    this.imagesService.getExtensions().subscribe({
      next: (value) => {
        this.allowedExtensions = value
      }
    })
  }

  addImage(event: any) {
    const file = event.target.files?.[0];
    this.invalidFile = !file || this.allowedExtensions.find((ext) => file.name.endsWith(ext)) == null

    if (this.invalidFile) {
      (event.target as HTMLInputElement).value = '';
      this.selectedFile = null
    } else {
      this.selectedFile = file
    }
  }

  guardarMaquinaria() {
    if (this.maquinariaForm.invalid) {
      this.maquinariaForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const maqData = this.maquinariaForm.value;

    Object.entries(maqData).forEach(([key, value]) =>
      formData.append(key, value as any)
    );

    if (this.selectedFile)
      formData.set('image', this.selectedFile, this.selectedFile.name);

    this.loading = true;
    this.createError = null;

    this.maquinariaService.create(formData).subscribe({
      next: (response) => {
        console.log('Maquinaria creada con éxito:', response);
        this.maquinariaForm.reset();
        this.selectedFile = null;
        this.cargaExitoso = true;
      },
      error: (err) => {
        console.error('Error al crear maquinaria:', err);
        this.createError = err?.error?.message || 'Error desconocido.';
        this.loading = false;
      },
    });
  }

  recargar() {
    this.cerrar();
    window.location.reload();
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
