export default function ConfirmModal({ resumen, onCancel, onConfirm }) {
  const totalMensajes = resumen.reduce((s, r) => s + r.validos, 0)
  return (
    <div className="fixed inset-0 z-10 grid place-items-center bg-verde/60 p-5">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <h2 className="font-display text-[17px] font-semibold">¿Enviar aceleradores?</h2>
        <ul className="mt-3 space-y-1 text-[14px]">
          {resumen.map((r) => (
            <li key={r.id} className="flex justify-between gap-4">
              <span className="truncate">{r.template}</span>
              <b className="shrink-0">{r.validos} contactos</b>
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-xl bg-green-50 p-3 text-center">
          <div className="font-display text-3xl font-bold text-verde">{totalMensajes}</div>
          <div className="text-[13px] text-gray-600">mensajes de WhatsApp en total</div>
        </div>
        <p className="mt-3 text-[13px] text-gray-600">
          Los envíos corren en paralelo y <b>no se pueden deshacer</b>.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl bg-papel py-3 font-display text-[14px] font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-accion py-3 font-display text-[14px] font-semibold text-white hover:bg-accionh"
          >
            Sí, enviar
          </button>
        </div>
      </div>
    </div>
  )
}
