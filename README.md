# 🏥 **Sistema de Gestión Veterinaria - Frontend**

[![Angular](https://img.shields.io/badge/Angular-19.2.14-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.8-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Sistema integral de gestión para clínicas veterinarias** - Una aplicación web moderna y responsive desarrollada con Angular 19, diseñada para optimizar la administración de pacientes, citas y servicios veterinarios.

## 📋 **Tabla de Contenidos**

- [🎯 **Descripción del Proyecto**](#-descripción-del-proyecto)
- [✨ **Características Principales**](#-características-principales)
- [🏗️ **Arquitectura del Sistema**](#️-arquitectura-del-sistema)
- [👥 **Roles de Usuario**](#-roles-de-usuario)
- [🚀 **Tecnologías Utilizadas**](#-tecnologías-utilizadas)
- [📁 **Estructura del Proyecto**](#-estructura-del-proyecto)
- [⚡ **Instalación y Configuración**](#-instalación-y-configuración)
- [🔧 **Scripts Disponibles**](#-scripts-disponibles)
- [🌐 **Configuración del Proxy**](#-configuración-del-proxy)
- [📱 **Funcionalidades por Módulo**](#-funcionalidades-por-módulo)
- [🔐 **Sistema de Autenticación**](#-sistema-de-autenticación)
- [🎨 **Interfaz de Usuario**](#-interfaz-de-usuario)
- [📊 **Componentes Principales**](#-componentes-principales)
- [🔄 **Servicios y APIs**](#-servicios-y-apis)
- [🧪 **Testing**](#-testing)
- [📦 **Build y Despliegue**](#-build-y-despliegue)
- [🤝 **Contribución**](#-contribución)
- [📄 **Licencia**](#-licencia)

## 🎯 **Descripción del Proyecto**

**Sistema de Gestión Veterinaria** es una aplicación web completa diseñada para modernizar y digitalizar la gestión de clínicas veterinarias. La aplicación facilita la administración de pacientes, programación de citas, gestión de historiales médicos y administración del personal, todo desde una interfaz intuitiva y responsive.

### **Objetivos del Proyecto:**
- 🐾 **Digitalización completa** de procesos veterinarios
- 📅 **Gestión eficiente** de citas y horarios
- 👨‍⚕️ **Coordinación del equipo** médico y administrativo
- 📊 **Seguimiento detallado** de pacientes y tratamientos
- 🔒 **Seguridad y control de acceso** por roles de usuario

## ✨ **Características Principales**

| Módulo | Funcionalidad | Descripción |
|--------|---------------|-------------|
| 🏠 **Dashboard Principal** | Panel de control | Vista general de estadísticas y actividades |
| 👥 **Gestión de Usuarios** | Administración de personal | Control de roles, permisos y perfiles |
| 🐕 **Gestión de Pacientes** | Base de datos de mascotas | Historiales médicos, tratamientos y seguimiento |
| 📅 **Sistema de Citas** | Programación inteligente | Agendamiento, recordatorios y gestión de horarios |
| 🏥 **Enfermería** | Triage y atención | Evaluación inicial y seguimiento de pacientes |
| 💊 **Recetas y Tratamientos** | Gestión médica | Prescripciones, medicamentos y seguimiento |
| 📊 **Reportes y Analytics** | Análisis de datos | Estadísticas, métricas y reportes operativos |
| 🔧 **Mantenimiento** | Configuración del sistema | Ajustes, respaldos y configuración general |

## 🏗️ **Arquitectura del Sistema**

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Angular 19)                   │
├─────────────────────────────────────────────────────────────┤
│  📱 Componentes UI    │  🔐 Guards      │  📡 Servicios   │
│  🎨 Pipes            │  🛡️ Interceptors │  📊 Models      │
│  🚀 Layouts          │  🔒 Auth         │  🌐 HTTP Client │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (API REST)                       │
│  🗄️ Base de Datos    │  🔑 Autenticación │  📋 Lógica de  │
│  📊 Consultas        │  🔐 Autorización  │    Negocio     │
└─────────────────────────────────────────────────────────────┘
```

## 👥 **Roles de Usuario**

### **🔐 Administrador (ADMIN)**
- **Acceso completo** al sistema
- **Gestión de usuarios** y roles
- **Configuración del sistema**
- **Reportes y analytics**
- **Supervisión general**

### **👨‍⚕️ Veterinario (VET)**
- **Dashboard veterinario** personalizado
- **Gestión de pacientes** y mascotas
- **Historiales clínicos** completos
- **Sistema de recetas**
- **Seguimiento de tratamientos**

### **👩‍⚕️ Asistente/Enfermera (ASISTENTE)**
- **Sistema de triage**
- **Gestión de citas** y horarios
- **Atención de pacientes**
- **Recordatorios** y notificaciones
- **Soporte administrativo**

## 🚀 **Tecnologías Utilizadas**

### **Frontend Core**
- **Angular 19.2.14** - Framework principal
- **TypeScript 5.7.2** - Lenguaje de programación
- **RxJS 7.8.0** - Programación reactiva

### **UI/UX Framework**
- **Tailwind CSS 4.1.8** - Framework de CSS utility-first
- **Angular Material 19.2.18** - Componentes Material Design
- **PrimeNG 19.1.3** - Biblioteca de componentes premium

### **Herramientas de Desarrollo**
- **Angular CLI 19.2.9** - Herramientas de línea de comandos
- **PostCSS 8.5.4** - Procesador de CSS
- **Autoprefixer 10.4.21** - Autoprefijos CSS automáticos

### **Utilidades**
- **date-fns 4.1.0** - Manipulación de fechas
- **ngx-pagination 6.0.3** - Paginación de datos

## 📁 **Estructura del Proyecto**

```
src/
├── app/
│   ├── components/           # Componentes reutilizables
│   │   ├── admin/           # Componentes específicos de administración
│   │   ├── enfermeria/      # Componentes de enfermería
│   │   ├── listapacientes/  # Gestión de pacientes
│   │   ├── shared/          # Componentes compartidos
│   │   └── vete/            # Componentes veterinarios
│   ├── core/                # Servicios y lógica de negocio
│   │   ├── guard/           # Guards de autenticación
│   │   ├── models/          # Interfaces y modelos
│   │   └── services/        # Servicios HTTP y lógica
│   ├── layouts/             # Layouts de aplicación
│   │   ├── admin-layout/    # Layout para administradores
│   │   ├── asistente-layout/# Layout para asistentes
│   │   └── veterinario-layout/ # Layout para veterinarios
│   └── pages/               # Páginas principales
│       ├── admin-dashboard/ # Dashboard administrativo
│       ├── enfermera/       # Página de enfermería
│       ├── listapacientes/  # Lista de pacientes
│       └── veterinario/     # Dashboard veterinario
├── assets/                   # Recursos estáticos
└── styles.css               # Estilos globales
```

## ⚡ **Instalación y Configuración**

### **Prerrequisitos**
- **Node.js** 18.0.0 o superior
- **npm** 9.0.0 o superior
- **Angular CLI** 19.2.9

### **Instalación**

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd Front-Veterinaria

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (si es necesario)
# Crear archivo .env con las configuraciones del backend

# 4. Iniciar servidor de desarrollo
npm start
```

### **Configuración del Entorno**

```bash
# Verificar versión de Node.js
node --version

# Verificar versión de npm
npm --version

# Verificar versión de Angular CLI
ng version

# Instalar Angular CLI globalmente (si no está instalado)
npm install -g @angular/cli@19.2.9
```

## 🔧 **Scripts Disponibles**

```json
{
  "start": "ng serve",                    // Servidor de desarrollo
  "build": "ng build",                    // Build de producción
  "watch": "ng build --watch",            // Build con watch mode
  "test": "ng test",                      // Ejecutar tests unitarios
  "e2e": "ng e2e"                        // Tests end-to-end
}
```

### **Comandos Útiles**

```bash
# Servidor de desarrollo con proxy
npm start

# Build de producción
npm run build

# Build de desarrollo con watch
npm run watch

# Ejecutar tests
npm test

# Generar nuevo componente
ng generate component nombre-componente

# Generar nuevo servicio
ng generate service nombre-servicio
```

## 🌐 **Configuración del Proxy**

El proyecto incluye configuración de proxy para desarrollo local:

```json
// proxy.conf.json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

**Para usar el proxy:**
```bash
ng serve --proxy-config proxy.conf.json
```

## 📱 **Funcionalidades por Módulo**

### **🏠 Dashboard Principal**
- **Vista general** de estadísticas
- **Acceso rápido** a funciones principales
- **Notificaciones** y alertas del sistema
- **Resumen** de actividades recientes

### **👥 Gestión de Usuarios**
- **Crear/Editar/Eliminar** usuarios
- **Asignar roles** y permisos
- **Gestionar perfiles** de usuario
- **Control de acceso** granular

### **🐕 Gestión de Pacientes**
- **Registro** de mascotas y clientes
- **Historiales médicos** completos
- **Seguimiento** de tratamientos
- **Subvistas** especializadas (última cita, triaje, etc.)

### **📅 Sistema de Citas**
- **Agendamiento** inteligente
- **Gestión de horarios** disponibles
- **Recordatorios** automáticos
- **Estado de citas** en tiempo real

### **🏥 Enfermería**
- **Sistema de triage** inicial
- **Evaluación** de signos vitales
- **Gestión** de pacientes en espera
- **Coordinación** con veterinarios

## 🔐 **Sistema de Autenticación**

### **Características de Seguridad**
- **JWT Tokens** para autenticación
- **Guards de ruta** por roles
- **Interceptores HTTP** para tokens
- **Sesiones seguras** y timeout automático

### **Flujo de Autenticación**
```
1. Login → 2. Validación → 3. Generación JWT → 4. Redirección por Rol
```

## 🎨 **Interfaz de Usuario**

### **Diseño Responsive**
- **Mobile-first** approach
- **Breakpoints** optimizados
- **Componentes adaptativos**
- **Navegación intuitiva**

### **Tema y Estilos**
- **Paleta de colores** profesional
- **Tipografía** legible y accesible
- **Iconografía** consistente
- **Espaciado** y layout optimizados

## 📊 **Componentes Principales**

### **Componentes Compartidos**
- **Navbar** - Navegación principal
- **Sidebar** - Menú lateral contextual
- **Footer** - Información del sistema
- **Chat Bot** - Asistente virtual

### **Componentes Especializados**
- **Tabla de Citas** - Gestión de citas
- **Selector de Clientes** - Búsqueda inteligente
- **Modal de Detalles** - Información expandida
- **Formularios** - Entrada de datos validada

## 🔄 **Servicios y APIs**

### **Servicios Principales**
- **AuthService** - Autenticación y autorización
- **CitaService** - Gestión de citas
- **MascotaService** - Gestión de mascotas
- **ClienteService** - Gestión de clientes
- **VeterinarioService** - Gestión del equipo médico

### **Integración con Backend**
- **HTTP Client** para comunicación REST
- **Interceptores** para manejo de tokens
- **Manejo de errores** robusto
- **Cache** y optimización de requests

## 🧪 **Testing**

### **Estructura de Tests**
```
src/
├── app/
│   └── components/
│       └── component-name/
│           ├── component.spec.ts    # Tests unitarios
│           └── component.e2e-spec.ts # Tests end-to-end
```

### **Ejecutar Tests**
```bash
# Tests unitarios
npm test

# Tests con coverage
ng test --code-coverage

# Tests end-to-end
npm run e2e

# Tests específicos
ng test --include="**/component-name.component.spec.ts"
```

## 📦 **Build y Despliegue**

### **Build de Desarrollo**
```bash
ng build --configuration development
```

### **Build de Producción**
```bash
ng build --configuration production
```

### **Optimizaciones de Producción**
- **Tree shaking** automático
- **Minificación** de código
- **Compresión** de assets
- **Lazy loading** de módulos

### **Despliegue**
```bash
# Build para producción
npm run build

# Los archivos se generan en dist/
# Subir contenido de dist/ al servidor web
```

## 🤝 **Contribución**

### **Cómo Contribuir**
1. **Fork** del repositorio
2. **Crear** rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crear** Pull Request

### **Estándares de Código**
- **TypeScript** estricto
- **ESLint** para linting
- **Prettier** para formateo
- **Conventional Commits** para mensajes

### **Reportar Issues**
- Usar **templates** de issue
- Incluir **pasos de reproducción**
- Adjuntar **logs** y **screenshots**
- Especificar **versión** y **entorno**

## 📄 **Licencia**

Este proyecto está bajo la **Licencia MIT**. Ver el archivo `LICENSE` para más detalles.

---

## 🚀 **Próximas Funcionalidades**

- 📱 **Aplicación móvil** nativa
- 🤖 **Chatbot avanzado** con IA
- 📊 **Dashboard analítico** en tiempo real
- 🔔 **Sistema de notificaciones** push
- 📈 **Reportes avanzados** y exportación
- 🌐 **API pública** para integraciones

---

## 📞 **Contacto y Soporte**

- **Desarrollador:** [Isaac Ivanov Takamura Rojas]
- **Email:** [isaactakamura1503@hotmail.com]
- **Proyecto:** [https://github.com/IsaacTakamura/Front-Veterinaria.git]

---

<div align="center">

**⭐ ¡No olvides dar una estrella al proyecto si te ha sido útil! ⭐**

*Desarrollado con ❤️ para aprobar Integrador II*

</div>
