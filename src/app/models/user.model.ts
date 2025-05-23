export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  nacimiento: string
  telefono?: string;
  direccion?: string;
  rol: string;
}