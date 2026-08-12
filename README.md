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

### Requisitos previos

- Node.js 22.13 o superior

### Instalación

```bash
# 1. Clonar el repositorio y acceder a la carpeta
git clone https://github.com/stefanovallarella/conexa-challenge-nextjs.git
cd conexa-challenge-nextjs

# 2. Instalar dependencias
npm install
```

No hay variables de entorno que configurar. La API de Rick & Morty es pública y su URL
vive como constante en `src/core/config/constants.ts`.

### Correr la app

```bash
# Desarrollo
npm run dev

# Tests
npm run test

# Build de producción
npm run build
```

---

## Arquitectura

### Estructura de carpetas

```
src/
├─ app/                    Rutas y convenciones de Next
│
├─ features/               Una carpeta por cada feature
│  ├─ characters/          Los dos paneles de selección
│  ├─ episodes/            Las tres secciones de episodios
│  └─ comparison/          Lo que une a las dos anteriores
│
├─ core/                   Lo que usan todas las features
│  ├─ components/ui/       Button, Panel, Badge, Pagination, EmptyState…
│  ├─ hooks/               useDebounce, useIsHydrated
│  ├─ lib/                 apiClient, queryClient, cn
│  └─ config/              constants
│
├─ providers/              QueryProvider, ThemeProvider
└─ test/                   setup, handlers de MSW y fixtures
```

El proyecto sigue una **arquitectura feature-based**: cada carpeta de `features/`
agrupa sus propios componentes, hooks, servicios y tipos. En `core/` está solo lo que
usan todas.

Puse los tests junto al archivo que prueban, no en un árbol paralelo. Si el proyecto se
organiza por feature, considero que sus pruebas también deberían. En `test/` solo hay
infraestructura compartida.

### Capa de datos

Cada feature define:

- Un **schema de Zod** que refleja la respuesta de la API, del que se infiere el tipo
- Un **tipo propio** (`Character`, `Episode`) con lo que la UI necesita
- Una función **`map*` pura** que convierte uno en el otro

El schema es la única fuente de verdad, así que no hay una interfaz escrita a mano que
pueda desincronizarse de lo que efectivamente se valida. Si la API cambia un campo, se
toca solo el mapper y listo.

---

## Decisiones técnicas

### Un solo request para las tres secciones

`GET /character` devuelve cada personaje ya con la lista de episodios en los que
aparece. Entonces las tres secciones no requieren consultar nada. Son operaciones de
conjuntos sobre IDs que ya están en memoria.

```
onlyA = A \ B      shared = A ∩ B      onlyB = B \ A
```

Los episodios se piden con `GET /episode/1,2,3`, así que una sola llamada con la unión
de ambos conjuntos nos sirve para poblar las tres columnas. Los contadores del diagrama son inmediatos
por el mismo motivo: salen de los IDs, sin esperar a que lleguen los episodios. (ya están cargados).

### Compartir una comparación por URL

`?c1=1&c2=2` abre la app con las tres secciones ya pobladas desde el servidor. El store
es la única fuente escribible y la URL es una proyección de salida: nada la lee de
vuelta, así que las dos no pueden desincronizarse.

Al escribir se edita la URL existente en vez de reconstruirla, para que sobrevivan los
parámetros y el fragmento con los que el visitante haya llegado.

### Un filtro de la API que no se puede usar

Probando la API antes de sumar filtros encontré que `?species=` matchea por substring:
pedir `Human` devuelve también los 68 `Humanoid`. Como además no expone el catálogo de
especies, un desplegable mostraría resultados incorrectos, así que decidí no aplicarlo.

Quedaron la búsqueda por nombre y el filtro de estado, que sí es un enum acotado.

### Elegir un personaje visible no cuesta un request

Si alguien selecciona a un personaje que está viendo en pantalla, su información ya está
en el caché de la página cargada y se reutiliza. Solo sale a la red cuando el personaje
viene de un link compartido y no está en ninguna página cargada.

---

## Testing

**22 tests** con Vitest, Testing Library y MSW, más CI en cada push.

No busqué cobertura, sino testear lo que puede romperse en silencio. El mejor ejemplo
es el del request único: si un refactor lo convierte en tres, la pantalla
se ve exactamente igual y nadie se entera hasta abrir la pestaña de red.

Por eso cubrí la lógica de conjuntos, la validación de que hacen falta ambos personajes,
el parseo del link compartido, la traducción de la API y el store. No hay
tests de componentes: verificar que una card renderiza "Alive · Human" es verificar que
React interpola props.

---

## Librerías utilizadas

| Librería                             | Uso                                             |
| ------------------------------------ | ----------------------------------------------- |
| `next` 16                            | Framework, App Router, SSR                      |
| `react` 19                           | UI                                              |
| `typescript` 5                       | Tipado estricto, sin `any` ni casteos           |
| `@tanstack/react-query` 5            | Server state: caché, deduplicación, paginación  |
| `zustand` 5                          | La selección de personajes                      |
| `zod` 4                              | Validación de la API y de los parámetros de URL |
| `tailwindcss` 4                      | Estilos y design tokens                         |
| `class-variance-authority`           | Variantes de los primitivos de UI               |
| `next-themes`                        | Tema claro/oscuro sin parpadeo                  |
| `vitest` · `testing-library` · `msw` | Testing                                         |

Elegí no utilizar ninguna librería de componentes.

---

## To Do

- [ ] **Imagen de OpenGraph dinámica** — hoy el preview al compartir es fija; generarla
      desde los `searchParams` mostraría las dos caras y los episodios compartidos
- [ ] **Avanzar solo a la pestaña vacía en mobile** — al elegir en un panel, mostrar el
      que sigue vacío. La regla tiene que reaccionar a la transición vacío→lleno y no al
      estado, para no mover la vista al deseleccionar ni al abrir un link compartido
- [ ] **Tests end-to-end con Playwright** — el flujo completo en un navegador real
- [ ] **Multi-idioma** — la interfaz está solo en inglés porque los datos de la API están en inglés
- [ ] **Priorizar la carga de la primera fila de imágenes** para mejorar el LCP
