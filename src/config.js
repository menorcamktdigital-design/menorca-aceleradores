// Configuración central del panel.
// Si cambia el webhook, los proyectos o la clave, se edita SOLO aquí.

export const WEBHOOK_URL = 'https://n8n.menorca.pe/webhook/acelerador-motor'

// Proyectos Sperant disponibles en el dropdown
export const PROYECTOS = [
  { id: 73, plaza: 'BDV',  nombre: 'Brisas de Ventanilla' },
  { id: 36, plaza: 'AP',   nombre: 'Alto Piura' },
  { id: 41, plaza: 'CSA',  nombre: 'Caleta San Antonio' },
  { id: 56, plaza: 'CL',   nombre: 'Costa Linda' },
  { id: 70, plaza: 'EC',   nombre: 'El Carbón' },
  { id: 42, plaza: 'EOP',  nombre: 'El Olivar de Pisco' },
  { id: 12, plaza: 'LQ',   nombre: 'La Quebrada' },
  { id: 65, plaza: 'LR',   nombre: 'Las Rompientes' },
  { id: 57, plaza: 'LDC',  nombre: 'Lirios de Carabayllo' },
  { id: 63, plaza: 'LP',   nombre: 'Los Pecanos' },
  { id: 62, plaza: 'MC',   nombre: 'Mala Comercio' },
  { id: 72, plaza: 'MSA',  nombre: 'Mirador de San Antonio' },
  { id: 52, plaza: 'PDC',  nombre: 'Posada del Sol Chiclayo' },
  { id: 71, plaza: 'PEO3', nombre: 'Praderas El Olivar 3' },
  { id: 71, plaza: 'PEO2', nombre: 'Praderas El Olivar 2' },
  { id: 68, plaza: 'SACH', nombre: 'San Antonio de Chiclayo 3' },
  { id: 44, plaza: 'SAM',  nombre: 'San Antonio de Mala' },
  { id: 30, plaza: 'SAP',  nombre: 'San Antonio de Pachacamac' },
  { id: 53, plaza: 'VPSC', nombre: 'Villa Posada del Sol Chiclayo' },
  { id: 69, plaza: 'VSAC', nombre: 'Villas de San Antonio Chorrillos' },
  { id: 64, plaza: 'VPMC', nombre: 'Villas Punta Mar Casas' },
  { id: 58, plaza: 'VPML', nombre: 'Villas Punta Mar Lotes' },
]

export const TIPOS = [
  { value: 'boton', label: 'Con boton(es)' },
  { value: 'default', label: 'Con botón de enlace (URL)' },
  { value: 'flow', label: 'Flow (Encuesta)' }
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
