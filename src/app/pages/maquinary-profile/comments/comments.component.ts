import { Component, OnInit, Input } from '@angular/core';
import { Maquinaria } from 'src/app/models/maquinaria.model';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  standalone: true,
})
export class CommentsComponent implements OnInit {
  @Input() maquinaria: Maquinaria | null = null;

  constructor() {}

  ngOnInit() {    
    console.log('Maquinaria en comentarios:', this.maquinaria);
  }
}
