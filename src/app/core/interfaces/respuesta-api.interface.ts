export interface RespuestaApi<T> {
  codigo: number;
  message: string;
  data: T;
}

