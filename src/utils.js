import * as XLSX from 'xlsx'

/**
 * Lee un archivo Excel/CSV y devuelve la base normalizada.
 * Misma lógica que el motor en n8n: solo dígitos, 9 dígitos => prefijo 51,
 * largo válido 8–15, sin duplicados.
 */
export async function parsearArchivo(file) {
  const buffer = await file.arrayBuffer()
  const wb = XLSX.read(buffer, { type: 'array' })
  const hoja = wb.Sheets[wb.SheetNames[0]]
  const filas = XLSX.utils.sheet_to_json(hoja, { defval: '' })
  if (!filas.length) throw new Error('El archivo está vacío')

  // Detección flexible de columnas por encabezado
  const headers = Object.keys(filas[0])
  const colCel =
    headers.find((h) => /celular|tel[eé]fono|phone|n[uú]mero|m[oó]vil/i.test(h)) || headers[0]
  const colNom =
    headers.find((h) => /nombre/i.test(h)) ||
    headers.find(
      (h) => /cliente|name/i.test(h) && !/id|documento|dni/i.test(h) && h !== colCel
    ) ||
    headers[1] ||
    colCel

  const vistos = new Set()
  const numeros = []
  const stats = { validos: 0, dup: 0, inv: 0 }

  for (const f of filas) {
    let cel = String(f[colCel] ?? '').replace(/\D/g, '')
    if (cel.length === 9) cel = '51' + cel
    if (cel.length < 8 || cel.length > 15) {
      stats.inv++
      continue
    }
    if (vistos.has(cel)) {
      stats.dup++
      continue
    }
    vistos.add(cel)
    numeros.push({
      Celular: cel,
      'Nombre Cliente': String(f[colNom] ?? '').trim() || 'Cliente',
    })
  }
  stats.validos = numeros.length
  return { numeros, stats }
}

/** ID de proyecto efectivo según el select */
export function proyectoId(base) {
  return base.proyectoSel === 'otro'
    ? parseInt(base.proyectoIdOtro || '0', 10)
    : parseInt(base.proyectoSel || '0', 10)
}

/** Valida una base completa; devuelve lista de faltantes (vacía = lista para enviar) */
export function validarBase(base) {
  const faltan = []
  if (!base.numeros.length) faltan.push('base de contactos')
  if (!base.template.trim()) faltan.push('plantilla')
  if (!base.campania.trim()) faltan.push('código de campaña')
  if (!(proyectoId(base) > 0)) faltan.push('proyecto')
  if (!base.plaza.trim()) faltan.push('plaza')
  if (!/^https:\/\//.test(base.imagenUrl.trim())) faltan.push('URL de imagen (https)')
  return faltan
}

/** Arma el body que espera el webhook del motor */
export function armarPayload(base, clave) {
  return {
    template: base.template.trim(),
    campania: base.campania.trim(),
    proyecto_id: proyectoId(base),
    plaza: base.plaza.trim(),
    tipo: base.tipo,
    num_botones: base.tipo === 'default' ? 0 : Number(base.numBotones),
    imagen_url: base.imagenUrl.trim(),
    payload: base.payloadTipo,
    descripcion: base.descripcion.trim(),
    vigencia: base.vigencia.trim(),
    clave,
    numeros: base.numeros,
  }
}
