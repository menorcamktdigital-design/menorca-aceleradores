import { useState } from 'react'
import { WEBHOOK_URL, baseVacia } from './config'
import { armarPayload, validarBase } from './utils'
import BaseCard from './components/BaseCard'
import ConfirmModal from './components/ConfirmModal'

export default function App() {
  const [bases, setBases] = useState([baseVacia()])
  const [clave, setClave] = useState('')
  const [confirmando, setConfirmando] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [confirmado, setConfirmado] = useState(false)
  const [terminado, setTerminado] = useState(false)

  const actualizar = (id, nueva) => setBases((bs) => bs.map((b) => (b.id === id ? nueva : b)))
  const quitar = (id) => setBases((bs) => (bs.length > 1 ? bs.filter((b) => b.id !== id) : bs))
  const agregar = () => setBases((bs) => [...bs, baseVacia()])

  const listas = bases.filter((b) => validarBase(b).length === 0)
  const puedeEnviar = listas.length === bases.length && bases.length > 0 && clave && confirmado && !enviando

  async function enviarTodos() {
    setConfirmando(false)
    setEnviando(true)
    setTerminado(false)

    // Solo se envían las pendientes o con error (las "Enviado ✓" no se repiten)
    const objetivo = bases.filter((b) => b.envio.estado !== 'ok')
    setBases((bs) =>
      bs.map((b) => (b.envio.estado === 'ok' ? b : { ...b, envio: { estado: 'enviando', detalle: '' } }))
    )

    // Un POST por base, en paralelo (cada uno = una ejecución del motor)
    await Promise.allSettled(
      objetivo.map(async (b) => {
        try {
          const res = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(armarPayload(b, clave)),
          })
          if (!res.ok) throw new Error(`El motor respondió ${res.status} (¿clave correcta?)`)
          actualizar(b.id, { ...b, envio: { estado: 'ok', detalle: '' } })
        } catch (e) {
          actualizar(b.id, { ...b, envio: { estado: 'error', detalle: e.message } })
        }
      })
    )
    setEnviando(false)
    setTerminado(true)
  }

  return (
    <div className="min-h-screen text-[15px] text-[#1A2421]">
      {/* Header */}
      <header className="flex items-center gap-3 bg-verde px-6 py-4 text-white">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-accion font-display text-lg font-bold">
          M
        </div>
        <div>
          <h1 className="font-display text-[16px] font-semibold">Panel Aceleradores</h1>
          <p className="text-[12px] opacity-75">Envío masivo de plantillas WhatsApp · Menorca Inversiones</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-28 pt-7">
        <p className="mb-5 text-[14px] text-gray-600">
          Sube <b>un Excel por acelerador</b> (columnas Celular y Nombre Cliente), completa los datos de
          cada campaña y envíalos todos juntos. Las plantillas ya deben estar <b>aprobadas en Meta</b>.
        </p>

        {/* Tarjetas de bases */}
        <div className="space-y-4">
          {bases.map((b, i) => (
            <BaseCard
              key={b.id}
              index={i}
              base={b}
              bloqueado={enviando || b.envio.estado === 'ok'}
              onChange={(nueva) => actualizar(b.id, nueva)}
              onRemove={() => quitar(b.id)}
            />
          ))}
        </div>

        <button
          onClick={agregar}
          disabled={enviando}
          className="mt-4 w-full rounded-xl border-2 border-dashed border-linea py-3 font-display text-[14px] font-semibold text-verde2 hover:border-accion hover:bg-green-50/50 disabled:opacity-50"
        >
          + Agregar otra base
        </button>

        {/* Barra de envío */}
        <div className="mt-7 rounded-xl border border-linea bg-white p-5 sm:p-6">
          <h2 className="mb-3 font-display text-[15px] font-semibold">Enviar</h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-[13px] font-semibold">Clave del panel</label>
              <input
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-linea px-3 py-2 focus:outline-2 focus:outline-accion"
              />
            </div>
            <div className="text-[13px] text-gray-600 sm:pb-2">
              {listas.length} de {bases.length} bases listas
            </div>
          </div>

          <label className="mt-4 flex items-start gap-2 text-[14px]">
            <input
              type="checkbox"
              checked={confirmado}
              onChange={(e) => setConfirmado(e.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <span>
              Confirmo que las plantillas están <b>aprobadas en Meta</b>, las imágenes cargan y las bases
              son las correctas.
            </span>
          </label>

          <button
            onClick={() => setConfirmando(true)}
            disabled={!puedeEnviar}
            className="mt-4 w-full rounded-xl bg-accion py-3.5 font-display text-[15px] font-semibold text-white hover:bg-accionh disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {enviando ? 'Enviando…' : `Enviar ${bases.length > 1 ? `los ${bases.length} aceleradores` : 'acelerador'}`}
          </button>

          {terminado && (
            <div className="mt-4 rounded-xl bg-green-50 p-4 text-[14px] text-green-900">
              ✅ <b>Envíos iniciados.</b> El motor manda los mensajes uno por uno (aprox. 2 seg por
              mensaje). Las tarjetas con "Enviado ✓" ya están corriendo; si alguna marca error, corrígela
              y vuelve a enviar solo esa.
            </div>
          )}
        </div>
      </main>

      {confirmando && (
        <ConfirmModal
          resumen={bases.map((b) => ({ id: b.id, template: b.template, validos: b.stats.validos }))}
          onCancel={() => setConfirmando(false)}
          onConfirm={enviarTodos}
        />
      )}
    </div>
  )
}
