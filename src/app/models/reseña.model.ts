import { User } from "./user.model";

export interface Reseña {
    id: number;
    puntaje: number;
    comentario?: string;
    autor : User;
    fecha: Date;
}