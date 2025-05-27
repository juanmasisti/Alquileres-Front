import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Menu {
  path?: string;
  title?: string;
  type?: string;
  icon?: string;
  active?: boolean;
  children?: Menu[];
}

@Injectable({
  providedIn: 'root',
})
export class NavService {
  constructor() {}

  private MENUITEMS: Menu[] = [
    { title: 'INICIO', path: '/', type: 'link', icon: 'fas fa-home' },
    {
      title: 'MAQUINARIAS',
      path: 'maquinarias',
      type: 'fragment',
      icon: 'fas fa-tools',
    },
    {
      title: 'QUIENES SOMOS',
      path: '/quienes-somos',
      type: 'link',
      icon: 'fas fa-question-circle',
    },
    {
      title: 'CONTACTO',
      path: 'footer',
      type: 'fragment',
      icon: 'fas fa-envelope',
    },
  ];

  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
