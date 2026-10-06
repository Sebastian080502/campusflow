# Dirección de diseño — CampusFlow

La interfaz que está en el código (menú lateral oscuro, tarjetas iguales de estado, píldoras e ilustración de campus sobre papel cálido) no se retoca. El siguiente cambio visual de esas pantallas se construye desde esta dirección.

## Producto

- **Qué es:** el expediente de una solicitud universitaria. Un trámite nace con un código `CF-`, cambia de manos y deja historial.
- **Qué debe hacer:** que el estudiante sepa en qué punto va su caso, que el personal lo tome y lo mueva, y que la administración cuide quién puede hacerlo.
- **Industria:** gestión académica. No es un producto de marketing ni un tablero de métricas.
- **Personalidad de marca:** secretaría de facultad. Papel de expediente, tinta, un sello, un número de radicado. Seria, cercana, sin campaña.
- **Objetivo del usuario:** abrir un caso y ver quién lo tiene, o radicar uno nuevo y saber qué pasa después.
- **Objetivo de negocio:** que ninguna solicitud quede sin responsable ni sin rastro.
- **Contenido real disponible:** códigos `CF-0001`, títulos como «Cambio de salón», categorías Académica, Administrativa, Tecnológica, Infraestructura y Otra, estados Pendiente → En revisión → En proceso → Resuelta → Cerrada, y Cancelada como salida del camino. Roles: estudiante, personal encargado, administrador.
- **Dispositivo y contexto:** escritorio de secretaría y teléfono del estudiante entre clases. Español.

## Usuario

María radica un cambio de salón y vuelve a mirar si ya tiene responsable. Luis abre la bandeja de pendientes y se asigna el caso. Ana no entra a «ver métricas»: entra a ver si el campus sigue atendiendo.

La tarea que termina la pantalla es una sola: el caso queda leído, asignado o radicado.

## Referencias

No se copia ninguna página. Cada fuente aporta una capa.

### Mobbin — UX e interacción

- **Expediente, no tablero.** En productos de trabajo (el detalle de un issue en Linear, la ficha de un ticket en un service desk) el objeto es el registro: código, estado, dueño e historial en una sola pieza. CampusFlow hace lo mismo con la solicitud. Las seis tarjetas de conteo dejan de ser la pantalla de inicio.
- **Bandeja del encargado.** El personal ve una lista densa, ordenada por lo que espera acción (pendiente arriba). El estado es una marca en el margen de la fila, no una píldora suelta.
- **Contraseña.** El control de mostrar u ocultar vive dentro del campo, con nombre accesible, como en los formularios de acceso revisados en Mobbin. No es un botón verde aparte.
- **Confirmación de un cambio de estado.** Mover un caso de estado es una decisión. Se confirma en la misma ficha, no en un modal genérico de «¿estás seguro?».

### Godly — identidad visual

Se toma el ritmo de una pieza editorial impresa: mucho margen, un solo color de tinta, un número enorme y poco adorno. No se toma el hero a pantalla completa ni el movimiento decorativo.

La transformación: el número `CF-0001` se compone como un radicado de secretaría (dígitos grandes, monoespaciados, alineados al margen), no como un badge. La ilustración del campus, si aparece, es un sello pequeño en la esquina del expediente, no una postal al lado del saludo.

Tipografía: un serif de texto para el título del caso (Newsreader o Source Serif) y una sans de oficina para el cuerpo (Source Sans 3). No Inter. No Fraunces display en cada encabezado.

### Web Anatomy — composición por sección

| Sección | Composición | Jerarquía | Ancla visual | Responsive |
|---|---|---|---|---|
| Acceso y registro | Una hoja centrada, como la carátula de un expediente. El formulario es la página. | Título breve, campos, acción «Entrar» o «Radicar cuenta». | El sello del campus en la esquina, no un hero. | La hoja ocupa el ancho útil. No hay columna de marketing que desaparecer. |
| Inicio | Un caso abierto arriba (el más reciente o el que espera acción) y, debajo, una regla vertical con los conteos del recorrido. | El caso, no el saludo. | El código `CF-` en grande. | La regla del recorrido pasa arriba del caso, en horizontal. |
| Listado | Libro de radicación: filas con el código a la izquierda, como el índice de un archivo. | Código, título, quién lo tiene. | La columna del código, más ancha que el resto. | Cada fila se vuelve una ficha de archivo, con el código como encabezado. |
| Detalle | Carpeta abierta. El recorrido es el lomo: una columna estrecha a la izquierda con los cinco estados. El cuerpo es descripción, responsable, comentarios e historial. | El título del caso y el estado actual en el lomo. | El lomo marcado en el estado vigente. | El lomo se vuelve una regla superior. |
| Nueva solicitud | Formulario a la izquierda y, a la derecha, la frase de lo que ocurrirá: «quedará pendiente con un código». | La categoría y el título. | La descripción de la categoría elegida, en el margen. | El «qué pasa después» queda debajo del botón. |
| Categorías y usuarios | Índice de secretaría, no tarjetas. Nombre, una línea de oficio, y el interruptor al margen. | El nombre de la categoría o de la persona. | El icono de oficio solo si distingue (aula, certificado, edificio, pantalla). | El interruptor permanece en la misma fila. |

