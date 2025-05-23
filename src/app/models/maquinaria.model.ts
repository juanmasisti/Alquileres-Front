// Enums sincronizados con el backend
export enum MaquinariaState {
  Disponible = 'Disponible',
  Mantenimiento = 'Mantenimiento',
  Eliminado = 'Eliminado'
}

export enum ReturnPolicy {
  devolucion_0 = '0%',
  devolucion_20 = '20%',
  devolucion_100 = '100%'
}

export enum MaquinariaCategory {
  Jardineria = 'Jardinería',
  Construccion = 'Construcción',
  Agricultura = 'Agricultura',
  Mineria = 'Minería',
  Logistica = 'Logística',
  Transporte = 'Transporte',
  Otro = 'Otro'
}

export enum Location {
  LaPlata = 'La Plata',
  Tandil = 'Tandil',
  Ensenada = 'Ensenada',
  BahiaBlanca = 'Bahía Blanca'
}

// Modelo principal
export interface Maquinaria {
  id?: number;
  nombre: string;
  marca: string;
  modelo: string;
  anio_adquisicion: number;
  precio: number;
  sucursal: Location;
  politica: ReturnPolicy;
  categoria: MaquinariaCategory;
  state?: MaquinariaState;
  imagen?: string;
}

// Filtros aplicables
export interface MaquinariaFilters {
  text?: string;
  categoria?: MaquinariaCategory | '';
  sucursal?: Location | '';
  politica?: ReturnPolicy | '';
  state?: MaquinariaState | '';
}
