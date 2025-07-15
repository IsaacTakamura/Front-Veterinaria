export interface SignoVital {
  signoVitalId?: number; // Identificador único del signo vital, tiene autocrecimiento en la API
  tipoSignoVitalId: number; // Identificador del tipo de signo vital
  valor: number; // Valor del signo vital (ej. temperatura, frecuencia cardíaca)
}
