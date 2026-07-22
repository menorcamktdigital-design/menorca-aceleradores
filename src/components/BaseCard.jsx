import { useRef, useState } from 'react'
import { PROYECTOS, TIPOS, PAYLOADS } from '../config'
import { parsearArchivo, validarBase } from '../utils'

const inputCls =
  'w-full rounded-lg border border-linea bg-white px-3 py-2 text-[14px] ' +
  'focus:outline-2 focus:outline-accion focus:border-transparent'

function Campo({ label, hint, children, full }) {
  return (
    <div className={`flex flex-col gap-1 ${full ? 'sm:col-span-2' : ''}`}>
      <label className="text-[13px] font-semibold">
        {label} {hint && <em className="not-italic font-normal text-gray-500 text-[12px]">({hint})</em>}
      </label>
      {children}
    </div>
  )
}

export default function BaseCard({ index, base, onChange, onRemove, bloqueado }) {
  const inputFile = useRef(null)
  const [arrastrando, setArrastrando] = useState(false)
  const [errorArchivo, setErrorArchivo] = useState('')

  const set = (patch) => onChange({ ...base, ...patch })

  async function cargarArchivo(file) {
    setErrorArchivo('')
    try {
      const { numeros, stats } = await parsearArchivo(file)
      set({ archivo: file.name, numeros, stats })
    } catch (e) {
      setErrorArchivo('No se pudo leer el archivo: ' + e.message)
      set({ archivo: null, numeros: [], stats: { validos: 0, dup: 0, inv: 0 } })
    }
  }

  function elegirProyecto(valor) {
    const p = PROYECTOS.find((x) => String(x.id) === valor)
    set({ proyectoSel: valor, plaza: p ? p.plaza : base.plaza })
  }

  const faltan = validarBase(base)
  const { estado, detalle } = base.envio

  const badge =
    estado === 'ok' ? (
      <span className="rounded-full bg-green-100 px-3 py-1 text-[12px] font-semibold text-green-800">Enviado ✓</span>
    ) : estado === 'error' ? (
      <span className="rounded-full bg-red-100 px-3 py-1 text-[12px] font-semibold text-red-700">Error</span>
    ) : estado === 'enviando' ? (
      <span className="rounded-full bg-amber-100 px-3 py-1 text-[12px] font-semibold text-amber-800">Enviando…</span>
    ) : faltan.length === 0 ? (
      <span className="rounded-full bg-green-50 px-3 py-1 text-[12px] font-semibold text-verde2">Lista</span>
    ) : (
      <span className="rounded-full bg-gray-100 px-3 py-1 text-[12px] text-gray-500">Incompleta</span>
    )

  return (
    <section className="rounded-xl border border-linea bg-white p-5 sm:p-6">
      {/* Cabecera de la tarjeta */}
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-verde font-display text-[13px] font-semibold text-white">
          {index + 1}
        </div>
        <h2 className="font-display text-[15px] font-semibold flex-1 truncate">
          {base.template || `${base.payloadTipo === 'referidos' ? 'Referido' : 'Acelerador'} ${index + 1}`}
        </h2>
        {badge}
        {!bloqueado && (
          <button
            onClick={onRemove}
            className="rounded-lg px-2 py-1 text-[13px] text-gray-400 hover:bg-red-50 hover:text-red-600"
            title="Quitar esta base"
          >
            ✕
          </button>
        )}
      </div>

      {/* Zona de archivo */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (bloqueado) return
          inputFile.current.value = ''
          inputFile.current.click()
        }}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputFile.current.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setArrastrando(true)
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={(e) => {
          e.preventDefault()
          setArrastrando(false)
          if (e.dataTransfer.files.length) cargarArchivo(e.dataTransfer.files[0])
        }}
        className={`mb-2 cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition
          ${arrastrando ? 'border-accion bg-green-50' : 'border-linea hover:border-accion hover:bg-green-50/50'}`}
      >
        {base.archivo ? (
          <>
            <b className="text-verde2">{base.archivo}</b>
            <div className="mt-2 flex justify-center gap-4 text-[13px]">
              <span className="font-semibold text-accionh">{base.stats.validos} se enviarán</span>
              <span className="text-amber-700">{base.stats.dup} duplicados</span>
              <span className="text-red-700">{base.stats.inv} inválidos</span>
            </div>
            <small className="mt-1 block text-gray-500">Clic para cambiar el archivo</small>
          </>
        ) : (
          <>
            <b className="text-verde2">Arrastra el Excel aquí</b> o haz clic
            <small className="mt-1 block text-gray-500">Columnas: Celular y Nombre Cliente</small>
          </>
        )}
      </div>
      {errorArchivo && <p className="mb-2 text-[13px] text-red-600">{errorArchivo}</p>}
      <input
        ref={inputFile}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          if (e.target.files.length) cargarArchivo(e.target.files[0])
          e.target.value = ''
        }}
      />

      {/* Configuración */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Campo label="Plantilla en Meta">
          <input
            className={inputCls}
            disabled={bloqueado}
            value={base.template}
            placeholder="ace_sach_nocontesta_09072026"
            onChange={(e) => set({ template: e.target.value, campania: e.target.value.trim() })}
          />
        </Campo>
        <Campo label="Código de campaña" hint="se llena solo">
          <input
            className={inputCls}
            disabled={bloqueado}
            value={base.campania}
            onChange={(e) => set({ campania: e.target.value })}
          />
        </Campo>
        <Campo label="Proyecto">
          <select
            className={inputCls}
            disabled={bloqueado}
            value={base.proyectoSel}
            onChange={(e) => elegirProyecto(e.target.value)}
          >
            <option value="">— Elegir —</option>
            {PROYECTOS.map((p) => (
              <option key={p.plaza} value={p.id}>
                {p.nombre} ({p.id})
              </option>
            ))}
            <option value="otro">Otro (escribir ID)</option>
          </select>
        </Campo>
        {base.proyectoSel === 'otro' ? (
          <Campo label="ID del proyecto en Sperant">
            <input
              type="number"
              className={inputCls}
              disabled={bloqueado}
              value={base.proyectoIdOtro}
              placeholder="Ej: 72"
              onChange={(e) => set({ proyectoIdOtro: e.target.value })}
            />
          </Campo>
        ) : (
          <Campo label="Plaza / nombre corto">
            <input
              className={inputCls}
              disabled={bloqueado}
              value={base.plaza}
              placeholder="SACH"
              onChange={(e) => set({ plaza: e.target.value })}
            />
          </Campo>
        )}
        <Campo label="Tipo de envio" hint="determina a donde cae la respuesta">
          <select
            className={inputCls}
            disabled={bloqueado}
            value={base.payloadTipo}
            onChange={(e) => set({ payloadTipo: e.target.value })}
          >
            {PAYLOADS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Campo>
        <Campo label="Tipo de plantilla">
          <select
            className={inputCls}
            disabled={bloqueado}
            value={base.tipo}
            onChange={(e) => set({ tipo: e.target.value })}
          >
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Campo>
        {base.tipo === 'boton' && (
          <Campo label="Cantidad de botones" hint="debe coincidir con la plantilla de Meta">
            <select
              className={inputCls}
              disabled={bloqueado}
              value={base.numBotones}
              onChange={(e) => set({ numBotones: e.target.value })}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="0">0 (solo imagen)</option>
            </select>
          </Campo>
        )}
        <Campo label="URL de la imagen" hint="la de WordPress" full>
          <input
            className={inputCls}
            disabled={bloqueado}
            value={base.imagenUrl}
            placeholder="https://menorca.pe/wp-content/uploads/2026/07/....jpg"
            onChange={(e) => set({ imagenUrl: e.target.value })}
          />
        </Campo>
        <Campo label="Descripción de la promo" hint="la usa la IA cuando el cliente pregunta" full>
          <textarea
            className={`${inputCls} min-h-[54px] resize-y`}
            disabled={bloqueado}
            value={base.descripcion}
            placeholder="Hasta 40% de descuento pagando al contado"
            onChange={(e) => set({ descripcion: e.target.value })}
          />
        </Campo>
        <Campo label="Vigencia">
          <input
            className={inputCls}
            disabled={bloqueado}
            value={base.vigencia}
            placeholder="Solo hasta el 16 de julio"
            onChange={(e) => set({ vigencia: e.target.value })}
          />
        </Campo>
      </div>

      {/* Estado / faltantes */}
      {estado === 'error' && <p className="mt-3 text-[13px] text-red-600">❌ {detalle}</p>}
      {estado === 'pendiente' && faltan.length > 0 && (
        <p className="mt-3 text-[13px] text-gray-500">Falta: {faltan.join(', ')}</p>
      )}
    </section>
  )
}
