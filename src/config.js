// Configuración central del panel.
// Si cambia el webhook, los proyectos o la clave, se edita SOLO aquí.

export const WEBHOOK_URL = 'https://n8n.menorca.pe/webhook/acelerador-motor'

// Proyectos Sperant disponibles en el dropdown
export const PROYECTOS = [
  { id: 68, plaza: 'SACH', nombre: 'San Antonio de Chiclayo' },
  { id: 69, plaza: 'VSACH', nombre: 'Villas de San Antonio Chorrillos' },
  { id: 58, plaza: 'VPM', nombre: 'Villas Punta Mar — Punta Hermosa' },
  { id: 63, plaza: 'Los Pecanos', nombre: 'Los Pecanos 2 — Ica' },
  { id: 30, plaza: 'SAP2', nombre: 'San Antonio de Pachacamac 2' },
  { id: 57, plaza: 'LDC', nombre: "Lirios de Carabayllo"},
]

export const TIPOS = [
  { value: 'boton', label: 'Con botón "¡Contáctenme YA!"' },
  { value: 'default', label: 'Con botón de enlace (URL)' },
]

// Estado vacío de una base nueva
export const baseVacia = () => ({
  id: crypto.randomUUID(),
  archivo: null, // nombre del archivo subido
  numeros: [], // [{ Celular, 'Nombre Cliente' }]
  stats: { validos: 0, dup: 0, inv: 0 },
  template: '',
  campania: '',
  proyectoSel: '', // valor del select ('68' | 'otro' | '')
  proyectoIdOtro: '',
  plaza: '',
  tipo: 'boton',
  numBotones: 1,
  imagenUrl: '',
  descripcion: '',
  vigencia: '',
  envio: { estado: 'pendiente', detalle: '' }, // pendiente | enviando | ok | error
})
