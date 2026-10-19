# Mission Specification: Corregir ruta raíz / ausente en despliegue Vercel

**Mission Branch**: feat/vercel-root-route  
**Created**: 2026-10-19  
**Status**: Draft  
**Input**: El proyecto en npm run dev funciona pero al subir a Vercel no funciona. El build se completa pero la lista de rutas desplegadas no incluye la ruta raíz (/). Corregir para que se pueda ver el proyecto en api.lacajaambar.com.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acceder a BeeKeeper desde api.lacajaambar.com (Priority: P1)

Como usuario de BeeKeeper, quiero que al entrar a api.lacajaambar.com cargue la pantalla de bienvenida/login de la aplicación para poder iniciar sesión y gestionar mis colmenares.

**Why this priority**: Es el propósito principal del despliegue; sin la ruta raíz el dominio es inaccesible.

**Independent Test**: Se puede verificar entrando a https://api.lacajaambar.com y comprobando que renderiza el formulario de login de BeeKeeper.

**Acceptance Scenarios**:

1. **Given** el dominio api.lacajaambar.com apunta al despliegue de Vercel, **When** el usuario entra a la URL raíz, **Then** se muestra la pantalla de bienvenida con el formulario de login de BeeKeeper.
2. **Given** el usuario no tiene sesión iniciada, **When** accede a la ruta raíz, **Then** se muestra el formulario de acceso y no una página de error 404 o en blanco.

---

### User Story 2 - Rutas internas funcionan tras el login (Priority: P2)

Como usuario autenticado de BeeKeeper, quiero que tras iniciar sesión las rutas internas (/colmenares, /hives, /settings) funcionen correctamente en producción.

**Why this priority**: La aplicación debe ser usable completa tras el acceso.

**Independent Test**: Se puede verificar iniciando sesión y navegando a /colmenares y /hives en producción.

**Acceptance Scenarios**:

1. **Given** el usuario ha iniciado sesión en api.lacajaambar.com, **When** navega a /colmenares, **Then** se muestra el listado de colmenares sin error de ruta.
2. **Given** el usuario está en /colmenares, **When** hace clic en una colmena, **Then** se abre el detalle de la colmena en /hives/[id].

---

### Edge Cases

- ¿Qué sucede si el usuario entra directamente a una ruta interna sin sesión? Se redirige al login de la raíz.
- ¿Qué sucede si el despliegue de Vercel no incluye la ruta raíz? El dominio muestra error o página en blanco (este es el problema actual).
- ¿Qué sucede con el logo y assets estáticos en producción? Deben cargar correctamente desde /assets/.

## Requirements *(mandatory)*

### Functional Requirements

| ID | Title | User Story | Priority | Status |
|----|-------|------------|----------|--------|
| FR-001 | Ruta raíz / disponible en producción | As a usuario, quiero que api.lacajaambar.com cargue la app de BeeKeeper | High | Open |
| FR-002 | Layout raíz prerenderizable en servidor | As a usuario, quiero que la página cargue sin errores de límite cliente-servidor en el primer render | High | Open |
| FR-003 | Rutas internas accesibles tras login | As a usuario, quiero navegar a /colmenares y /hives tras autenticarme | Medium | Open |

### Non-Functional Requirements

| ID | Title | Requirement | Category | Priority | Status |
|----|-------|-------------|----------|----------|--------|
| NFR-001 | Build exitoso en Vercel | El comando `npm run build` debe completar sin errores en el entorno de Vercel | Reliability | High | Open |
| NFR-002 | Ruta raíz en manifiesto de rutas | La ruta `/` debe aparecer en la lista de rutas generadas por el build de Next.js | Reliability | High | Open |
| NFR-003 | Tiempo de carga inicial | La página raíz debe renderizar en menos de 3 segundos en condiciones normales | Performance | Medium | Open |

### Constraints

| ID | Title | Constraint | Category | Priority | Status |
|----|-------|------------|----------|----------|--------|
| C-001 | No romper autenticación local | El fix del layout no debe alterar el comportamiento de AuthProvider en desarrollo local | Technical | High | Open |
| C-002 | Rama protegida main | Los cambios deben desarrollarse en feature branch y hacer merge a main vía PR | Process | High | Open |
| C-003 | Compatibilidad con TypeScript estricto | El código debe pasar `tsc --noEmit` sin errores | Technical | High | Open |

### Key Entities *(include if feature involves data)*

- **Ruta raíz (/)**: Punto de entrada de la aplicación que renderiza el WelcomePage con formulario de login.
- **Layout raíz (layout.tsx)**: Componente envolvente de todas las páginas que incluye AuthProvider y metadata de la app.
- **AuthProvider**: Proveedor de contexto de autenticación (Client Component) que envuelve el layout raíz.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El build de Vercel incluye la ruta `/` en su lista de rutas desplegadas.
- **SC-002**: Entrar a https://api.lacajaambar.com muestra el formulario de login de BeeKeeper (no 404 ni página en blanco).
- **SC-003**: `tsc --noEmit` pasa con 0 errores de TypeScript después del fix.
- **SC-004**: `npm run build` completa exitosamente en entorno de producción.
