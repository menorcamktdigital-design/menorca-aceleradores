# Panel Aceleradores — Menorca

Interfaz para que marketing lance aceleradores (envíos masivos de plantillas WhatsApp)
sin tocar n8n. Soporta **múltiples bases a la vez**: un Excel por acelerador, cada uno
con su plantilla, proyecto e imagen, y un solo botón que dispara todos en paralelo
contra el webhook del motor (`ACELERADORES: Envio masivo`).

## Correr en local

```bash
npm install
npm run dev        # abre http://localhost:5173
```

## Compilar y desplegar en el servidor (nginx)

```bash
npm run build      # genera dist/
scp -r dist/* root@165.22.187.203:/usr/share/nginx/html/panel/
```

Luego se accede desde el navegador en la ruta que sirva nginx (ej. /panel/).

## Configuración

Todo lo editable está en `src/config.js`:
- `WEBHOOK_URL` — webhook del motor en n8n
- `PROYECTOS` — lista del dropdown (id Sperant + plaza + nombre)

La **clave del panel** NO va en el código: se escribe en la interfaz y se valida en el
nodo "Normalizar entrada" del motor en n8n (`menorca-ace-2026` por defecto).

## Estructura

```
src/
├── App.jsx                    → lista de bases, clave, envío en paralelo
├── config.js                  → webhook, proyectos, estado inicial
├── utils.js                   → parseo Excel/CSV, validación, payload
└── components/
    ├── BaseCard.jsx           → tarjeta de una base (archivo + campos)
    └── ConfirmModal.jsx       → confirmación con total de mensajes
```

## Reglas de normalización (mismas que el motor)

- Solo dígitos; números de 9 dígitos reciben prefijo `51`
- Largo válido: 8–15 dígitos; se descartan inválidos
- Duplicados eliminados dentro de cada base
- Sin nombre → "Cliente"

## Importante

- La cantidad de botones **debe coincidir** con la plantilla aprobada en Meta,
  si no Meta rechaza los envíos.
- Los envíos no se pueden detener una vez iniciados.
- Si una base marca error, se corrige y se reenvía; las que ya dicen
  "Enviado ✓" no se vuelven a disparar.
