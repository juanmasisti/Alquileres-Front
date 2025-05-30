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
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
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

  private validateRegex(regex: RegExp, errorKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No validar si está vacío (dejamos eso a Validators.required)
      }
      const isValid = regex.test(control.value);
      return isValid ? null : { [errorKey]: { value: control.value } };
    };
  }

  addImage(event: any) {
    const file = event.target.files?.[0];
    this.selectedFile = file ?? null;
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

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file && file.type !== 'image/png') {
      this.snackBar.open('Solo se permiten archivos PNG', 'Cerrar', {
        duration: 10000, // 3 segundos
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-center'],
      });

      (event.target as HTMLInputElement).value = '';
      return;
    }

    this.selectedFile = file ?? null;
  }
}
