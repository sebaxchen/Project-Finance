# Guion Completo de la Aplicación HomeCredit

## Índice
1. [Arquitectura General](#arquitectura-general)
2. [Sistema de Autenticación](#sistema-de-autenticación)
3. [Landing Page (Página Principal Pública)](#landing-page)
4. [Página de Autenticación](#página-de-autenticación)
5. [Dashboard (Panel Principal)](#dashboard)
6. [Gestión de Clientes](#gestión-de-clientes)
7. [Gestión de Propiedades](#gestión-de-propiedades)
8. [Simulaciones de Crédito](#simulaciones-de-crédito)
9. [Página de Soporte Técnico](#página-de-soporte-técnico)
10. [Página de Reclamaciones](#página-de-reclamaciones)
11. [Página Premium (Planes y Pagos)](#página-premium)
12. [Página de Documentación](#página-de-documentación)
13. [Página de Capacitación](#página-de-capacitación)
14. [Componentes de Layout](#componentes-de-layout)
15. [Base de Datos y Estructura](#base-de-datos-y-estructura)

---

## Arquitectura General

### Tecnologías Utilizadas
- **Frontend**: React 18.3.1 con TypeScript
- **Estilos**: Tailwind CSS 3.4.1
- **Autenticación**: Firebase Authentication (a través de Supabase client)
- **Base de Datos**: Firebase Firestore (simulado con FirebaseSupabase)
- **Build Tool**: Vite 5.4.2
- **Iconos**: Lucide React

### Estructura de Navegación
La aplicación utiliza un sistema de navegación basado en estado (`currentPage`) que controla qué página se muestra. El flujo es:
1. Usuario no autenticado → Landing Page → Auth Page
2. Usuario autenticado → Dashboard con Sidebar y Footer

### Componentes Principales
- **App.tsx**: Componente raíz que maneja el routing y autenticación
- **AuthContext**: Contexto global para gestión de autenticación
- **Sidebar**: Menú lateral fijo con navegación principal
- **Footer**: Pie de página con enlaces adicionales

---

## Sistema de Autenticación

### AuthContext (`src/contexts/AuthContext.tsx`)
**Funcionalidad**: Gestiona todo el estado de autenticación de la aplicación.

**Estados**:
- `user`: Usuario autenticado (Firebase User)
- `profile`: Perfil del usuario desde la tabla `profiles`
- `loading`: Estado de carga inicial

**Funciones principales**:
- `signIn(email, password)`: Inicia sesión con email y contraseña
- `signUp(email, password, fullName, role)`: Registra nuevo usuario
  - Crea usuario en Firebase Auth
  - Crea perfil en tabla `profiles` con rol por defecto 'advisor'
- `signOut()`: Cierra sesión
- `loadProfile(userId)`: Carga el perfil del usuario desde la BD

**Tablas de Base de Datos**:
- `auth.users` (Firebase): Usuarios autenticados
- `profiles`: Perfiles de usuario con `id`, `email`, `full_name`, `role` (admin/advisor/client)

---

## Landing Page

### Ubicación: `src/pages/LandingPage.tsx`

### Descripción Visual
Página pública de presentación con diseño one-page que incluye múltiples secciones.

### Secciones

#### 1. Hero Section
- **Diseño**: Dos columnas en pantallas grandes
- **Columna Izquierda**:
  - Logo HomeCredit con icono de casa azul
  - Título grande: "Gestión Inteligente de Créditos Hipotecarios"
  - Descripción del servicio
  - Lista de características con checkmarks verdes:
    - Simulaciones precisas
    - Cumplimiento normativo
    - Gestión integral
    - Soporte especializado
- **Columna Derecha**:
  - Tarjeta blanca centrada
  - Icono de HomeCredit en círculo azul
  - Título "Accede a HomeCredit"
  - Botón grande azul "Ingresar a HomeCredit" con flecha

#### 2. Sección del Equipo
- **Título**: "Nuestro Equipo"
- **Contenido**: Grid de tarjetas con miembros del equipo
- **Datos mostrados**:
  - Foto del miembro (o emoji por defecto)
  - Nombre completo
  - Rol (Software/Sistemas)
  - Código universitario (U202217853, etc.)
- **Miembros**:
  - Beingolea Montalvo Sebastián (Software)
  - Benites Sandoval Luis Derek (Sistemas)
  - Bonifacio Espiritu Andrés (Sistemas)
  - Christian Quispe Rea (Sistemas)
  - Diaz Gutierrez Henry Kevin (Software)
  - Huamaní Gálvez Carlos (Sistemas)

#### 3. Sección "Cómo se hace la simulación"
- **Título**: "Cómo se hace la simulación"
- **Contenido**: 4 pasos en tarjetas con iconos
  1. **Ingresa los datos del cliente**: Registra información personal y financiera
  2. **Selecciona la propiedad**: Elige o registra la propiedad
  3. **Configura la simulación**: Define parámetros del crédito
  4. **Obtén resultados detallados**: Análisis completo con cronograma e indicadores
- **Badge adicional**: "Proceso automatizado" con icono de rayo

#### 4. Sección de Planes
- **Título**: "Nuestros Planes"
- **Planes disponibles** (4 tarjetas):
  1. **Básico** (Azul)
     - Precio: Gratis
     - Características: Hasta 10 clientes, 20 propiedades, simulaciones ilimitadas, soporte por email, reportes básicos
  2. **Profesional** (Verde) - Más Popular
     - Precio: S/ 79/mes
     - Características: Clientes ilimitados, propiedades ilimitadas, simulaciones avanzadas, soporte prioritario, reportes detallados, exportación, API access
  3. **Premium** (Púrpura)
     - Precio: S/ 149/mes
     - Características: Todo lo del Profesional + análisis predictivo, dashboard personalizado, soporte 24/7, integraciones avanzadas, backup automático, multi-usuario, capacitación incluida
  4. **Empresarial** (Naranja)
     - Precio: Personalizado
     - Características: Todo lo del Premium + usuarios ilimitados, soporte dedicado, personalización completa, integración con sistemas propios, capacitación en sitio, SLA garantizado, gerente de cuenta

#### 5. Footer
- **Estructura**: 4 columnas
  - Columna 1: Logo y descripción de HomeCredit
  - Columna 2: Enlaces de Producto (Dashboard, Clientes, Propiedades, Simulaciones, Planes Premium)
  - Columna 3: Enlaces de Soporte (Soporte Técnico, Documentación, Preguntas Frecuentes, Contacto)
  - Columna 4: Políticas (Imagen del libro de reclamaciones, Términos y Condiciones, Política de Privacidad, Política de Cookies)
- **Footer inferior**: Copyright y texto grande "HomeCredit"

### Funcionalidad
- **Botón principal**: Redirige a `AuthPage` mediante `onNavigateToAuth()`
- **No requiere autenticación**: Página pública accesible sin login

---

## Página de Autenticación

### Ubicación: `src/pages/AuthPage.tsx`

### Diseño
- **Layout**: Dos columnas en pantallas medianas/grandes
- **Fondo**: Gradiente de azul a verde
- **Botón "Volver"**: En la esquina superior izquierda (si `onBackToLanding` está disponible)

### Columna Izquierda (Desktop)
- Logo HomeCredit
- Título: "Gestión de Créditos Hipotecarios"
- Descripción del sistema
- Lista de características con puntos azules:
  - Simulación detallada de planes de pago
  - Cálculo de indicadores financieros (VAN, TIR, TEA, TCEA)
  - Gestión de clientes y propiedades
  - Cumplimiento normativo SBS y Fondo MiVivienda

### Columna Derecha
- **Formulario dinámico**: Alterna entre Login y Registro
- **Estado**: `showLogin` controla qué formulario se muestra

### Componentes

#### LoginForm (`src/components/auth/LoginForm.tsx`)
**Campos**:
- Email (obligatorio)
- Contraseña (obligatorio)

**Funcionalidad**:
- Valida campos vacíos
- Llama a `signIn()` del AuthContext
- Maneja errores y los traduce al español:
  - "user-not-found" / "wrong-password" → "Correo o contraseña incorrectos"
  - "invalid-email" → "Correo electrónico inválido"
  - "too-many-requests" → "Demasiados intentos fallidos"
  - "network" → "Error de conexión"
- Muestra spinner durante carga
- Enlace para cambiar a formulario de registro

**Base de Datos**:
- Consulta `auth.users` de Firebase mediante `supabase.auth.signInWithPassword()`
- Carga perfil desde `profiles` después de autenticación exitosa

#### RegisterForm (`src/components/auth/RegisterForm.tsx`)
**Campos**:
- Nombre completo (obligatorio)
- Correo electrónico (obligatorio)
- Contraseña (obligatorio, mínimo 6 caracteres)
- Confirmación de contraseña (obligatorio)

**Funcionalidad**:
- Validación en tiempo real de contraseña (mínimo 6 caracteres)
- Valida que las contraseñas coincidan
- Llama a `signUp()` del AuthContext
- Crea usuario en Firebase Auth
- Crea perfil en tabla `profiles` con rol 'advisor' por defecto
- Muestra errores específicos (email ya registrado, etc.)
- Enlace para cambiar a formulario de login

**Base de Datos**:
- Inserta en `auth.users` (Firebase)
- Inserta en `profiles` con `id` = `user_id`, `email`, `full_name`, `role`

---

## Dashboard

### Ubicación: `src/pages/DashboardPage.tsx`

### Descripción
Panel principal que muestra un resumen visual de toda la información del usuario.

### Sección Superior: Tarjetas de Estadísticas
4 tarjetas con métricas clave:

1. **Clientes** (Azul)
   - Icono: Users
   - Valor: Total de clientes del usuario
   - Consulta: `SELECT COUNT(*) FROM clients WHERE user_id = ?`

2. **Propiedades** (Verde)
   - Icono: Building2
   - Valor: Total de propiedades del usuario
   - Consulta: `SELECT COUNT(*) FROM property_units WHERE user_id = ?`

3. **Simulaciones** (Púrpura)
   - Icono: Calculator
   - Valor: Total de simulaciones del usuario
   - Consulta: `SELECT COUNT(*) FROM credit_simulations WHERE user_id = ?`

4. **Propiedades Disponibles** (Naranja)
   - Icono: TrendingUp
   - Valor: Propiedades con status 'available'
   - Consulta: `SELECT COUNT(*) FROM property_units WHERE user_id = ? AND status = 'available'`

### Sección Inferior: Información de HomeCredit
Tarjeta grande con fondo azul que incluye:

#### Header Azul
- Icono de Award
- Título: "Acerca de HomeCredit"
- Subtítulo: "Plataforma integral para gestión y simulación de créditos hipotecarios"

#### Contenido
1. **Descripción principal**: Explicación de qué es HomeCredit y su propósito
2. **Características principales** (Grid de 8 tarjetas):
   - Gestión completa (Clientes y propiedades) - Azul
   - Simulación detallada (Método francés) - Púrpura
   - Indicadores financieros (VAN, TIR, TEA, TCEA) - Verde
   - Bono de Techo Propio - Naranja
   - Periodos de gracia (Total y parcial) - Índigo
   - Múltiples monedas (Soles y Dólares) - Amarillo
   - Cumplimiento normativo (SBS y Fondo MiVivienda) - Rojo
   - Regulación legal (Ley N° 26702) - Teal

3. **Footer informativo**: Badge con información sobre conformidad legal

### Funcionalidad
- Carga estadísticas al montar el componente
- Muestra spinner durante carga
- Actualización automática cuando cambia el usuario

---

## Gestión de Clientes

### Página Principal: `src/pages/ClientsPage.tsx`

### Descripción
Interfaz para gestionar la cartera de clientes.

### Header
- Título: "Clientes"
- Subtítulo: "Gestiona tu cartera de clientes"
- Botón "Nuevo Cliente" (azul) con icono UserPlus

### Componente: ClientList (`src/components/clients/ClientList.tsx`)

#### Visualización
- **Layout**: Lista vertical de tarjetas
- **Cada tarjeta muestra**:
  - **Avatar/Imagen** (izquierda):
    - Si el cliente tiene distrito con imagen disponible → muestra imagen del distrito
    - Si no → avatar circular con color único asignado automáticamente
  - **Información principal**:
    - Nombre completo (negrita, grande)
    - Tipo y número de documento (DNI/CE/Passport)
  - **Grid de información** (4 columnas):
    - Email (icono Mail)
    - Teléfono (icono Phone)
    - Ingreso Mensual (icono DollarSign) - formato S/ X,XXX.XX
    - Estado Civil (icono User) - traducido (Soltero/Casado/Divorciado/Viudo)
  - **Información adicional**:
    - Dependientes: número
  - **Botones de acción** (esquina superior derecha):
    - Editar (icono Edit, azul al hover)
    - Eliminar (icono Trash2, rojo al hover)

#### Funcionalidad

**Carga de datos**:
- Consulta: `SELECT * FROM clients WHERE user_id = ? ORDER BY created_at DESC`
- Muestra spinner durante carga
- Mensaje si no hay clientes: "No hay clientes registrados"

**Eliminar cliente**:
- Confirmación antes de eliminar
- Elimina de tabla `clients`
- Recarga la lista automáticamente

**Editar cliente**:
- Abre `ClientForm` en modo edición
- Pre-llena formulario con datos del cliente

### Componente: ClientForm (`src/components/clients/ClientForm.tsx`)

#### Campos del Formulario
- Nombre completo (obligatorio)
- Tipo de documento: DNI / CE / Passport
- Número de documento (obligatorio)
- Email (obligatorio)
- Teléfono (obligatorio)
- Estado civil: Soltero / Casado / Divorciado / Viudo
- Dependientes: número (0+)
- Ingreso mensual: número (obligatorio)
- Distrito: select con opciones
- Provincia: texto
- Departamento: texto

#### Funcionalidad
- **Modo creación**: Inserta nuevo cliente en `clients`
- **Modo edición**: Actualiza cliente existente
- **Asignación de color**: Asigna automáticamente un color único basado en el número total de clientes
- **Validación**: Campos obligatorios marcados con *
- **Cierre**: Modal que se cierra al guardar exitosamente o cancelar

#### Base de Datos
**Tabla `clients`**:
- `id`: UUID
- `user_id`: ID del usuario autenticado
- `document_type`: 'DNI' | 'CE' | 'Passport'
- `document_number`: string
- `full_name`: string
- `email`: string
- `phone`: string
- `marital_status`: 'single' | 'married' | 'divorced' | 'widowed'
- `dependents`: number
- `monthly_income`: number
- `color`: number (índice 0-19 para asignación de colores)
- `district`, `province`, `department`: string (opcionales)
- `created_at`, `updated_at`: timestamps

---

## Gestión de Propiedades

### Página Principal: `src/pages/PropertiesPage.tsx`

### Descripción
Interfaz para gestionar el catálogo de propiedades inmobiliarias.

### Header
- Título: "Propiedades"
- Subtítulo: "Gestiona tu cartera inmobiliaria"
- Botón "Nueva Propiedad" (azul) con icono Home

### Componente: PropertyList (`src/components/properties/PropertyList.tsx`)

#### Visualización
- **Layout**: Grid responsivo (1-3 columnas según pantalla)
- **Cada tarjeta muestra**:
  - **Imagen superior**:
    - Imagen del distrito si está disponible
    - O icono por defecto si no hay imagen
  - **Información**:
    - Nombre del proyecto (negrita)
    - Número de unidad
    - Dirección completa
    - Área en m²
    - Precio con moneda (S/ o $)
    - Tipo de propiedad: Departamento / Casa / Dúplex
    - **Badge de estado**:
      - "Disponible" (verde) - status = 'available'
      - "Reservado" (amarillo) - status = 'reserved'
      - "Vendido" (gris) - status = 'sold'
      - "No disponible" (rojo) - si tiene simulaciones asociadas
  - **Botones de acción** (esquina superior derecha):
    - Editar (icono Edit)
    - Eliminar (icono Trash2)

#### Funcionalidad

**Carga de datos**:
- Consulta propiedades: `SELECT * FROM property_units WHERE user_id = ?`
- Consulta simulaciones: `SELECT property_id FROM credit_simulations WHERE user_id = ?`
- Determina qué propiedades están asignadas (tienen simulaciones)
- Muestra "No disponible" para propiedades asignadas

**Eliminar propiedad**:
- Si tiene simulaciones asociadas:
  1. Elimina `payment_schedules` relacionados
  2. Elimina `credit_simulations` relacionadas
  3. Elimina la propiedad
- Si no tiene simulaciones: elimina directamente
- Mantiene integridad referencial

**Editar propiedad**:
- Abre `PropertyForm` en modo edición
- Pre-llena formulario con datos de la propiedad

### Componente: PropertyForm (`src/components/properties/PropertyForm.tsx`)

#### Campos del Formulario
- Nombre de la propiedad (obligatorio)
- Número de unidad (obligatorio)
- Dirección (obligatorio)
- Distrito: select con opciones (Barranco, Jesús María, Miraflores, San Isidro, Surco, etc.)
- Provincia (obligatorio)
- Departamento (obligatorio)
- Tipo de propiedad: Departamento / Casa / Dúplex
- Área total (m²) (obligatorio)
- Precio (obligatorio)
- Moneda: Soles (PEN) / Dólares (USD)
- Estado: Disponible / Reservado / Vendido
- Imagen: upload opcional

#### Funcionalidad
- **Modo creación**: Inserta nueva propiedad en `property_units`
- **Modo edición**: Actualiza propiedad existente
- **Validación**: Campos obligatorios
- **Imágenes**: Soporte para imágenes de distritos predefinidas

#### Base de Datos
**Tabla `property_units`**:
- `id`: UUID
- `user_id`: ID del usuario autenticado
- `property_name`: string
- `unit_number`: string
- `address`: string
- `district`, `province`, `department`: string
- `property_type`: 'apartment' | 'house' | 'duplex'
- `total_area`: number (m²)
- `price`: number
- `currency`: 'PEN' | 'USD'
- `status`: 'available' | 'reserved' | 'sold'
- `created_at`, `updated_at`: timestamps

---

## Simulaciones de Crédito

### Página Principal: `src/pages/SimulationsPage.tsx`

### Descripción
Interfaz para crear, gestionar y visualizar simulaciones de crédito hipotecario.

### Header
- Título: "Simulaciones de Crédito"
- Subtítulo: "Gestiona y analiza tus simulaciones hipotecarias"
- Botón "Nueva Simulación" (azul) con icono Calculator

### Componente: SimulationList (`src/components/simulations/SimulationList.tsx`)

#### Visualización
- **Layout**: Lista vertical de tarjetas
- **Cada tarjeta muestra**:
  - Información del cliente vinculado
  - Información de la propiedad vinculada
  - Datos del crédito:
    - Monto del crédito
    - Tasa de interés anual
    - Plazo en años
    - Moneda
    - Cuota mensual calculada
  - Indicadores financieros (si están calculados):
    - VAN (Valor Actual Neto)
    - TIR (Tasa Interna de Retorno)
    - TEA (Tasa Efectiva Anual)
    - TCEA (Tasa de Costo Efectiva Anual)
  - **Botones de acción**:
    - Ver Detalles (abre modal con cronograma completo)
    - Editar (abre formulario de edición)
    - Eliminar

#### Funcionalidad

**Carga de datos**:
- Consulta: `SELECT * FROM credit_simulations WHERE user_id = ? ORDER BY created_at DESC`
- Carga datos relacionados de `clients` y `property_units`
- Muestra spinner durante carga

**Ver detalles**:
- Abre `SimulationDetail` en modal
- Muestra cronograma completo de pagos

**Editar simulación**:
- Carga datos de la simulación
- Abre `SimulationForm` en modo edición
- Permite modificar parámetros y recalcular

### Componente: SimulationForm (`src/components/simulations/SimulationForm.tsx`)

#### Campos del Formulario

**Selección básica**:
- Cliente: Select con lista de clientes disponibles
- Propiedad: Select con lista de propiedades disponibles (solo 'available')
  - Al seleccionar, muestra precio y calcula automáticamente

**Datos del crédito**:
- Pago inicial: número (se calcula automáticamente basado en precio de propiedad)
- Bono Techo Propio: número (opcional, default 0)
- Tipo de tasa: Nominal / Efectiva
- Tasa de interés anual: número (ej: 8.5 para 8.5%)
- Capitalización: Mensual / Bimestral / Trimestral / Semestral / Anual
- Plazo en años: número (15, 20, 25, 30, etc.)
- Periodo de gracia: Ninguno / Total / Parcial
- Meses de gracia: número (si aplica)
- Tasa de seguro: número (default 0.0005)

#### Funcionalidad

**Cálculos automáticos**:
- Al seleccionar propiedad, calcula:
  - `loan_amount = property_price - initial_payment - techo_propio_bonus`
- Al guardar, calcula:
  - Cronograma de pagos (método francés)
  - VAN, TIR, TEA, TCEA
  - Inserta en `credit_simulations`
  - Inserta registros en `payment_schedules` (uno por cada cuota)

**Validaciones**:
- Cliente y propiedad son obligatorios
- Monto del crédito debe ser > 0
- Tasa de interés debe ser > 0
- Plazo debe ser > 0

**Modo edición**:
- Pre-llena todos los campos
- Permite modificar y recalcular
- Actualiza registros existentes

### Componente: SimulationDetail (`src/components/simulations/SimulationDetail.tsx`)

#### Visualización
Modal grande que muestra:

**Header**:
- Información del cliente
- Información de la propiedad
- Resumen del crédito

**Cronograma de pagos**:
- Tabla con columnas:
  - Periodo (número de cuota)
  - Fecha de pago
  - Saldo inicial
  - Pago a capital
  - Pago de intereses
  - Pago de seguro
  - Cuota total
  - Saldo final
  - Indicador de periodo de gracia (si aplica)

**Indicadores financieros**:
- VAN: Valor Actual Neto
- TIR: Tasa Interna de Retorno (%)
- TEA: Tasa Efectiva Anual (%)
- TCEA: Tasa de Costo Efectiva Anual (%)

**Funcionalidad**:
- Carga datos de la simulación y cronograma desde BD
- Permite exportar (futuro)
- Botón para cerrar modal

#### Base de Datos

**Tabla `credit_simulations`**:
- `id`: UUID
- `user_id`: ID del usuario autenticado
- `client_id`: FK a `clients.id`
- `property_id`: FK a `property_units.id`
- `property_price`: number
- `initial_payment`: number
- `loan_amount`: number
- `techo_propio_bonus`: number
- `currency`: 'PEN' | 'USD'
- `interest_rate_type`: 'nominal' | 'effective'
- `annual_interest_rate`: number
- `capitalization`: 'monthly' | 'bimonthly' | 'quarterly' | 'semiannual' | 'annual'
- `loan_term_years`: number
- `grace_period_type`: 'none' | 'total' | 'partial'
- `grace_period_months`: number
- `insurance_rate`: number
- `van`, `tir`, `tea`, `tcea`: number (calculados)
- `created_at`, `updated_at`: timestamps

**Tabla `payment_schedules`**:
- `id`: UUID
- `simulation_id`: FK a `credit_simulations.id`
- `period_number`: number (1, 2, 3, ...)
- `payment_date`: date
- `beginning_balance`: number
- `principal_payment`: number
- `interest_payment`: number
- `insurance_payment`: number
- `total_payment`: number
- `ending_balance`: number
- `grace_period`: boolean
- `created_at`: timestamp

---

## Página de Soporte Técnico

### Ubicación: `src/pages/SupportPage.tsx`

### Descripción
Formulario para reportar problemas técnicos o solicitar ayuda.

### Header
- Título: "Soporte Técnico"
- Subtítulo: "Reporta un problema o solicita ayuda técnica"

### Formulario

#### Campos
1. **Asunto** (obligatorio)
   - Input de texto
   - Placeholder: "Describe brevemente el problema"

2. **Categoría** (obligatorio)
   - Select con opciones:
     - Error en el sistema
     - Funcionalidad faltante
     - Problema de rendimiento
     - Problema de interfaz
     - Problema con datos
     - Otro

3. **Prioridad**
   - Select con opciones:
     - Baja
     - Media (default)
     - Alta
     - Urgente

4. **Email de contacto**
   - Input email
   - Pre-llenado con email del perfil del usuario
   - Editable

5. **Descripción del problema** (obligatorio)
   - Textarea (6 filas)
   - Placeholder: "Describe detalladamente el problema..."

#### Funcionalidad
- Validación de campos obligatorios
- Muestra mensaje de error si faltan campos
- Al enviar:
  - Simula envío (1 segundo de delay)
  - Muestra mensaje de éxito verde
  - Limpia formulario
  - Oculta mensaje después de 5 segundos
- **Nota**: Actualmente simula el envío. En producción, debería guardar en tabla `support_tickets` o enviar email.

#### Estados Visuales
- **Error**: Banner rojo con icono AlertCircle
- **Éxito**: Banner verde con icono CheckCircle2 y mensaje de confirmación
- **Loading**: Botón muestra spinner durante envío

---

## Página de Reclamaciones

### Ubicación: `src/pages/ReclamacionesPage.tsx`

### Descripción
Formulario completo para presentar reclamaciones o quejas según normativa peruana (INDECOPI).

### Header
- Título: "Hoja de reclamaciones"
- Descripción: Información sobre plazo de respuesta (15 días hábiles) y enlace a ayuda en línea

### Formulario Completo

#### 1. Número Correlativo
- Campo de solo lectura
- Formato: `PE-X-YYYY` (año actual)
- Ejemplo: "PE-X-2024"

#### 2. Ingresa tus datos
- **Nombre completo** (obligatorio)
- **Documento de identidad** (obligatorio)
- **Dirección** (obligatorio)
- **Teléfono** (obligatorio)
- **Email** (obligatorio, pre-llenado con perfil)
- **Checkbox**: "Soy menor de edad"

#### 3. Identificación del Bien Contratado
- **Tipo**: Radio buttons
  - Producto
  - Servicio
- **Descripción**: Input de texto
- **Monto reclamado**: Input de texto (formato: S/ 0.00)

#### 4. Ingresa tu solicitud
- **Tipo de solicitud**: Radio buttons
  - Queja (default): "Descripción del problema"
  - Reclamo: "Disconformidad con el servicio"
- **Descripción del problema** (obligatorio)
  - Textarea (6 filas)
- **Solución esperada**: Input de texto

#### 5. Observaciones del proveedor
- Sección informativa (solo lectura)
- Texto sobre procesamiento y plazos legales
- Menciona INDECOPI y plazo de 15 días hábiles

#### 6. Fecha y hora
- **Fecha**: Input de texto (formato: dd/mm/yyyy)
  - Pre-llenado con fecha actual
- **Hora**: Input de texto (formato: hh:mm)
  - Pre-llenado con hora actual

#### Funcionalidad
- Validación completa de campos obligatorios
- Botones:
  - **Cancelar**: Limpia formulario y resetea errores
  - **Enviar**: Procesa el formulario (rojo)
- Al enviar:
  - Simula envío (1.5 segundos)
  - Muestra mensaje de éxito
  - Confirma registro y plazo de respuesta
- **Nota**: Actualmente simula el envío. En producción, debería guardar en tabla `complaints` o enviar a sistema externo.

#### Estados Visuales
- **Error**: Banner rojo con mensaje
- **Éxito**: Banner verde con confirmación y plazo de respuesta

---

## Página Premium

### Ubicación: `src/pages/PremiumPage.tsx`

### Descripción
Página para seleccionar y contratar planes premium de la aplicación.

### Header
- Badge verde: "Planes Premium"
- Título: "Elige el plan perfecto para ti"
- Subtítulo: Descripción de funcionalidades premium

### Grid de Planes
Muestra los mismos 4 planes que en Landing Page:
1. **Básico** (Azul) - Botón: "Plan Actual" (no hace nada)
2. **Profesional** (Verde) - Botón: "Seleccionar Plan" (abre modal de pago)
3. **Premium** (Púrpura) - Botón: "Seleccionar Plan" (abre modal de pago)
4. **Empresarial** (Naranja) - Botón: "Contactar Ventas" (abre formulario empresarial)

### Modal de Pago (Profesional y Premium)

#### Diseño
- Modal grande con dos columnas
- **Columna Izquierda** (fondo del color del plan):
  - Logo HomeCredit
  - Información del plan seleccionado
  - Precio destacado
- **Columna Derecha** (formulario blanco):
  - Formulario de datos de tarjeta

#### Campos del Formulario de Pago
1. **Número de Tarjeta**
   - Input con formato automático (espacios cada 4 dígitos)
   - Detección automática de tipo de tarjeta:
     - Visa (empieza con 4)
     - Mastercard (empieza con 5 o 2)
     - Amex (empieza con 3)
     - Discover (empieza con 6)
   - Muestra icono de la tarjeta detectada

2. **Nombre en la Tarjeta**
   - Input de texto
   - Placeholder: "Juan Pérez"

3. **Fecha de Vencimiento**
   - Input con formato MM/AA automático
   - Máximo 5 caracteres

4. **CVV**
   - Input numérico
   - Máximo 4 caracteres
   - Placeholder: "123"

5. **Email para la Factura**
   - Input email
   - Placeholder: "tu@email.com"

#### Funcionalidad
- Validación de campos
- Al confirmar pago:
  - Muestra animación de éxito (fondo verde)
  - Icono CheckCircle2 grande animado
  - Mensaje: "¡Pago Confirmado!"
  - Cierra modal después de 2 segundos
- **Nota**: Actualmente simula el pago. En producción, debería integrar pasarela de pago (Stripe, PayPal, etc.)

### Modal de Formulario Empresarial

#### Diseño
- Modal centrado
- Header naranja con icono Building2
- Título: "Plan Empresarial"

#### Campos
1. **Nombre de tu empresa** (obligatorio)
   - Input de texto
   - Placeholder: "Ej: Mi Empresa S.A.C."

2. **Correo de contacto** (obligatorio)
   - Input email
   - Placeholder: "contacto@empresa.com"

3. **Tamaño de tu empresa** (obligatorio)
   - Select con opciones:
     - 1-10 empleados
     - 11-50 empleados
     - 51-200 empleados
     - 201-500 empleados
     - Más de 500 empleados

#### Funcionalidad
- Validación de campos
- Al enviar:
  - Muestra animación de éxito
  - Mensaje: "¡Datos Enviados! Sales se contactará contigo"
  - Cierra modal después de 2 segundos
- **Nota**: En producción, debería guardar en tabla `enterprise_requests` o enviar email a ventas

---

## Página de Documentación

### Ubicación: `src/pages/DocumentacionPage.tsx`

### Descripción
Guía completa de uso de la aplicación con secciones expandibles (acordeón).

### Header
- Título: "Documentación"
- Subtítulo: "Guía completa de uso de HomeCredit para usuarios"

### Secciones (Acordeón)

#### 1. Introducción a HomeCredit (expandida por defecto)
**Contenido**:
- ¿Qué es HomeCredit? (banner azul informativo)
- Características principales (lista con checkmarks verdes):
  - Gestión de Clientes
  - Catálogo de Propiedades
  - Simulaciones de Crédito
  - Dashboard Intuitivo
- Primeros pasos (lista numerada)

#### 2. Dashboard - Panel Principal
**Contenido**:
- Descripción del Dashboard
- Tarjetas de Estadísticas (explicación de cada una)
- Gráficos y Análisis
- Tip (banner amarillo): Actualización en tiempo real

#### 3. Gestión de Clientes
**Contenido**:
- Descripción de la sección
- Cómo agregar un nuevo cliente (pasos numerados)
- Cómo buscar clientes
- Cómo editar o eliminar clientes (con iconos)
- Colores de identificación
- Mejor práctica (banner verde)

#### 4. Administración de Propiedades
**Contenido**:
- Descripción de la sección
- Cómo agregar una nueva propiedad (pasos numerados)
- Visualización de propiedades
- Cómo editar o eliminar propiedades
- Uso en simulaciones
- Consejo (banner azul): Agregar imágenes

#### 5. Simulaciones de Crédito
**Contenido**:
- Descripción de simulaciones
- Cómo crear una nueva simulación (pasos numerados)
- Resultados de la simulación (lista con checkmarks)
- Ver detalles de una simulación
- Editar o eliminar simulaciones
- Comparar simulaciones
- Tip profesional (banner púrpura): Crear múltiples simulaciones

#### 6. Preguntas Frecuentes
**Contenido**:
- ¿Puedo eliminar un cliente que ya tiene simulaciones?
- ¿Cómo cambio la moneda de una simulación?
- ¿Puedo exportar mis datos?
- ¿Los datos están seguros?
- Banner de ayuda adicional (índigo)

### Funcionalidad
- Cada sección es expandible/colapsable
- Icono ChevronDown cuando está expandida
- Icono ChevronRight cuando está colapsada
- Animación suave al expandir/colapsar
- Sección "inicio" expandida por defecto

---

## Página de Capacitación

### Ubicación: `src/pages/CapacitacionPage.tsx`

### Descripción
Recursos y materiales de capacitación interactivos con tutoriales modales.

### Header
- Título: "Capacitación de Usuarios"
- Subtítulo: "Recursos y materiales de capacitación"

### Grid de Tarjetas de Capacitación
6 tarjetas con diferentes temas:

1. **Dashboard** (Azul)
   - Icono: Home
   - Descripción: "Aprende a usar el panel principal"

2. **Clientes** (Verde)
   - Icono: Users
   - Descripción: "Gestión de clientes y contactos"

3. **Propiedades** (Púrpura)
   - Icono: Building2
   - Descripción: "Administración de propiedades"

4. **Simulaciones** (Naranja)
   - Icono: Calculator
   - Descripción: "Cómo crear simulaciones de crédito"

5. **Soporte** (Índigo)
   - Icono: HelpCircle
   - Descripción: "Obtén ayuda y soporte técnico"

6. **Documentación** (Teal)
   - Icono: BookOpen
   - Descripción: "Guías y documentación completa"

### Modales de Tutorial

#### Diseño
- Modal grande con fondo del color del tema
- Header con icono y título del tutorial
- Botón de cerrar (X) en esquina superior derecha
- Contenido: Lista numerada de pasos
- Footer: Botones "Cerrar" y "Ir a [Sección]" (navega a la página correspondiente)

#### Contenido de Cada Tutorial

**Dashboard**:
1. El Dashboard es tu panel principal...
2. En la parte superior verás tarjetas...
3. Puedes ver gráficos y análisis...
4. Usa el menú lateral para navegar...
5. El Dashboard se actualiza automáticamente...

**Clientes**:
1. En la sección de Clientes puedes agregar...
2. Para agregar un nuevo cliente...
3. Puedes buscar clientes...
4. Cada cliente tiene un color único...
5. Puedes editar o eliminar...
6. Los clientes están vinculados...

**Propiedades**:
1. La sección de Propiedades te permite...
2. Para agregar una nueva propiedad...
3. Puedes especificar el distrito...
4. Cada propiedad puede tener una imagen...
5. Puedes editar o eliminar...
6. Las propiedades se utilizan...

**Simulaciones**:
1. Las Simulaciones te permiten calcular...
2. Para crear una simulación...
3. Ingresa los datos del crédito...
4. El sistema calculará automáticamente...
5. Puedes ver los detalles completos...
6. Las simulaciones se guardan...

**Soporte**:
1. La sección de Soporte Técnico...
2. Completa el formulario...
3. Selecciona la categoría...
4. Indica la prioridad...
5. Proporciona una descripción detallada...
6. Nuestro equipo se pondrá en contacto...

**Documentación**:
1. La sección de Documentación contiene...
2. Aquí encontrarás información detallada...
3. Puedes buscar documentos...
4. Los documentos están organizados...
5. Cada documento incluye ejemplos...
6. Si no encuentras lo que buscas...

#### Funcionalidad
- Al hacer clic en una tarjeta, abre modal con tutorial
- Botón "Ir a [Sección]" navega a la página correspondiente usando `onNavigate()`
- Animaciones suaves al abrir/cerrar
- Cierre al hacer clic fuera del modal

---

## Componentes de Layout

### Sidebar (`src/components/layout/Sidebar.tsx`)

#### Descripción
Menú lateral fijo que permanece visible en todas las páginas autenticadas.

#### Estructura

**Header**:
- Logo HomeCredit con icono de casa azul
- Texto "HomeCredit" y "MiVivienda"

**Navegación Principal**:
- Lista de botones de navegación:
  1. Dashboard (icono Home)
  2. Clientes (icono Users)
  3. Propiedades (icono Building2)
  4. Simulaciones (icono Calculator)
- Botón activo: fondo azul, texto blanco
- Botones inactivos: texto gris, hover gris claro

**Footer del Sidebar**:
- Botón "Premium" (verde, gradiente)
- Tarjeta de perfil del usuario:
  - Nombre completo
  - Email
- Botón "Documentación" (icono BookOpen)
- Botón "Capacitación" (icono GraduationCap)
- Botón "Cerrar Sesión" (rojo, icono LogOut)

#### Funcionalidad
- Resalta la página actual
- Navegación mediante `onNavigate(page)`
- Muestra información del perfil del usuario
- Botón de cerrar sesión llama a `signOut()`

### Footer (`src/components/layout/Footer.tsx`)

#### Descripción
Pie de página fijo con enlaces adicionales y logo.

#### Estructura
- **Lado Izquierdo**:
  - Logo HomeCredit pequeño
  - Texto "HomeCredit" y "MiVivienda"
- **Lado Derecho**:
  - Imagen del libro de reclamaciones (clickeable, navega a reclamaciones)
  - Botón "Soporte" (icono HelpCircle, navega a support)
  - Copyright: "© YYYY HomeCredit. Todos los derechos reservados."
  - Texto pequeño: "Sistema de gestión de créditos hipotecarios"

#### Funcionalidad
- Navegación mediante `onNavigate(page)`
- Imagen del libro navega a página de reclamaciones
- Botón de soporte navega a página de soporte técnico

---

## Base de Datos y Estructura

### Tablas Principales

#### 1. `profiles`
Perfiles de usuario autenticados.

**Campos**:
- `id` (PK, UUID, FK a `auth.users.id`)
- `email` (string)
- `full_name` (string)
- `role` ('admin' | 'advisor' | 'client')
- `company_name` (string, opcional)
- `phone` (string, opcional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### 2. `clients`
Clientes registrados por cada usuario.

**Campos**:
- `id` (PK, UUID)
- `user_id` (FK a `profiles.id`)
- `document_type` ('DNI' | 'CE' | 'Passport')
- `document_number` (string)
- `full_name` (string)
- `email` (string)
- `phone` (string)
- `marital_status` ('single' | 'married' | 'divorced' | 'widowed')
- `dependents` (number)
- `monthly_income` (number)
- `color` (number, índice 0-19)
- `district`, `province`, `department` (string, opcionales)
- `created_at`, `updated_at` (timestamps)

**Relaciones**:
- Muchos clientes pertenecen a un usuario (`user_id`)
- Un cliente puede tener muchas simulaciones

#### 3. `property_units`
Propiedades inmobiliarias registradas.

**Campos**:
- `id` (PK, UUID)
- `user_id` (FK a `profiles.id`)
- `property_name` (string)
- `unit_number` (string)
- `address` (string)
- `district`, `province`, `department` (string)
- `property_type` ('apartment' | 'house' | 'duplex')
- `total_area` (number, m²)
- `price` (number)
- `currency` ('PEN' | 'USD')
- `status` ('available' | 'reserved' | 'sold')
- `created_at`, `updated_at` (timestamps)

**Relaciones**:
- Muchas propiedades pertenecen a un usuario (`user_id`)
- Una propiedad puede tener muchas simulaciones

#### 4. `credit_simulations`
Simulaciones de crédito hipotecario.

**Campos**:
- `id` (PK, UUID)
- `user_id` (FK a `profiles.id`)
- `client_id` (FK a `clients.id`)
- `property_id` (FK a `property_units.id`)
- `property_price` (number)
- `initial_payment` (number)
- `loan_amount` (number)
- `techo_propio_bonus` (number)
- `currency` ('PEN' | 'USD')
- `interest_rate_type` ('nominal' | 'effective')
- `annual_interest_rate` (number)
- `capitalization` ('monthly' | 'bimonthly' | 'quarterly' | 'semiannual' | 'annual')
- `loan_term_years` (number)
- `grace_period_type` ('none' | 'total' | 'partial')
- `grace_period_months` (number)
- `insurance_rate` (number)
- `van`, `tir`, `tea`, `tcea` (number, calculados)
- `created_at`, `updated_at` (timestamps)

**Relaciones**:
- Muchas simulaciones pertenecen a un usuario (`user_id`)
- Una simulación pertenece a un cliente (`client_id`)
- Una simulación pertenece a una propiedad (`property_id`)
- Una simulación tiene muchos `payment_schedules`

#### 5. `payment_schedules`
Cronograma de pagos de cada simulación.

**Campos**:
- `id` (PK, UUID)
- `simulation_id` (FK a `credit_simulations.id`)
- `period_number` (number, 1, 2, 3, ...)
- `payment_date` (date)
- `beginning_balance` (number)
- `principal_payment` (number)
- `interest_payment` (number)
- `insurance_payment` (number)
- `total_payment` (number)
- `ending_balance` (number)
- `grace_period` (boolean)
- `created_at` (timestamp)

**Relaciones**:
- Muchos cronogramas pertenecen a una simulación (`simulation_id`)

### Integridad Referencial

**Eliminación en cascada**:
- Al eliminar una simulación → se eliminan todos sus `payment_schedules`
- Al eliminar una propiedad con simulaciones → se eliminan primero `payment_schedules`, luego `credit_simulations`, luego la propiedad

**Filtrado por usuario**:
- Todas las consultas filtran por `user_id` para garantizar aislamiento de datos entre usuarios

### Utilidades

#### `clientColors.ts`
- Asigna colores únicos a clientes
- 20 colores predefinidos (índices 0-19)
- Función `getClientColor(clientId, colorIndex)` retorna esquema de colores

#### `districtImages.ts`
- Mapea distritos a imágenes predefinidas
- Imágenes en `src/assets/distritos/`
- Distritos soportados: Barranco, Jesús María, Miraflores, San Isidro, Surco

#### `creditCalculations.ts`
- Funciones de cálculo financiero:
  - `calculateCreditSchedule()`: Calcula cronograma de pagos (método francés)
  - Cálculo de VAN, TIR, TEA, TCEA
  - Manejo de periodos de gracia (total y parcial)
  - Conversión entre tasas nominales y efectivas

---

## Flujo de Usuario Completo

### Usuario Nuevo (No Autenticado)

1. **Llega a Landing Page**
   - Ve información de la empresa
   - Ve el equipo
   - Ve el proceso de simulación
   - Ve los planes disponibles
   - Hace clic en "Ingresar a HomeCredit"

2. **Llega a Auth Page**
   - Ve formulario de Login
   - Si no tiene cuenta, hace clic en "Regístrate"
   - Completa formulario de registro:
     - Nombre completo
     - Email
     - Contraseña (mínimo 6 caracteres)
     - Confirmación de contraseña
   - Se crea cuenta en Firebase Auth
   - Se crea perfil en `profiles`
   - Accede automáticamente al Dashboard

### Usuario Autenticado

1. **Dashboard**
   - Ve estadísticas: clientes, propiedades, simulaciones, disponibles
   - Ve información sobre HomeCredit
   - Navega a otras secciones desde Sidebar

2. **Gestión de Clientes**
   - Ve lista de clientes (vacía inicialmente)
   - Hace clic en "Nuevo Cliente"
   - Completa formulario con datos del cliente
   - Guarda cliente → se crea en BD
   - Puede editar o eliminar clientes existentes

3. **Gestión de Propiedades**
   - Ve lista de propiedades (vacía inicialmente)
   - Hace clic en "Nueva Propiedad"
   - Completa formulario con datos de la propiedad
   - Guarda propiedad → se crea en BD
   - Puede editar o eliminar propiedades existentes

4. **Simulaciones de Crédito**
   - Ve lista de simulaciones (vacía inicialmente)
   - Hace clic en "Nueva Simulación"
   - Selecciona cliente (debe existir)
   - Selecciona propiedad (debe existir y estar disponible)
   - Completa datos del crédito:
     - Pago inicial
     - Bono Techo Propio
     - Tasa de interés
     - Plazo
     - Periodo de gracia (opcional)
   - Guarda simulación → se calcula cronograma y se guarda en BD
   - Puede ver detalles completos del cronograma
   - Puede editar o eliminar simulaciones

5. **Otras Funcionalidades**
   - **Soporte**: Reporta problemas técnicos
   - **Reclamaciones**: Presenta reclamaciones formales
   - **Premium**: Explora y contrata planes premium
   - **Documentación**: Consulta guías de uso
   - **Capacitación**: Accede a tutoriales interactivos

### Cierre de Sesión

- Usuario hace clic en "Cerrar Sesión" en Sidebar
- Se ejecuta `signOut()` del AuthContext
- Se limpia sesión de Firebase
- Usuario es redirigido a Landing Page

---

## Consideraciones Técnicas

### Autenticación
- Utiliza Firebase Authentication a través de un cliente personalizado (`FirebaseSupabase`)
- Sesiones persisten entre recargas de página
- Timeout de seguridad: si la inicialización tarda más de 3 segundos, muestra Landing Page

### Rendimiento
- Carga paralela de datos cuando es posible (Promise.all)
- Spinners durante cargas
- Validación en tiempo real en formularios

### Seguridad
- Todas las consultas filtran por `user_id`
- No se puede acceder a datos de otros usuarios
- Contraseñas hasheadas por Firebase
- Validación de campos en frontend y backend (cuando corresponda)

### Escalabilidad
- Estructura modular de componentes
- Separación de lógica de negocio (utils)
- Context API para estado global
- TypeScript para type safety

---

## Notas Finales

Este guion cubre toda la funcionalidad de la aplicación HomeCredit. La aplicación está diseñada para ser una herramienta completa de gestión de créditos hipotecarios del Fondo MiVivienda, con énfasis en:

1. **Usabilidad**: Interfaz intuitiva y fácil de usar
2. **Funcionalidad**: Cálculos precisos y gestión completa
3. **Cumplimiento**: Conformidad con normativas SBS y Fondo MiVivienda
4. **Profesionalismo**: Diseño moderno y funcionalidades avanzadas

Cualquier funcionalidad adicional o modificación debe seguir los patrones establecidos en este guion.

