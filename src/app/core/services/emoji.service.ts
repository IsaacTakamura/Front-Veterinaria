import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmojiService {
  // Clave para almacenar en localStorage
  private readonly STORAGE_KEY = 'vet_especies_emojis';
  
  // Map de especieId -> emoji
  private emojiMap: Map<number, string> = new Map();
  
  // Lista de emojis disponibles para especies
  readonly animalEmojis = [
    { emoji: '🐕', nombre: 'Perro' },
    { emoji: '🐩', nombre: 'Caniche' },
    { emoji: '🐺', nombre: 'Lobo' },
    { emoji: '🦊', nombre: 'Zorro' },
    { emoji: '🐱', nombre: 'Gato' },
    { emoji: '🦁', nombre: 'León' },
    { emoji: '🐯', nombre: 'Tigre' },
    { emoji: '🐆', nombre: 'Leopardo' },
    { emoji: '🐅', nombre: 'Tigre' },
    { emoji: '🐎', nombre: 'Caballo' },
    { emoji: '🦄', nombre: 'Unicornio' },
    { emoji: '🦓', nombre: 'Cebra' },
    { emoji: '🦌', nombre: 'Ciervo' },
    { emoji: '🐄', nombre: 'Vaca' },
    { emoji: '🐂', nombre: 'Buey' },
    { emoji: '🐃', nombre: 'Búfalo de agua' },
    { emoji: '🐑', nombre: 'Oveja' },
    { emoji: '🐐', nombre: 'Cabra' },
    { emoji: '🐪', nombre: 'Camello' },
    { emoji: '🐘', nombre: 'Elefante' },
    { emoji: '🦏', nombre: 'Rinoceronte' },
    { emoji: '🦛', nombre: 'Hipopótamo' },
    { emoji: '🐭', nombre: 'Ratón' },
    { emoji: '🐁', nombre: 'Ratón' },
    { emoji: '🐀', nombre: 'Rata' },
    { emoji: '🐹', nombre: 'Hámster' },
    { emoji: '🐰', nombre: 'Conejo' },
    { emoji: '🐇', nombre: 'Conejo' },
    { emoji: '🦔', nombre: 'Erizo' },
    { emoji: '🦇', nombre: 'Murciélago' },
    { emoji: '🐻', nombre: 'Oso' },
    { emoji: '🐨', nombre: 'Koala' },
    { emoji: '🐼', nombre: 'Panda' },
    { emoji: '🦘', nombre: 'Canguro' },
    { emoji: '🦡', nombre: 'Tejón' },
    { emoji: '🦃', nombre: 'Pavo' },
    { emoji: '🐔', nombre: 'Gallina' },
    { emoji: '🐓', nombre: 'Gallo' },
    { emoji: '🐣', nombre: 'Pollito' },
    { emoji: '🐤', nombre: 'Pollito' },
    { emoji: '🦆', nombre: 'Pato' },
    { emoji: '🦢', nombre: 'Cisne' },
    { emoji: '🦉', nombre: 'Búho' },
    { emoji: '🦚', nombre: 'Pavo real' },
    { emoji: '🦜', nombre: 'Loro' },
    { emoji: '🕊️', nombre: 'Paloma' },
    { emoji: '🐦', nombre: 'Ave' },
    { emoji: '🐧', nombre: 'Pingüino' },
    { emoji: '🦅', nombre: 'Águila' },
    { emoji: '🦖', nombre: 'T-Rex' },
    { emoji: '🦕', nombre: 'Saurópodo' },
    { emoji: '🐊', nombre: 'Cocodrilo' },
    { emoji: '🐢', nombre: 'Tortuga' },
    { emoji: '🦎', nombre: 'Lagarto' },
    { emoji: '🐍', nombre: 'Serpiente' },
    { emoji: '🐙', nombre: 'Pulpo' },
    { emoji: '🦑', nombre: 'Calamar' },
    { emoji: '🦞', nombre: 'Langosta' },
    { emoji: '🦐', nombre: 'Camarón' },
    { emoji: '🐠', nombre: 'Pez tropical' },
    { emoji: '🐟', nombre: 'Pez' },
    { emoji: '🐡', nombre: 'Pez globo' },
    { emoji: '🐬', nombre: 'Delfín' },
    { emoji: '🐳', nombre: 'Ballena' },
    { emoji: '🐋', nombre: 'Ballena' },
    { emoji: '🦈', nombre: 'Tiburón' },
    { emoji: '🐌', nombre: 'Caracol' },
    { emoji: '🦋', nombre: 'Mariposa' },
    { emoji: '🐛', nombre: 'Oruga' },
    { emoji: '🐜', nombre: 'Hormiga' },
    { emoji: '🐝', nombre: 'Abeja' },
    { emoji: '🐞', nombre: 'Mariquita' },
    { emoji: '🦟', nombre: 'Mosquito' },
    { emoji: '🦗', nombre: 'Grillo' },
    { emoji: '🕷️', nombre: 'Araña' },
    { emoji: '🦂', nombre: 'Escorpión' },
    { emoji: '🦝', nombre: 'Mapache' },
    { emoji: '🦙', nombre: 'Llama' },
    { emoji: '🦥', nombre: 'Perezoso' },
    { emoji: '🦦', nombre: 'Nutria' },
    { emoji: '🦨', nombre: 'Mofeta' },
    { emoji: '🦮', nombre: 'Perro guía' },
    { emoji: '🐕‍🦺', nombre: 'Perro de servicio' },
    { emoji: '🦬', nombre: 'Bisonte' },
    { emoji: '🦣', nombre: 'Mamut' },
    { emoji: '🐾', nombre: 'Huellas' }
  ];

  constructor() {
    this.cargarDeLocalStorage();
  }

  // Cargar emojis guardados
  private cargarDeLocalStorage(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        // Convertir el objeto plano a Map
        Object.keys(parsed).forEach(key => {
          this.emojiMap.set(Number(key), parsed[key]);
        });
      }
    } catch (error) {
      console.error('Error al cargar emojis:', error);
      // Si hay error, inicializar con mapa vacío
      this.emojiMap = new Map();
    }
  }

  // Guardar emojis en localStorage
  private guardarEnLocalStorage(): void {
    try {
      // Convertir Map a objeto plano para almacenar en JSON
      const dataObj: Record<number, string> = {};
      this.emojiMap.forEach((value, key) => {
        dataObj[key] = value;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataObj));
    } catch (error) {
      console.error('Error al guardar emojis:', error);
    }
  }

  // Asignar emoji a una especie
  asignarEmojiAEspecie(especieId: number, emoji: string): void {
    this.emojiMap.set(especieId, emoji);
    this.guardarEnLocalStorage();
  }

  // Obtener emoji de una especie
  obtenerEmojiDeEspecie(especieId: number | undefined, nombreEspecie?: string): string {
    if (!especieId) return this.obtenerEmojiPorDefectoSegunNombre(nombreEspecie);
    
    // Si ya está asignado manualmente, usarlo
    const emojiAsignado = this.emojiMap.get(especieId);
    if (emojiAsignado) return emojiAsignado;
    
    // Si no, asignar automáticamente según el nombre
    return this.obtenerEmojiPorDefectoSegunNombre(nombreEspecie);
  }

  // Buscar emoji por nombre para asignación automática
  obtenerEmojiPorDefectoSegunNombre(nombreEspecie: string | undefined): string {
    if (!nombreEspecie) return '🐾';
    
    const nombre = nombreEspecie.toLowerCase();
    
    // Mapeo extendido para más animales comunes
    if (nombre.includes('can') || nombre.includes('perr')) return '🐕';
    if (nombre.includes('fel') || nombre.includes('gat')) return '🐱';
    if (nombre.includes('av') || nombre.includes('paj') || nombre.includes('páj')) return '🐦';
    if (nombre.includes('rep') || nombre.includes('lag')) return '🦎';
    if (nombre.includes('pez') || nombre.includes('fish')) return '🐟';
    if (nombre.includes('roe') || nombre.includes('ham')) return '🐹';
    if (nombre.includes('equ') || nombre.includes('cabal')) return '🐎';
    if (nombre.includes('bov') || nombre.includes('vac')) return '�';
    if (nombre.includes('ovi') || nombre.includes('ovej')) return '🐑';
    if (nombre.includes('cone')) return '🐰';
    if (nombre.includes('serp') || nombre.includes('ofid')) return '🐍';
    if (nombre.includes('tort')) return '🐢';
    if (nombre.includes('anfi') || nombre.includes('ran')) return '🐸';
    if (nombre.includes('loro') || nombre.includes('psit')) return '🦜';
    if (nombre.includes('aves') || nombre.includes('páj')) return '🐦';
    if (nombre.includes('exot')) return '🦓';
    
    // Si no encuentra coincidencia específica
    return '🐾'; 
  }

  // Obtener todos los emojis asignados
  obtenerTodosLosEmojisAsignados(): Map<number, string> {
    return new Map(this.emojiMap);
  }

  // Limpiar asignaciones (para pruebas)
  limpiarEmojis(): void {
    this.emojiMap.clear();
    this.guardarEnLocalStorage();
  }
  
  // Filtrar emojis por término de búsqueda
  filtrarEmojis(termino: string): {emoji: string, nombre: string}[] {
    if (!termino || termino.trim() === '') {
      return this.animalEmojis;
    }
    
    const terminoLower = termino.toLowerCase();
    return this.animalEmojis.filter(item => 
      item.nombre.toLowerCase().includes(terminoLower)
    );
  }
}
