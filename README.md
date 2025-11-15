# HomeCredit - MiVivienda Credit Simulation Platform

Plataforma de gestión y simulación de créditos hipotecarios para el Fondo MiVivienda en Perú.

## Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configuración de Firebase

La aplicación está configurada para usar Firebase (Firestore y Firebase Auth). Las credenciales de Firebase ya están configuradas en `src/lib/firebase.ts`.

**Nota:** Asegúrate de que tu proyecto de Firebase tenga habilitado:
- **Firebase Authentication** con proveedor de Email/Password
- **Cloud Firestore** con las siguientes colecciones:
  - `profiles`
  - `clients`
  - `property_units`
  - `credit_simulations`
  - `payment_schedules`

### 3. Ejecutar la aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Estructura del Proyecto

- `src/components/` - Componentes React reutilizables
- `src/pages/` - Páginas principales de la aplicación
- `src/contexts/` - Contextos de React (Auth, etc.)
- `src/lib/` - Utilidades y configuraciones (Firebase)
  - `firebase.ts` - Configuración de Firebase
  - `firebaseService.ts` - Servicio que simula la API de Supabase usando Firebase
  - `supabase.ts` - Exporta el cliente Firebase con interfaz compatible
- `supabase/migrations/` - Migraciones de base de datos (referencia histórica)

## Tecnologías

- React + TypeScript
- Vite
- Firebase (Firestore y Firebase Auth)
- Tailwind CSS

## Configuración de Firestore

Las reglas de seguridad recomendadas para Firestore son:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios solo pueden leer/escribir sus propios datos
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /clients/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /property_units/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /credit_simulations/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /payment_schedules/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
