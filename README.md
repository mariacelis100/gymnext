# GymNext 🏋️‍♂️

A modern, feature-rich gym management system built with Next.js and Material UI. GymNext helps gyms streamline their operations while providing an engaging experience for members and trainers.

## 🌟 Features

### For Members
- Easy QR code check-in system
- Daily exercise tracking with Instagram-style feed
- Streak tracking and achievements
- Customizable avatar selection
- Bilingual support (English/Spanish)
- Dark/Light mode themes

### For Trainers
- Real-time attendance tracking
- Exercise assignment system
- Client progress monitoring
- Customizable workout plans

### For Administrators
- Comprehensive member management
- Payment tracking and billing history
- News and announcements system
- Member status management
- QR code generation for check-ins

## 🚀 Getting Started

### Prerequisites
- Node.js (version specified in .nvmrc)
- npm or yarn
- Supabase account

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/gymnext.git
cd gymnext
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials and other required variables.

4. Run the development server:
```bash
npm run dev
```

## 🎨 Theme Configuration

### Light Theme
- Background: Deep Navy Blue (#0A1A3F)
- Text: White (#FFFFFF)
- Accent: Bright Cyan Blue (#00B7FF)

### Dark Theme
- Background: Rich Black (#0A0C10)
- Text: Light Silver (#E8E9EA)
- Accent: Dark Steel Blue (#2A3544)

## 🏗️ Project Structure

```
src/
├── features/          # Feature-based modules
│   ├── auth/         # Authentication
│   ├── profile/      # User profiles
│   ├── workouts/     # Workout management
│   └── billing/      # Payment handling
├── core/             # Shared utilities
└── public/           # Static assets
    ├── avatars/      # User avatars
    └── exercises/    # Exercise videos
```

## 🔑 User Roles

1. **Super Admin**
   - Complete system access
   - System configuration

2. **Admin**
   - Member management
   - Payment processing
   - News management

3. **Trainer**
   - Client management
   - Workout assignments
   - Attendance tracking

4. **Client**
   - Workout tracking
   - Check-in system
   - Profile management

## 🧪 Testing

```bash
npm run test
```

We focus on unit testing for:
- Utility functions
- Server actions
- Business logic

## 🌐 Internationalization

The app supports both English and Spanish languages. To add translations:

1. Add new strings to `/locales/{lang}/common.json`
2. Use the translation hook in components

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices, providing a seamless experience across all screen sizes.

## 🤝 Contributing

### Branch Naming Convention 🌿

We follow a strict branch naming convention to maintain consistency and clarity:

```
username/type/task_name
```

- All branches must be created from `develop`
- Use only lowercase English letters and underscores
- Components:
  - `username`: Your developer name (e.g., hernando)
  - `type`: Either `feature` or `fix`
  - `task_name`: Brief description using underscores

Examples:
```bash
hernando/feature/create_login_form
john/fix/password_validation
maria/feature/add_exercise_tracker
```

### Contributing Steps
1. Fork the repository
2. Create your feature branch following the naming convention
3. Follow our coding standards
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Material UI for the component library
- TanStack Query for data management
- Supabase for backend services

## Solución a problemas de autenticación

Si encuentras errores del tipo:
```
Error en la función create_user_with_phone: {}
Código de error: "42883"
Mensaje de error: "function auth.sign(json, text) does not exist"
```

Necesitas ejecutar los siguientes scripts SQL en tu base de datos Supabase en este orden:

1. Primero, ejecuta `sql/fix_missing_auth_sign.sql` para implementar la función `auth.sign` faltante.
2. Luego, ejecuta `sql/fix_jwt_settings.sql` para configurar las variables JWT necesarias.
3. Alternativamente, puedes ejecutar `sql/fix_registration_without_auth_sign.sql` si prefieres modificar las funciones para que no dependan de `auth.sign`.

Para ejecutar los scripts:
1. Abre el editor SQL en tu proyecto de Supabase
2. Copia y pega el contenido del archivo SQL
3. Ejecuta el script
4. Repite para cada script en el orden mencionado

## Desarrollo

```bash
npm run dev
# o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

## Autenticación

El sistema utiliza autenticación basada en número de teléfono y cédula, sin necesidad de correo electrónico.

## Estructura de roles

- **Cliente**: Usuario básico que puede ver sus ejercicios y asistencia
- **Entrenador**: Puede gestionar clientes y asignar ejercicios
- **Administrador**: Control completo del sistema
- **Super Administrador**: Acceso total a todas las funciones
