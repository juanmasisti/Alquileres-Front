import { Component, OnInit, Input } from '@angular/core';
import { Maquinaria } from 'src/app/models/maquinaria.model';
import { MaquinariaService } from '../../../services/maquinaria.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'ngx-bootstrap/rating';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RatingModule],
})
export class ReviewsComponent implements OnInit {
  @Input() maquinaria!: Maquinaria;
  rol = sessionStorage.getItem('rol');
  loading = false;
  reseniasCargando = false;
  resenias: any[] = [];
  comentarioRespondiendoId: number | null = null;
  comentarioTexto: string = '';
  respuestaTexto: string = '';

  constructor(private maquinariaService: MaquinariaService) {}

  ngOnInit() {
    this.cargarResenias();
    console.log('Comentarios iniciales:', this.resenias);
  }

  autoResize(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  cargarResenias(): void {
    this.resenias = this.maquinaria.resenias;
  }
}