### Land-book — narrativa y conversión

El valor no se anuncia con un eslogan de campaña. Se ve en el objeto: un código, un responsable y un recorrido. En el acceso, la única acción es entrar. En el inicio del estudiante, la acción es «radicar» o abrir el caso que ya existe. En el inicio del personal, la acción es tomar el pendiente. No hay un botón genérico «Ver solicitudes» compitiendo con el caso.

### Google Stitch — exploración

| Dirección | Idea | Por qué encaja o no |
|---|---|---|
| A — mínima / editorial | Carátula y carpeta de secretaría. Un color de tinta, radicado grande, lomo de estados. | Encaja: el producto es un expediente. Se distingue de un tablero. |
| B — expresiva | El campus es un mapa y cada solicitud es un punto sobre un edificio. | Memorable, pero el personal no puede trabajar una bandeja sobre un mapa. Encaje bajo. |
| C — centrada en el producto | Bandeja de service desk: filtros, tabla y panel lateral de detalle. | Resuelve la tarea y se parece a cualquier mesa de ayuda. Originalidad baja. |

**Elegida:** A, con la bandeja densa de Mobbin solo en el listado del personal.

**Por qué no se eligió la opción más convencional:** C repetiría el layout que ya fracasa la prueba del logo: menú lateral, tabla y tarjetas. A usa el mismo contenido (código, estado, responsable) con la forma de un archivo universitario.

## Design DNA

```yaml
design_dna:
  visual_direction: expediente de secretaría, tinta sobre papel, un sello, ningún hero
  typography: Newsreader o Source Serif para el caso; Source Sans 3 para la interfaz; el código CF en monoespaciada
  colors: papel #f4efe4, tinta #1c1915, sello #0e6b52 usado solo en el estado vigente y la acción principal
  layout: carátula en el acceso; carpeta con lomo de estados en el detalle; índice de radicación en el listado
  spacing: márgenes amplios en la carátula; filas compactas en la bandeja del personal
  radius: 2px en campos y filas; el sello puede ser circular; nada de píldoras en toda la página
  shadows: ninguna sombra de tarjeta; la separación es una línea de tinta al 12%
  imagery: un sello pequeño del campus; no una ilustración de postal
  icons: solo oficio (aula, documento, edificio, pantalla) y el ojo de la contraseña
  motion: el lomo marca el estado actual sin rebote; se respeta menos movimiento
  density: alta en listado y usuarios; baja en acceso y en la carátula del caso
```

## Qué hace único este diseño

Sin el nombre ni el logo sigue siendo un archivo de trámites de un campus: el radicado `CF-`, el lomo Pendiente → Cerrada, la salida Cancelada, y categorías de salón, matrícula y aulas. Una herramienta genérica de tickets no organiza el caso como una carpeta de secretaría ni pone el código como número de radicado.

## Evaluación

```yaml
evaluation:
  UX_quality: 8
  visual_identity: 8
  originality: 8
  hierarchy: 8
  responsiveness: 8
  accessibility: 8
  product_fit: 9
```

`originality` 8 y `product_fit` 9. La dirección puede implementarse.

Pregunta de cierre, sobre esta dirección y no sobre la pantalla actual: si se quitan el logo y el nombre, ¿la carpeta con radicado `CF-` y lomo de estados académicos podría ser de otro producto? No. La pantalla que hoy está publicada sí podría serlo; por eso el próximo cambio visual reemplaza ese layout y no solo su color.

## Anti-genérico

- [x] No se describe solo como "SaaS moderno" o "landing moderna".
- [x] No depende de gradiente púrpura/azul, Inter, pills, glass o grilla de tres cards.
- [x] Las secciones no repiten la misma estructura.
- [x] Al quitar logo y nombre, la dirección no podría servir para otros cien productos.

## Alcance del próximo incremento

Pantallas afectadas: acceso, registro, inicio, listado, detalle, nueva solicitud, categorías y usuarios. Se reemplaza el menú lateral de aplicación genérica, las seis tarjetas iguales y la postal del campus. Se conservan los textos en español, el botón de mostrar contraseña y los datos que ya muestra cada pantalla.
