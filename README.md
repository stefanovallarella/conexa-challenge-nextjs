# Rick & Morty Episode Explorer

Elegí dos personajes y descubrí en qué episodios coinciden y en cuáles no.

**→ [conexa-challenge-nextjs.vercel.app](https://conexa-challenge-nextjs.vercel.app)**

Probá una comparación directamente:
**[Rick vs. Birdperson](https://conexa-challenge-nextjs.vercel.app/?c1=1&c2=47)** ·
**[Rick vs. Beth](https://conexa-challenge-nextjs.vercel.app/?c1=1&c2=4)**

---

## Demo

https://github.com/user-attachments/assets/96ea8530-04e9-4bd4-aba1-c604a782f83c

---

## Cómo levantar el proyecto

### Requisitos

- Node.js 22.13 o superior

### Instalación

```bash
git clone https://github.com/stefanovallarella/conexa-challenge-nextjs.git
cd conexa-challenge-nextjs
npm install
npm run dev
```

Listo — no hay variables de entorno que configurar. La API de Rick & Morty es pública
y su URL vive como constante en `src/core/config/constants.ts`.

### Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | Genera los tipos de ruta y corre TypeScript |
| `npm run test` | Los tests con Vitest |
| `npm run test:watch` | Tests en modo watch |

---

## Arquitectura

### Estructura de carpetas

Organización **feature-based**: cada dominio agrupa sus componentes, hooks, servicios y
tipos. `core/` concentra únicamente lo que es genuinamente transversal.

```
src/
├─ app/                        Rutas y convenciones de Next
│    layout · page · loading · error · not-found · opengraph-image
│
├─ features/
│  ├─ characters/              Los dos paneles de selección
│  │    components · context · hooks · services · types · queries
│  ├─ episodes/                Las tres secciones de episodios
│  │    components · hooks · services · types · utils · queries
│  └─ comparison/              Lo que une a las dos anteriores
│       components · hooks · store · utils
│
├─ core/                       Transversal, sin conocimiento del dominio
│  ├─ components/ui/           Button, Card, Badge, Pagination, EmptyState…
│  ├─ hooks/                   useDebounce, useIsHydrated
│  ├─ lib/                     apiClient, queryClient, cn
│  └─ config/                  constants
│
├─ providers/                  QueryProvider, ThemeProvider
└─ test/                       setup, handlers de MSW y fixtures
```

Los tests viven **junto al archivo que prueban**, no en un árbol paralelo: si el
proyecto se organiza por feature, sus pruebas también. En `test/` solo hay
infraestructura compartida.

### Capa de datos

Cada feature define tres cosas:

1. Un **schema de Zod** que refleja la respuesta de la API, del que se **infiere** el
   tipo. El schema es la única fuente de verdad: no hay una interfaz escrita a mano que
   pueda desincronizarse de lo que efectivamente se valida.
2. Un **tipo de dominio** (`Character`, `Episode`) con lo que la UI necesita.
3. Una función **`map*` pura** que convierte uno en el otro.

La UI nunca consume la respuesta cruda. Si la API cambia un campo, se toca el mapper.

### Estrategia de renderizado

`page.tsx` es un **Server Component**: lee los `searchParams`, resuelve los datos en el
servidor e hidrata el caché de TanStack Query. El HTML llega con la comparación ya
armada — sin pantalla vacía ni parpadeo.

`"use client"` se declara en el primer componente interactivo de cada rama, nunca en el
layout ni en la página.

### Manejo de estado

Tres capas con responsabilidades que no se solapan:

| Qué es el dato | Dónde vive |
|---|---|
| Viene de la API y puede quedar obsoleto | **TanStack Query** |
| Elección del usuario que leen ramas no relacionadas | **Zustand** |
| Identidad o configuración de un subárbol | **Context** |
| Solo lo usa un componente | `useState` local |

El store de Zustand guarda **una sola cosa**: qué personaje está elegido en cada slot, y
como IDs, no como objetos. Paginación, búsqueda y filtro son estado local del panel al
que pertenecen — nadie fuera de ese subárbol los necesita.

El `slotId` va por Context porque **nunca cambia** para su subárbol: es identidad, no
estado. Así las cards, los filtros y la paginación no reciben por props algo que es
constante para toda la sección.

---

## Decisiones técnicas

### Un solo request para las tres secciones

`GET /character` devuelve cada personaje **ya con la lista de episodios en los que
aparece**. Entonces las tres secciones no requieren consultar nada: son teoría de
conjuntos sobre IDs que ya están en memoria.

```
onlyA = A \ B      shared = A ∩ B      onlyB = B \ A
```

Y como los episodios se piden con `GET /episode/1,2,3`, se hace **una sola llamada** con
la unión de ambos conjuntos para poblar las tres columnas. Nunca una por sección, y
jamás una por episodio.

Los contadores del diagrama son inmediatos por el mismo motivo: se calculan desde los
IDs, sin esperar a que lleguen los episodios.

### Elegir un personaje visible no cuesta un request

Cuando alguien selecciona a un personaje que está viendo en pantalla, su información ya
está en el caché de la página cargada. `useSelectedCharacters` lo busca ahí antes de
pedir nada. Solo sale a la red cuando el personaje viene de un link compartido y no está
en ninguna página cargada.

### La URL como proyección del store

La comparación es direccionable: `?c1=1&c2=2` abre la app con las tres secciones ya
pobladas, renderizadas en el servidor.

El store es la **única fuente escribible**; la URL es una proyección de salida. Nada la
lee de vuelta, así que las dos no pueden desincronizarse. Se usa `replaceState` en lugar
del router porque un cambio de selección es estado puramente de cliente y no justifica
volver a correr el render del servidor.

Al escribir, se **edita** la URL existente en vez de reconstruirla, para que sobrevivan
los parámetros de campaña y el fragmento con los que el visitante haya llegado.

### El store y el cliente de queries se crean por request

Un servidor de Next atiende múltiples requests en simultáneo. Un store definido a nivel
de módulo se crea una vez por proceso y se comparte entre todos los visitantes — con lo
cual la selección de una persona puede filtrarse al render de otra.

Por eso ambos son factories montadas en un provider. Es el patrón que documentan
[Zustand](https://zustand.docs.pmnd.rs/learn/guides/nextjs) y
[TanStack Query](https://tanstack.com/query/latest/docs/framework/react/guides/ssr),
que describe el caso contrario como una fuga de datos.

### REST en lugar de GraphQL

La consigna permitía cualquiera de las dos. El endpoint batch de REST resuelve en una
llamada lo mismo que resolvería GraphQL, y además cachea mejor por ser una URL. El
argumento habitual a favor de GraphQL —evitar el N+1— no aplica: los episodios de cada
personaje ya vienen en el payload del listado.

### Validación de contrato en el borde

Todas las respuestas se validan con Zod dentro del cliente HTTP, y el parámetro `schema`
es **obligatorio**: validar no es algo que un desarrollador pueda olvidarse. Un error de
contrato es distinto de un error HTTP, así que son excepciones separadas — solo una de
las dos tiene sentido reintentar.

### No hay filtro por especie, y es a propósito

Es la decisión que más se nota por ausencia, así que vale explicarla. Se probó contra la
API antes de descartarla:

```
?species=Human     → 434 resultados
?species=Humanoid  →  68     ← incluidos en los 434 anteriores
```

**El filtro `species` de la API matchea por substring**, no por igualdad: pedir "Human"
devuelve también a los "Humanoid". Y la API tampoco expone el catálogo de especies, así
que poblar un desplegable exigiría hardcodear datos que viven en el backend.

Un filtro así mostraría resultados incorrectos, y el problema está en la API, no en la
interfaz. Quedaron la búsqueda por nombre —que es como se busca un personaje— y el
filtro de estado, que sí es un enum acotado y documentado.

### El caché

El dataset de Rick & Morty es inmutable: no hay nada que revalidar. Las lecturas del
servidor usan `revalidate: 3600` y TanStack Query usa `staleTime: Infinity`.

---

## Diseño

La dirección visual es una **oficina de registros interdimensional**: fichas clínicas,
etiquetas de datos en monoespaciada, densidad alta, cero decoración. Sale de la veta
burocrática de la serie — la Ciudadela, el Consejo de Ricks, la Federación Galáctica — y
evita deliberadamente el verde neón sobre negro, que es el camino obvio y el que toma
casi todo el mundo.

**El color es información, no decoración.** Character #1 es teal y Character #2 es
ámbar, y esa identidad los acompaña por toda la interfaz: el título del panel, el anillo
de la card elegida, el chip, el código de cada episodio y su región del diagrama. La
sección compartida no inventa un tercer color: usa el gradiente entre ambos.

El par teal/ámbar tampoco es casual: el eje azul–naranja es el más seguro para
daltonismo. Y el color nunca es el único canal — cada sección lleva su etiqueta y su
contador.

Los tokens están declarados en dos capas —primitivos y semánticos— así que el tema
oscuro se implementa reapuntando la capa semántica **sin tocar un solo componente**.

Y hay una distinción que el sistema sostiene: los colores de identidad no alcanzan el
contraste AA como texto sobre fondo claro (`#0EA5A5` da 3.03:1). Por eso existen tokens
separados: `--color-slot-N` para trazos y rellenos, `--color-slot-N-text` para glifos.

---

## Testing

**22 tests** con Vitest, Testing Library y MSW.

El criterio no fue la cobertura: **se testea lo que puede romperse en silencio.** Si al
romperse la aplicación deja de compilar o falla de forma visible, un test no agrega
nada.

| Comportamiento | Tests |
|---|---|
| Los episodios se parten en tres conjuntos correctamente | 4 |
| Las tres secciones no muestran nada hasta elegir en ambos paneles | 1 |
| Las tres secciones se pueblan bien, y con un solo request | 2 |
| La selección es por slot, alterna, y no se filtra entre visitantes | 3 |
| La comparación sobrevive el viaje por la URL y tolera links rotos | 4 |
| El contrato de la API se valida en el borde | 3 |
| Los datos de la API se traducen al dominio | 2 |
| Buscar o filtrar vuelve a la página 1 | 1 |
| Elegir a alguien en pantalla no cuesta un request | 1 |
| Una búsqueda sin resultados no es un error | 1 |

El ejemplo que mejor ilustra el criterio es el del request único: si un refactor lo
convierte en tres, **la pantalla se ve exactamente igual**. Nadie se entera hasta abrir
la pestaña de red. Eso es lo que un test tiene que sostener.

No hay tests de componentes por la misma razón: verificar que una card renderiza
"Alive · Human" es verificar que React interpola props, y si eso se rompiera se vería en
cualquier captura de pantalla.

Cada push corre **lint, typecheck, tests y build** en GitHub Actions.

---

## Accesibilidad

- Las cards son `<button>` reales con `aria-pressed`, no `div` con `onClick`.
- Las tres regiones del diagrama son botones con etiquetas descriptivas
  (*"31 episodes shared by Rick Sanchez and Birdperson"*).
- Foco visible en todo elemento interactivo, con contraste suficiente en ambos temas.
- Los resultados de búsqueda se anuncian con `aria-live`.
- El color nunca es el único canal de información.
- Áreas táctiles de 40px en los controles que se usan con el dedo.

---

## Librerías utilizadas

| Librería | Uso |
|---|---|
| `next` 16 | Framework, App Router, SSR |
| `react` 19 | UI |
| `typescript` 5 | Tipado estricto — sin `any` ni casteos en todo el proyecto |
| `@tanstack/react-query` 5 | Server state: caché, deduplicación, paginación |
| `zustand` 5 | La selección de personajes |
| `zod` 4 | Validación del contrato de la API y de los parámetros de URL |
| `tailwindcss` 4 | Estilos y design tokens |
| `class-variance-authority` | Variantes de los primitivos de UI |
| `next-themes` | Tema claro/oscuro sin parpadeo antes de la hidratación |
| `vitest` + `@testing-library/react` + `msw` | Testing |

Los componentes de interfaz son propios. No se usó ninguna librería de componentes:
`Button`, `Card`, `Badge`, `Pagination`, `Select` y el resto están construidos sobre
Tailwind con CVA para las variantes.

---

## To Do

- [ ] **Imagen de OpenGraph dinámica por comparación** — hoy el preview al compartir es
      una imagen fija. Generarla con `ImageResponse` a partir de los `searchParams`
      mostraría las dos caras y el número de episodios compartidos.
- [ ] **Tests end-to-end con Playwright** — el flujo completo en un navegador real,
      complementando los unitarios.
- [ ] **Virtualización de la lista** — innecesaria con 20 elementos por página, pero
      sería el paso siguiente si el listado creciera.
- [ ] **Validación de schema en runtime para respuestas de una API mutable** — Zod ya
      valida el borde; con una API en evolución convendría además reportar los errores
      de contrato a un servicio de monitoreo.
- [ ] **Internacionalización** — la interfaz está en inglés porque los datos lo están.
- [ ] **Priorizar la carga de la primera fila de imágenes** — `loading="eager"` en las
      cards visibles al entrar, para mejorar el LCP.
