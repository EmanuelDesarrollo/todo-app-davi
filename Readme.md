# Dashboard de Tareas Colaborativas 🚀

Aplicación de gestión de tareas desarrollada como solución a la **KATA Desarrollador Agile Mobile**. Demuestra competencias senior en React Native a través de una arquitectura **MVVM con enfoque Offline-First**, integración de base de datos local con Realm, un módulo nativo multiplataforma (`AvatarView`) construido con Expo Modules API en Kotlin y Swift, y pruebas unitarias sobre la lógica de negocio.

---

## 🛠 Stack Tecnológico

| Categoría | Tecnología |
|---|---|
| Framework | Expo (React Native) |
| Lenguaje | TypeScript (tipado estricto) |
| Manejo de Estado | Zustand |
| Base de Datos Local | Realm (`@realm/react`) |
| Navegación | React Navigation (Stack) |
| Peticiones HTTP | Axios |
| API Externa | [DummyJSON Todos](https://dummyjson.com/todos) |
| Tests | Jest + babel-jest |

---

## 🏗 Arquitectura

El proyecto sigue un patrón **MVVM** con separación por capas y un enfoque **Offline-First**:

```
src/
├── api/              # Capa de datos remotos (Axios)
├── storage/          # Schema de Realm
├── store/            # Estado global de UI (Zustand)
├── navigation/       # Stack de navegación
├── components/       # Componentes reutilizables
└── features/
    └── tasks/
        ├── model/        # Interfaces y tipos de dominio
        ├── data/         # Repositorio (lógica de acceso a Realm + sync)
        ├── viewModel/    # Hooks de presentación (useTaskViewModel, useTaskDetailViewModel)
        └── view/         # Pantallas (TaskDashboard, TaskDetail)
```

### Offline-First

* **Sincronización inicial:** Al abrir la app sin datos locales, se consume la API y se persiste todo en Realm (`syncTasksFromApi`).
* **Single Source of Truth:** La UI lee exclusivamente desde Realm, nunca directamente desde la API.
* **Resiliencia:** El toggle de completado/pendiente escribe en Realm de forma inmediata y funciona sin conexión.
* **Pull-to-Refresh:** Permite re-sincronizar contra la API en cualquier momento.
* **Manejo de errores de red:** Si la petición falla por conexión, se muestra un `Alert` con opción de reintentar.

> **Elección de Realm:** Se eligió Realm por su modelo reactivo (`useQuery`, `useObject`) que elimina la necesidad de sincronizar manualmente el estado local con la UI, y por su alto rendimiento en consultas sobre colecciones grandes.

---

## 📱 Módulo Nativo — AvatarView

El componente nativo `AvatarView` fue desarrollado como un paquete independiente e integrado en esta aplicación como dependencia local.

🔗 **Repositorio del módulo:** [github.com/EmanuelDesarrollo/module-app-todo-davi](https://github.com/EmanuelDesarrollo/module-app-todo-davi)

### ¿Qué hace?

Renderiza un avatar circular que muestra las **iniciales del nombre del usuario** sobre un **color de fondo determinista** generado a partir del hash de su nombre. El color es idéntico en Android e iOS gracias a una implementación compartida del algoritmo `hashCode()` de Java.

**Ejemplo:** `"Santiago Lopez"` → iniciales `"SL"` con un color HSV único para ese nombre.

### Implementación

| Plataforma | Tecnología | Archivos clave |
|---|---|---|
| Android | Kotlin + Expo Modules API | `AvatarView.kt`, `AvatarModule.kt` |
| iOS | Swift + Expo Modules API | `AvatarView.swift`, `AvatarModule.swift` |

* **`AvatarView`** extiende `ExpoView` en ambas plataformas.
* Recibe la prop `name: string` desde React Native.
* Extrae hasta dos iniciales (ej. `"DG"` para `"David García"`).
* Genera el color del círculo con `HSV(hue = abs(hash(name)) % 360, saturation = 0.6, brightness = 0.75)`.

### Uso en la app

```tsx
import { AvatarView } from 'module-app-todo-davi';

<AvatarView name="Santiago Lopez" style={{ width: 60, height: 60 }} />
```

---

## 🤖 Uso de IA

**Herramienta utilizada:** GitHub Copilot (modelo Claude Sonnet dentro de VS Code).

### Qué se utilizó IA para hacer

| Tarea | Descripción |
|---|---|
| **Implementación de Realm** | Apoyo en la configuración de `TaskSchema`, el uso de `useQuery` con filtros dinámicos y la integración de `RealmProvider` en el árbol de componentes. |
| **Diseño de interfaces** | Definición de los tipos e interfaces TypeScript del dominio (`Task`, `FilterType`, `TaskUIState`, `TaskStackParamList`) y los contratos entre capas del patrón MVVM. |
| **Configuración de Jest** | Instalación y configuración del stack de pruebas (`jest`, `babel-jest`, `babel-preset-expo`) para un entorno `node` sin conflictos con módulos nativos de React Native. |
| **Pruebas unitarias** | Generación de los tres suites de tests: `taskStore.test.ts`, `todosApi.test.ts` y `TaskRepository.test.ts`, incluyendo mocks de Realm y Axios. |
| **Mocks de Realm** | Implementación de `__mocks__/realm.js` y `__mocks__/@realm/react.js` para simular operaciones de base de datos en memoria sin binarios nativos. |
| **Documentación** | Redacción y estructuración de este README en base al código real del proyecto. |

### Supervisión y criterio humano

La **arquitectura Offline-First**, la elección de Realm, la estructura MVVM por features, el flujo de sincronización (`syncTasksFromApi` → `toggleTaskCompletion`) y la lógica del módulo nativo fueron **diseñados, implementados y validados manualmente**. El uso de IA se limitó a acelerar tareas de configuración y boilerplate, no a decisiones de diseño.

---

## 🚀 Instalación y Ejecución

### Requisitos previos

* Node.js ≥ 18
* Xcode (para iOS) / Android Studio (para Android)
* CocoaPods (para iOS)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <repo_url>
cd todo-app-davi

# 2. Instalar dependencias de JS
npm install

# 3. Instalar pods de iOS
cd ios && pod install && cd ..

# 4. Correr la app
npx expo run:android
npx expo run:ios
```

---

## 🧪 Pruebas Unitarias

Las pruebas cubren exclusivamente **lógica de negocio**, sin dependencias de UI ni módulos nativos.

| Suite | Archivo | Tests | Qué cubre |
|---|---|---|---|
| Store | `taskStore.test.ts` | 8 | Estado inicial, `setFilter`, `setIsSyncing` |
| API | `todosApi.test.ts` | 6 | Endpoint correcto, timeout, respuesta exitosa, manejo de errores |
| Repositorio | `TaskRepository.test.ts` | 9 | `syncTasksFromApi` (persistencia, asignación de userName, fallos de red), `toggleTaskCompletion` (toggle, tarea inexistente) |

```bash
# Ejecutar todos los tests
npm test

# Modo watch
npm run test:watch

# Con reporte de cobertura
npm run test:coverage
```