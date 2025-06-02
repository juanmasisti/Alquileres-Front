import { Maquinaria } from './maquinaria.model';
import { Location, ReturnPolicy } from './maquinaria.model';
import { User } from './user.model'; // Asegúrate de que la ruta sea correcta
//import { formatISO } from 'date-fns'; //puedo necesitarlo para formatear fechas

// Enums específicos de la reserva
export enum ReservaState {
  Activa = 'Activa',
  Cancelada = 'Cancelada',
  Finalizada = 'Finalizada',
  Reembolsada = 'Reembolsada',
}

// Modelo principal de Reserva
export interface Reserva {
  id: number;
  codigo_reserva: string;
  maquinaria: Maquinaria;
  usuario: User;
  fecha_inicio: Date;
  fecha_fin: Date;
  precio_dia: number;
  precio_total: number;
  sucursal: Location;
  politica: ReturnPolicy;
  estado: ReservaState;
}
