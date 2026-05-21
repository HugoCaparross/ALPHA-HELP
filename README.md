# ALPHA-HELP 🚀

ALPHA-HELP es una plataforma web profesional, robusta y escalable diseñada para la gestión, intervención y acompañamiento de participantes y administradores. Este repositorio contiene la arquitectura inicial, limpia y lista para producción estructurada con un stack de alto rendimiento y máxima seguridad.

## 🛠️ Stack Tecnológico

- **Core**: Vanilla JavaScript (ES Modules).
- **Bundler**: [Vite](https://vitejs.dev/) para empaquetado ultra rápido y óptimo.
- **Base de Datos y Autenticación**: [Supabase](https://supabase.com/) (PostgreSQL + RLS + Auth + Storage).
- **Estilos**: CSS Puro Modular y Responsive (con variables CSS e Interceptores CSS).
- **Despliegue**: Optimizado y listo para **Vercel** (`vercel.json` con cabeceras estrictas de seguridad).

---

## 🔒 Arquitectura de Seguridad Obligatoria

El proyecto está diseñado bajo el principio de "Seguridad por Diseño":
1. **Autenticación Estricta**: Verificación de email obligatoria activada.
2. **Políticas de Complejidad de Contraseña**:
   - Mínimo de 12 caracteres.
   - Requiere letras mayúsculas, minúsculas, números y símbolos especiales.
3. **Control de Acceso basado en Roles (RBAC)**:
   - `admin`: Acceso completo a paneles de analíticas, usuarios, sesiones e intervenciones.
   - `participant`: Acceso protegido a paneles personales de progreso y cuestionarios.
4. **Protección Integrada**:
   - Cabeceras de seguridad estrictas (Content Security Policy, HSTS, X-Frame-Options).
   - Estructura preparada para sanitización de datos (XSS), tokens CSRF y Rate Limiting.

---

## 📂 Estructura del Proyecto

El proyecto sigue una estructura limpia, escalable y modular:
- `public/`: Assets estáticos y optimización SEO (favicon, robots, sitemap, manifest).
- `src/`: Código fuente de la aplicación.
  - `auth/`: Controladores y lógica de inicio de sesión, registro, recuperación y fuerza de contraseñas.
  - `components/`: Componentes modulares reutilizables (layout, UI, formularios, administración).
  - `styles/`: Estilos CSS puros modulares categorizados por módulos y vistas.
  - `services/`: Integración con Supabase, Youtube Live y servicios de seguridad.
  - `modules/`: Módulos de lógica específica (dashboard, sesiones, cuestionarios).
  - `utils/`: Validadores, formateadores y utilidades auxiliares.
- `supabase/`: Migraciones y scripts SQL del backend.
  - `schema/`: Definición de tablas relacionales.
  - `policies/`: Políticas Row Level Security (RLS).
  - `functions/` & `triggers/`: Lógica del lado de la base de datos (PostgreSQL).
- `security/`: Configuraciones de conformidad legal (RGPD, cookies) y políticas de cabecera.

---

## 🚀 Inicio Rápido

### Requisitos Previos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).

### Instalación

1. Clona el repositorio y entra en el directorio del proyecto:
   ```bash
   cd ALPHA-HELP
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Duplica el archivo `.env.example` como `.env` y rellena tus credenciales reales de Supabase:
   ```bash
   cp .env.example .env
   ```

### Desarrollo

Para iniciar el servidor de desarrollo local:
```bash
npm run dev
```

### Construcción para Producción

Para compilar y optimizar la aplicación para producción:
```bash
npm run build
```

---

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
