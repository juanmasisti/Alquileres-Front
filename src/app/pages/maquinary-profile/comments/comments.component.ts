import { Component, OnInit, Input } from '@angular/core';
import { Maquinaria } from 'src/app/models/maquinaria.model';
import { MaquinariaService } from '../../../services/maquinaria.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CommentsComponent implements OnInit {
  @Input() maquinaria!: Maquinaria;
  rol = sessionStorage.getItem('rol');
  loading = false;
  comentariosCargando = false;
  comentarios: any[] = [];
  comentarioRespondiendoId: number | null = null;
  comentarioTexto: string = '';
  respuestaTexto: string = '';

  constructor(private maquinariaService: MaquinariaService) {}

  ngOnInit() {
    this.cargarComentarios();
    console.log('Comentarios iniciales:', this.comentarios);
  }

  autoResize(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  cargarComentarios(): void {
    this.comentariosCargando = true;

    const id = this.maquinaria.id;
    console.log('Cargando comentarios para:', this.maquinaria.nombre);

    this.maquinariaService.getComentarios(id).subscribe({
      next: (res) => {
        console.log('Comentarios recibidos:', res);
        this.comentarios = res;
      },
      error: (err) => {
        console.error('Error al cargar comentarios:', err);
      },
      complete: () => {
        this.comentariosCargando = false;
      },
    });
  }

  switchRespondiendo(id: number) {
    if (this.comentarioRespondiendoId === id) {
      // Si ya estaba abierto, se cierra
      this.comentarioRespondiendoId = null;
      this.respuestaTexto = '';
    } else {
      // Si no, abre el textarea para ese comentario
      this.comentarioRespondiendoId = id;
      this.respuestaTexto = '';
    }
  }

  enviarComentario() {
    const texto = this.comentarioTexto;
    if (!texto) return;

    console.log('Comentario enviado: ', texto);
    this.maquinariaService
      .postComentario(this.maquinaria.id, texto)
      .subscribe(() => {
        this.comentarioTexto = ''; // limpiar el campo
      });
    this.cargarComentarios(); // recargar comentarios después de enviar
  }

  enviarRespuesta(idComentario: number) {
    const texto = this.respuestaTexto;
    if (!texto) return;

    console.log('Respuesta enviada: ', texto);
    this.maquinariaService.postRespuesta(idComentario, texto).subscribe(() => {
      this.respuestaTexto = ''; // limpiar el campo
      this.switchRespondiendo(idComentario); // cerrar textarea
    });
    this.cargarComentarios(); // recargar comentarios después de enviar
  }
}
