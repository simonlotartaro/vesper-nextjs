# About — Rediseño editorial

Especificación del rediseño de la sección About. **Ningún texto del contenido fue
modificado**: se reordenó únicamente su presentación. La implementación vive en
[`components/AboutSection.tsx`](../components/AboutSection.tsx).

---

## 1. Diagnóstico del diseño anterior

| Síntoma | Causa concreta en el código anterior |
|---|---|
| Se leía como un PDF elegante | Una única columna de 680px, `flex-direction: column`, `gap: 28px` uniforme de principio a fin |
| Sin tensión visual | Todo el contenido en la misma familia (Cormorant 300) y en un rango de tamaño de 15→21px: 6px de variación tipográfica en toda la sección |
| Sin ancla visual | Cero elementos no-tipográficos salvo dos hairlines doradas |
| Sin ritmo de scroll | Densidad constante; ningún cambio de fondo, escala o composición durante ~4000px de scroll |
| Manifiesto invisible | Las 3 frases `neg` estaban a **15–18px, gris #9b988e, itálica**, es decir *más chicas y más apagadas* que el cuerpo — el momento más fuerte del texto tratado como nota al pie |
| Cierre débil | "Welcome to Vesper." a 30px, al final de la columna, sin aire |
| Cuerpo poco legible | Serif display a peso 300 usada para textos de 60+ palabras, contraste bajo (#d6d2c8 a peso fino), sin control de medida (líneas de ~95 caracteres) |
| Navegación pesada | Botones circulares de 46px y 42px; idiomas inactivos a `rgba(236,231,219,0.3)` ≈ 2.4:1 de contraste (por debajo de AA) |

---

## 2. Wireframe desktop

```
┌──────────────────────────────────────────────────────────────┐
│ (←)                                          EN  es  fr  (≡) │  nav fija, 37/39px
│                                                              │
│                                                              │
│  01 —— ABOUT                                                 │  1 · APERTURA
│                                                              │  ~92vh
│  Vesper stems from a simple,                                 │  serif 96px
│  yet powerful reality.                                       │
│                                                              │
│  ────                                                        │  hairline 64px
│  —— SCROLL                                                   │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────┐                                              │  2 · NARRATIVA
│  │            │   Lorem ipsum párrafo 1 ................      │  grid .85 / 1.15
│  │  ANCLA     │   ...........................................  │
│  │  VISUAL    │                                              │
│  │  3:4       │   párrafo 2 ................................  │  ← columna izq.
│  │  sticky    │   ...........................................  │    STICKY
│  │            │                                              │
│  │        01  │   párrafo 3 ................................  │
│  └────────────┘   ...........................................  │
├──────────────────────────────────────────────────────────────┤
│ ▓▓ fondo #03040A ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  3 · MANIFIESTO
│ │                                                            │
│ │   We don't want to create                                  │  serif 76px
│ │   just another party.                                      │  reveal escalonado
│ │                                                            │  140ms entre frases
│ │   We don't want to hold a                                  │
│ │   gathering of celebrities.                                │  ← rule dorada
│ │                                                            │    vertical única
│ │   We don't want to use big                                 │
│ │   names as decoration.                                     │
├──────────────────────────────────────────────────────────────┤
│  02 ——           párrafo 4 .................................  │  4 · CONSECUENCIA
│  (sticky)        párrafo 5 .................................  │
├──────────────────────────────────────────────────────────────┤
│  03 ——           vp1 .......................................  │  5 · VISIÓN
│                  vp2 .......................................  │
│  The Vision      ─────────────────────────────────────────   │
│  (serif 52px,    01   Polo has its universe.                 │  lista de precisión
│   sticky)        ─────────────────────────────────────────   │  sans + índices
│                  02   Tennis has its universe.               │  dorados
│                  ─────────────────────────────────────────   │
│                  03   Football has its universe.       ...   │
│                  vp3 / vp4 ................................   │
├──────────────────────────────────────────────────────────────┤
│ ▓▓ #03040A + radial dorado 9% ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  6 · CIERRE
│                          │  (línea vertical dorada)          │  ~88vh
│                                                              │
│                   Welcome to Vesper.                         │  serif itálica 84px
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 3. Wireframe mobile (< 820px)

Una sola columna, sin sticky. El orden de lectura es idéntico.

```
┌────────────────────────┐
│ (←)         en es (≡)  │
│                        │
│ 01 —— ABOUT            │   apertura 82vh
│                        │
│ Vesper stems           │   serif clamp → 40px
│ from a simple,         │
│ yet powerful           │
│ reality.               │
│ ────                   │
│ —— SCROLL              │
├────────────────────────┤
│ ┌────────────────────┐ │   ancla 4:5 (no 3:4)
│ │  ANCLA VISUAL      │ │   full-bleed de columna
│ │              01    │ │
│ └────────────────────┘ │
│                        │
│ párrafo 1 ...........  │   sans 15.5px / 1.78
│                        │
│ párrafo 2 ...........  │
│ párrafo 3 ...........  │
├────────────────────────┤
│ │  We don't want to    │   manifiesto: serif 30px
│ │  create just         │   (5.4vw), padding 26px
│ │  another party.      │   la rule dorada se mantiene
│ │                      │   pero a gap 22px
│ │  We don't want ...   │
├────────────────────────┤
│ 02 ——                  │   el label sticky pasa a
│ párrafo 4 / 5          │   header inline del bloque
├────────────────────────┤
│ 03 —— The Vision       │
│ vp1 / vp2              │
│ ── 01 Polo has ...     │   la lista mantiene reglas
│ ── 02 Tennis has ...   │   horizontales, gap 16px
│ vp3 / vp4              │
├────────────────────────┤
│   Welcome to Vesper.   │   cierre 72vh, serif 34px
└────────────────────────┘
```

**Decisión mobile:** el sticky se desactiva por completo (`isMobile` corta
`position: sticky`). Un sticky de 3:4 en una pantalla de 640px de alto deja ~180px
para el texto: perjudica la navegación en vez de ayudarla.

---

## 4. Sistema tipográfico

Ambas familias ya estaban cargadas en `app/layout.tsx`; no se agregó ninguna request.

| Rol | Familia | Peso | Tamaño | Line-height | Tracking |
|---|---|---|---|---|---|
| Headline apertura | Cormorant Garamond | 300 | `clamp(40px, 6.6vw, 96px)` | 1.02 | −0.02em |
| Manifiesto | Cormorant Garamond | 300 | `clamp(30px, 5.4vw, 76px)` | 1.06 | −0.02em |
| Cierre | Cormorant Garamond | 300 itálica | `clamp(34px, 6vw, 84px)` | 1.06 | −0.02em |
| Título de capítulo | Cormorant Garamond | 300 | `clamp(30px, 3.6vw, 52px)` | 1.08 | −0.015em |
| **Cuerpo** | **Hanken Grotesk** | **400** | `clamp(15.5px, 1.05vw, 17.5px)` | **1.78** | 0 |
| Ítems de lista | Hanken Grotesk | 400 | `clamp(15px, 1.05vw, 17px)` | 1.5 | 0.01em |
| Labels | Hanken Grotesk | 500 | 10px | — | 0.42em |
| Numerales | Hanken Grotesk | 500 | 11px | — | 0.30em |

**Serif = lujo, cultura, personalidad. Sans = deporte, modernidad, precisión.**
La regla es binaria: si la frase transmite emoción va en serif; si transporta
información o es UI va en sans.

### Legibilidad — qué cambió exactamente

| | Antes | Ahora |
|---|---|---|
| Familia del cuerpo | Cormorant Garamond (display) | Hanken Grotesk (texto) |
| Peso | 300 | 400 |
| Color | `#d6d2c8` | `#D6D1C5` |
| Contraste s/ #06080F | ~11:1 pero con peso 300 en serif fina → percibido mucho menor | mismo ratio, con un peso que lo sostiene |
| Medida | sin límite (≈95 car.) | **`max-width: 62ch`** |
| Interlineado | 1.75 | 1.78 |
| Separación entre bloques | 28px fijo | `clamp(30px, 4.5vh, 44px)` |

---

## 5. Grilla, márgenes y espaciados

```
container      max-width 1240px · margin 0 auto
gutters        clamp(24px, 5vw, 72px)
grid desktop   minmax(0,0.85fr) minmax(0,1.15fr) · gap clamp(48px, 7vw, 120px)
grid mobile    display: block
ritmo vertical clamp(96px, 16vh, 180px) por sección
sticky offset  top: clamp(96px, 18vh, 180px)
medida texto   62ch
ancla          max 400px, aspect-ratio 3/4 (desktop) · 4/5 (mobile)
breakpoint     820px (el mismo que ya usaba el sitio)
```

### Paleta

| Token | Valor | Uso |
|---|---|---|
| Fondo base | `#06080F` | apertura, narrativa, visión |
| Fondo profundo | `#03040A` | manifiesto y cierre — el cambio de fondo *es* el marcador de capítulo |
| Ivory | `#F4EFE4` | titulares, manifiesto, ítems de lista |
| Body | `#D6D1C5` | párrafos |
| Muted | `#8E8A80` | secundario |
| Gold | `#C6A258` | **solo** labels, reglas, numerales, hover, idioma activo |

No se agregó dorado nuevo. Se retiró de donde era decorativo (los `border-left`
de los bloques citados) y se concentró en índices y reglas estructurales.

---

## 6. Scroll y animaciones

Una sola primitiva: el componente `Reveal`.

```
trigger     IntersectionObserver · threshold 0.08 · rootMargin 0 0 -12% 0
propiedad   opacity 0→1 + translateY(22px)→0     (solo compositor)
duración    800ms
easing      cubic-bezier(.16,1,.3,1)
delay       escalonado 60ms (párrafos) · 140ms (manifiesto)
repetición  ninguna — se desconecta el observer al disparar
```

- **Sticky** en la columna izquierda de las pantallas 2, 4 y 5. Sin JS: `position: sticky`.
- **Sin scroll hijacking, sin parallax, sin scroll-linked animations.** El único
  movimiento acoplado al scroll es el sticky nativo del navegador.
- `willChange` se limpia a `auto` en cuanto el elemento aparece.
- **`prefers-reduced-motion`**: doble cobertura — `Reveal` renderiza visible sin
  transición, y `globals.css` neutraliza toda animación/transición globalmente.

---

## 7. Tratamiento de la imagen / video

El ancla está construida como un componente (`Anchor`) con un **slot**:

```ts
// components/AboutSection.tsx
const ANCHOR_SRC: string | null = null;
```

**Para activarla:** poner el archivo en `public/assets/` y cambiar esa constante a
su ruta. No hace falta tocar nada más — el `<img>` ya sale con `loading="lazy"`,
`decoding="async"`, `object-fit: cover` y `alt=""` (es decorativa, no aporta
información que no esté en el texto).

Especificación del material:

- Vertical **3:4**, mínimo 1200×1600, exportada en **WebP o AVIF** (< 250 KB).
- Contenido: concentración, tensión previa a competir, manos, respiración, una
  mirada, un túnel, un vestuario. **No**: brindis, copas, famosos posando, nightlife.
- Grado: se le aplica `saturate(0.9) contrast(1.08)` para que se integre a la paleta.

**Si es video**: reemplazar el `<img>` por `<video autoplay muted loop playsinline
preload="metadata" poster="...">`, H.264 + WebM, < 3 MB, sin audio, y envolverlo en
un guard de `prefers-reduced-motion` que muestre solo el poster.

**Mientras no haya material**, el componente renderiza una placa editorial
compuesta (gradiente radial dorado 16% + degradé diagonal, grano SVG inline al 16%
en `mix-blend-mode: overlay`, viñeta inferior, marco hairline con offset de 14px y
el numeral 01). Es una composición deliberada, no un placeholder gris.

---

## 8. Navegación

| Elemento | Antes | Ahora | Δ |
|---|---|---|---|
| Botón volver | 46px∅ | **37px∅** | −20% |
| Hamburguesa | 46px∅ | **39px∅** | −15% |
| Barras del menú | 18/13/8px | 15/11/7px | proporcional |
| Borde | `rgba(198,162,88,0.55)` | `rgba(198,162,88,0.38)` | menos peso |
| Idioma inactivo | `rgba(236,231,219,0.30)` ≈ 2.4:1 | `rgba(236,231,219,0.58)` ≈ **6.9:1** | pasa AA |
| Idioma activo | solo color | color + **borde inferior dorado** + peso 500 | doble señal |
| Target táctil idiomas | ~14×13px | **padding 8/6 → ~30×27px** | usable |
| Hover | `border-color .3s` | 450ms + fondo dorado 7% + `#DEBB78` | |
| Foco teclado | ninguno | `:focus-visible` outline dorado 1px, offset 3px | |

El botón de volver ahora lleva `background: rgba(6,8,15,0.6)` + blur: se mantiene
legible cuando pasa por encima del manifiesto o del cierre en `#03040A`.

---

## 9. Notas de implementación

- **El backdrop-click para cerrar se retiró.** Con secciones a sangre completa
  prácticamente no queda backdrop, y un clic accidental sobre el fondo del
  manifiesto cerraba toda la sección a mitad de lectura. Quedan **Escape**, el
  **botón de volver** y el **back del navegador** (`popstate`, ya existente).
- El overlay pasó de `rgba(4,5,10,0.96)` + `blur(12px)` a `#06080F` sólido: el
  backdrop-filter sobre un contenedor scrolleable de ~6000px es caro en mobile y
  ya no aporta nada porque el contenido de atrás no se ve.
- La animación de entrada del overlay pasó de `vUp` (que desplazaba 18px toda la
  sección) a `vFadeIn`, para no competir con los reveals internos.
- Sin dependencias nuevas. Sin CSS nuevo salvo 4 reglas en `globals.css`.

### Chequeo de performance

- 0 animaciones acopladas al scroll → sin trabajo en el hilo principal durante el scroll.
- Solo `opacity` y `transform` → todo en el compositor.
- El grano es un SVG inline en data-URI (~230 bytes), no un PNG.
- `aspect-ratio` en el ancla reserva el espacio → sin CLS al cargar la imagen.
- El bundle de la home subió de 16.4 kB a 17.1 kB.

### Pendiente

1. Conseguir y colocar el material del ancla visual (§7) — es la única pieza que
   falta para que la sección quede completa.
2. Definir si el cierre necesita un CTA de continuidad hacia la siguiente sección
   (pantalla 5 del brief). Requiere decidir qué copy usar; hoy termina en
   "Welcome to Vesper." con aire, sin corte abrupto.
