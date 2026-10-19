# Mission Specification: Renombrar La Caja Ámbar a LaCajaAmbar y fondo de landing

**Mission Branch**: feat/renombrar-lacajaamabar  
**Created**: 2026-10-19  
**Status**: Draft  
**Input**: Renombrar todas las referencias de "La Caja Ámbar" por "LaCajaAmbar" y usar el fondo de pantalla del landing para distinguir mejor los textos de "Tus colmenares" y otros.

Este mission es un **bulk edit**: renombra el término "La Caja Ámbar" a "LaCajaAmbar" en todos los archivos del repositorio, con reglas por categoría definidas en `occurrence_map.yaml`. También aplica el fondo de pantalla del landing de La Caja Ámbar (C:\lacajaambar-landing) para mejorar el contraste y legibilidad de los textos en la UI de BeeKeeper.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Renombrar marca en toda la aplicación (Priority: P1)

Como usuario de BeeKeeper, quiero que todas las referencias a "La Caja Ámbar" aparezcan como "LaCajaAmbar" para que la marca sea consistente y sin caracteres especiales.

**Why this priority**: Es el cambio principal del mission y afecta a todos los puntos de contacto de la marca en la aplicación.

**Independent Test**: Se puede verificar buscando "La Caja Ámbar" en todo el repositorio y confirmando que cero coincidencias quedan, mientras que "LaCajaAmbar" aparece en todos los lugares esperados.

**Acceptance Scenarios**:

1. **Given** el repositorio contiene referencias a "La Caja Ámbar" en código, UI y docs, **When** se ejecuta el bulk edit, **Then** ninguna referencia a "La Caja Ámbar" permanece en ningún archivo.
2. **Given** una pantalla de la aplicación que muestra "Tus colmenares", **When** se aplica el fondo de landing, **Then** el texto es legible gracias al contraste del fondo.

---

### User Story 2 - Aplicar fondo de landing para legibilidad (Priority: P1)

Como usuario de BeeKeeper, quiero que los textos como "Tus colmenares" destaquen sobre el fondo de la aplicación para poder leerlos con facilidad.

**Why this priority**: El fondo actual dificulta la lectura de ciertos textos; el fondo del landing resuelve esto.

**Independent Test**: Se puede verificar visualmente que los textos principales tienen suficiente contraste contra el fondo aplicado.

**Acceptance Scenarios**:

1. **Given** la pantalla de colmenares muestra "Tus colmenares", **When** se aplica el fondo del landing, **Then** el texto es claramente legible contra el fondo.

---

### Edge Cases

- ¿Qué sucede con referencias a "La Caja Ámbar" en comentarios de código que sean citas intencionales? Se renombran igual (usuario confirmó: renombrar en todos los archivos).
- ¿Qué sucede con nombres de archivos que contengan "La Caja Ámbar"? Se revisan manualmente (categoría `filesystem_paths: manual_review`).
- ¿Qué sucede con claves serializadas o claves de API que contengan el término? No se cambian (categoría `serialized_keys: do_not_change`).

## Requirements *(mandatory)*

### Functional Requirements

| ID | Title | User Story | Priority | Status |
|----|-------|------------|----------|--------|
| FR-001 | Renombrar "La Caja Ámbar" a "LaCajaAmbar" en todo el repositorio | As a usuario, quiero que la marca aparezca unificada como "LaCajaAmbar" en todos los archivos | High | Open |
| FR-002 | Aplicar fondo de landing en pantallas de BeeKeeper | As a usuario, quiero que textos como "Tus colmenares" sean legibles sobre el fondo de la aplicación | High | Open |
| FR-003 | No cambiar claves serializadas ni claves de API | As a desarrollador, quiero que las claves de API y JSON no se rompan por el renombrado | Medium | Open |
| FR-004 | Revisar rutas de sistema de archivos manualmente | As a desarrollador, quiero revisar caso por caso los cambios de ruta antes de aplicarlos | Medium | Open |

### Non-Functional Requirements

| ID | Title | Requirement | Category | Priority | Status |
|----|-------|-------------|----------|----------|--------|
| NFR-001 | Cero referencias residuales | Después del renombrado, buscar "La Caja Ámbar" en todo el repositorio debe retornar 0 resultados | Reliability | High | Open |
| NFR-002 | Contraste de texto | Los textos principales deben tener ratio de contraste mínimo 4.5:1 contra el fondo aplicado | Accessibility | High | Open |
| NFR-003 | Tiempo de aplicación del bulk edit | El renombrado en todos los archivos debe completarse en menos de 5 minutos | Performance | Medium | Open |

### Constraints

| ID | Title | Constraint | Category | Priority | Status |
|----|-------|------------|----------|----------|--------|
| C-001 | Renombrar en todos los archivos sin excepciones | El usuario confirmó que no hay archivos excluidos del renombrado | Business | High | Open |
| C-002 | No romper contratos de API | Las claves serializadas y nombres de CLI no se renombran | Technical | High | Open |
| C-003 | Rama de feature protegida | Los cambios deben desarrollarse en `feat/renombrar-lacajaamabar` y hacer merge a `master` vía PR | Process | High | Open |

### Key Entities *(include if feature involves data)*

- **Marca LaCajaAmbar**: El nombre unificado de la empresa, sin espacios ni acento, usado en toda la UI y código.
- **Fondo de landing**: El estilo de fondo visual del sitio de landing de La Caja Ámbar, aplicado a pantallas de BeeKeeper para mejorar legibilidad.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Búsqueda de "La Caja Ámbar" en todo el repositorio retorna 0 coincidencias.
- **SC-002**: "LaCajaAmbar" aparece en todos los archivos donde antes estaba "La Caja Ámbar" (excepto claves serializadas y logs de telemetría).
- **SC-003**: Los textos principales de la UI tienen ratio de contraste ≥ 4.5:1 contra el fondo de landing aplicado.
- **SC-004**: La aplicación compila y pasa typecheck después de los cambios.
