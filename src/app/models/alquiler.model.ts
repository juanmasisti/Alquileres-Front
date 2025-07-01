import { Maquinaria } from './maquinaria.model';
import { Location } from './maquinaria.model';
import { Reseña } from './reseña.model';
import { User } from './user.model'; // Asegúrate de que la ruta sea correcta
//import { formatISO } from 'date-fns'; //puedo necesitarlo para formatear fechas

// Enums específicos de la reserva
export enum AlquilerState {
  Retirada = 'Activo',
  Devuelta = 'Finalizado',
}

// Modelo principal de Reserva
export interface Alquiler {
  maquinaria: Maquinaria;
  codigo_reserva: string;
  usuario: User;
  fecha_inicio: Date;
  fecha_fin: Date;
  sucursal: Location;
  estado: AlquilerState;
  precio_total: number;
  reseña: Reseña;
}
