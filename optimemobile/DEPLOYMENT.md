# Atlas Go — Guía de Despliegue en Producción (atlasgo.studio)

Esta guía documenta la configuración de variables de entorno y el checklist de
despliegue para llevar la aplicación a producción en **Railway** bajo el dominio
**https://atlasgo.studio**.

---

## 1. Auditoría de Variables de Entorno

### Local (`.env` — gitignored)

| Variable | Valor local | Propósito |
|----------|-------------|-----------|
| `DATABASE_URL` | `postgresql://...@sakura.proxy.rlwy.net:42256/railway` | Conexión PostgreSQL (Railway) |
| `AUTH_SECRET` | `atlas-go-dev-secret-...` | Firma de sesiones JWT (SOLO desarrollo) |
| `AUTH_URL` | `http://localhost:3000` | URL base de Auth.js (local) |
| `NEXTAUTH_URL` | `http://localhost:3000` | URL base de NextAuth (local) |

### Producción (`.env.production` — gitignored, plantilla local)

| Variable | Valor de producción | Propósito |
|----------|--------------------|-----------|
| `DATABASE_URL` | `postgresql://...@<HOST>:<PORT>/railway` | Conexión PostgreSQL (Railway) |
| `AUTH_SECRET` | `<STRONG_RANDOM_SECRET>` | Firma de sesiones JWT (producción) |
| `AUTH_URL` | `https://atlasgo.studio` | URL base de Auth.js (producción) |
| `NEXTAUTH_URL` | `https://atlasgo.studio` | URL base de NextAuth (producción) |

> **Nota:** `.env*` está en `.gitignore`, por lo que ningún archivo `.env` se
> sube al repositorio. En Railway, las variables se inyectan directamente desde
> el panel **Project Settings → Variables**.

---

## 2. Verificación de Callbacks de NextAuth

- **`app/api/auth/[...nextauth]/route.ts`**: Solo exporta `handlers` de
  `@/lib/auth`. **No contiene URLs hardcodeadas** ni dominios de respaldo. ✅
- **`lib/auth.ts`**: Configuración de NextAuth v5 (Auth.js). Usa
  `pages.signIn: "/login"` (ruta relativa). **No hardcodea `localhost`** ni
  dominios de fallback. ✅
- **`middleware.ts`**: Verifica el token con `process.env.AUTH_SECRET`. Usa
  `new URL("/login", nextUrl)` (relativo al request actual), por lo que funciona
  correctamente en cualquier dominio. ✅

**Conclusión:** No hay URLs hardcodeadas que rompan la autenticación en
producción. La única configuración que cambia entre entornos es la de las
variables de entorno.

---

## 3. Checklist de Despliegue en Railway

Una vez que **atlasgo.studio** esté activo, configura las siguientes variables
directamente en **Railway → Project Settings → Variables**:

### Variables obligatorias

| Variable | Valor requerido | Notas |
|----------|-----------------|-------|
| `DATABASE_URL` | Cadena de conexión pública de PostgreSQL | Usar la conexión **pública** del servicio Railway PostgreSQL |
| `AUTH_SECRET` | Secreto aleatorio fuerte | Generar con `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://atlasgo.studio` | **Debe** apuntar al dominio de producción |
| `AUTH_URL` | `https://atlasgo.studio` | **Debe** apuntar al dominio de producción |

### Pasos recomendados

1. **Generar un secreto fuerte** (nunca reutilizar el de desarrollo):
   ```bash
   openssl rand -base64 32
   ```
   Copiar el resultado en `AUTH_SECRET`.

2. **Configurar `NEXTAUTH_URL` y `AUTH_URL`** a `https://atlasgo.studio`.
   - Si el dominio aún no está conectado, usar temporalmente la URL de Railway
     (ej. `https://atlasgo-production.up.railway.app`) y actualizarla cuando el
     dominio custom esté activo.

3. **Verificar `DATABASE_URL`**:
   - Usar la conexión **pública** (no la privada) para que el contenedor de
     Railway pueda alcanzar la base de datos.
   - Asegurarse de que el servicio PostgreSQL esté en la misma red/proyecto de
     Railway.

4. **Aplicar migraciones de Prisma** en el despliegue:
   ```bash
   npx prisma migrate deploy
   ```
   (o configurar un comando de build que ejecute `prisma migrate deploy` antes
   de `next build`).

5. **Ejecutar el seed** (si es necesario) para crear el usuario inicial:
   ```bash
   npx prisma db seed
   ```

6. **Verificar el dominio custom**:
   - En Railway, conectar `atlasgo.studio` como dominio custom.
   - Configurar el certificado SSL automático de Railway.
   - Confirmar que `https://atlasgo.studio` carga correctamente.

7. **Probar el flujo de autenticación**:
   - Visitar `https://atlasgo.studio/login`.
   - Iniciar sesión con credenciales válidas.
   - Confirmar que las rutas protegidas (`/`, `/accounts`, `/transactions`,
     `/budgets`, `/investments`, `/reports`, `/bills`, `/vacation-ai`) redirigen
     a `/login` cuando no hay sesión.

---

## 4. Resumen de cambios

- **`.env.production`** (creado): Plantilla local con valores de producción
  apuntando a `https://atlasgo.studio`. Gitignored.
- **`DEPLOYMENT.md`** (este archivo): Documentación de auditoría y checklist.
- **Sin cambios en código**: `lib/auth.ts`, `app/api/auth/[...nextauth]/route.ts`
  y `middleware.ts` ya son seguros y no hardcodean URLs.
