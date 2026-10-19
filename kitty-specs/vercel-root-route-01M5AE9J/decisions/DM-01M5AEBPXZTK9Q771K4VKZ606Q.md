# Decision Moment `01M5AEBPXZTK9Q771K4VKZ606Q`

- **Mission:** `vercel-root-route-01M5AE9J`
- **Origin flow:** `specify`
- **Slot key:** `specify.diagnosis.root-cause`
- **Input key:** `root_cause`
- **Status:** `resolved`
- **Created:** `2026-10-19T16:01:52.575794+00:00`
- **Resolved:** `2026-10-19T16:10:48.284523+00:00`
- **Opened by:** `cli`
- **Other answer:** `false`

## Question

¿Confirmas el diagnóstico: la ruta raíz / falta en Vercel porque src/app/layout.tsx es Server Component sin 'use client' pero envuelve AuthProvider (Client Component)? El fix es agregar 'use client' al layout raíz.

## Options

_(none)_

## Final answer

Confirmado: agregar 'use client' a src/app/layout.tsx para permitir prerenderizado de ruta raíz en Vercel

## Rationale

_(none)_

## Change log

- `2026-10-19T16:01:52.575794+00:00` — opened
- `2026-10-19T16:10:48.284523+00:00` — resolved (final_answer="Confirmado: agregar 'use client' a src/app/layout.tsx para permitir prerenderizado de ruta raíz en Vercel")
