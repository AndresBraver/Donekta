# Donekta — Guía de instalación

## Stack
- **Frontend + Backend**: Next.js (desplegado en Vercel, gratis)
- **Base de datos + Auth**: Supabase (gratis)
- **Correos**: Resend (gratis hasta 3,000 emails/mes)

---

## Paso 1 — Crear base de datos en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratis
2. Crea un nuevo proyecto (guarda la contraseña)
3. Ve a **SQL Editor** y pega todo el contenido de `supabase-schema.sql` y ejecútalo
4. Ve a **Settings → API** y copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Paso 2 — Configurar correos con Resend

1. Ve a [resend.com](https://resend.com) y crea una cuenta gratis
2. Ve a **API Keys** y crea una nueva key → `RESEND_API_KEY`
3. (Opcional) Agrega tu dominio para enviar desde un correo propio

> ⚠️ Sin dominio propio, los correos se envían desde `onboarding@resend.dev`.
> Para producción, agrega tu dominio en Resend → Domains.

---

## Paso 3 — Subir a Vercel

1. Sube este proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com) y conecta tu cuenta de GitHub
3. Importa el repositorio
4. En **Environment Variables** agrega:

```
NEXT_PUBLIC_SUPABASE_URL      = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhb...
RESEND_API_KEY                = re_xxx...
NEXT_PUBLIC_SITE_URL          = https://tu-app.vercel.app
```

5. Click en **Deploy** — ¡listo!

---

## Flujo completo

```
Landing → Iniciar sesión / Registrarse
       ↓
    Elegir tipo
    ├── Donador → Ver comunidades → Seleccionar → Donar
    └── Comunidad → Email a andresbraver@gmail.com → Espera aprobación
                                ↓
                    Admin aprueba en /admin
                                ↓
                    Email de aprobación a la comunidad
                                ↓
                    Comunidad completa perfil en /community-register
```

## Páginas

| URL | Descripción |
|-----|-------------|
| `/` | Landing page |
| `/choose-type` | Elegir donador o comunidad |
| `/donor` | Ver y donar a comunidades |
| `/community-pending` | Pantalla de espera post-solicitud |
| `/community-register` | Formulario completo de comunidad |
| `/admin` | Panel para aprobar/rechazar comunidades |

## Desarrollo local

```bash
npm install
cp .env.example .env.local
# Llena las variables en .env.local
npm run dev
```
