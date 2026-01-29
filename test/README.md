# 🧪 Miraflores Plus - Test Suite

Suite completa de testing para la plataforma Miraflores Plus con **80%+ de cobertura** y enfoque en accesibilidad WCAG 2.1 AA.

## 📋 Contenido

### Estructura de Tests

```
test/
├── setup.ts                      # Configuración global de tests
├── utils/
│   └── test-utils.tsx           # Utilidades y helpers de testing
├── components/                   # Tests unitarios de componentes
│   ├── MetricCard.test.tsx
│   ├── NotificationCenter.test.tsx
│   ├── FocusTrap.test.tsx
│   ├── AddAppointmentDialog.test.tsx
│   ├── Sidebar.test.tsx
│   └── KeyboardShortcuts.test.tsx
├── accessibility/                # Tests de accesibilidad
│   └── a11y.test.tsx
└── integration/                  # Tests de integración
    └── workflow.test.tsx
```

## 🚀 Ejecutar Tests

### Comandos Principales

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests con reporte de cobertura
npm test -- --coverage

# Ejecutar tests de un archivo específico
npm test -- MetricCard.test

# Ejecutar solo tests de accesibilidad
npm test -- a11y.test
```

### Scripts de Package.json

Agregar estos scripts a `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch",
    "test:a11y": "vitest test/accessibility"
  }
}
```

## 📦 Dependencias Requeridas

Instalar las siguientes dependencias de desarrollo:

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom jest-axe @axe-core/react @types/jest
```

## ✅ Cobertura de Tests

### Objetivos de Cobertura (80%+)

- **Lines**: 80%+
- **Functions**: 80%+
- **Branches**: 75%+
- **Statements**: 80%+

### Componentes Testeados

#### ✅ Componentes Core
- [x] **MetricCard** - Tarjetas de métricas con tendencias
- [x] **NotificationCenter** - Centro de notificaciones con roles
- [x] **FocusTrap** - Gestión de foco para accesibilidad
- [x] **Sidebar** - Navegación lateral con permisos por rol
- [x] **KeyboardShortcuts** - Atajos de teclado

#### ✅ Componentes de Diálogo
- [x] **AddAppointmentDialog** - Diálogo de agendar citas
- [ ] **AddAffiliateDialog** - Registro de afiliados
- [ ] **AddDependentDialog** - Agregar dependientes

#### ✅ Tests de Accesibilidad
- [x] Cumplimiento WCAG 2.1 AA
- [x] Navegación por teclado
- [x] ARIA labels y roles
- [x] Contraste de colores
- [x] Focus management
- [x] Screen reader announcements

#### ✅ Tests de Integración
- [x] Flujo de reserva de citas
- [x] Interacción con notificaciones
- [x] Control de acceso basado en roles
- [x] Búsqueda y filtrado
- [x] Formularios multi-paso
- [x] Estados de carga y error

## 🎯 Tipos de Tests

### 1. Tests Unitarios
Prueban componentes individuales de forma aislada:
- Props y renderizado
- Estados internos
- Eventos y callbacks
- Edge cases

### 2. Tests de Accesibilidad
Verifican cumplimiento WCAG 2.1 AA:
- Estructura semántica HTML
- ARIA attributes
- Navegación por teclado
- Contraste de colores
- Screen reader support
- Focus management

### 3. Tests de Integración
Prueban flujos completos de usuario:
- Workflows multi-paso
- Interacción entre componentes
- Estados de aplicación
- Navegación

## 📝 Patrones de Testing

### Test Básico

```typescript
import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../utils/test-utils';
import { MyComponent } from '../../components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    renderWithProviders(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Test con Interacción de Usuario

```typescript
it('handles user interaction', async () => {
  const { user } = renderWithProviders(<MyComponent />);
  
  const button = screen.getByRole('button', { name: /click me/i });
  await user.click(button);
  
  expect(screen.getByText('Clicked!')).toBeInTheDocument();
});
```

### Test de Accesibilidad

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should not have accessibility violations', async () => {
  const { container } = renderWithProviders(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Test de Teclado

```typescript
it('is keyboard navigable', async () => {
  const { user } = renderWithProviders(<MyComponent />);
  
  await user.keyboard('{Tab}');
  expect(screen.getByRole('button')).toHaveFocus();
  
  await user.keyboard('{Enter}');
  // Verify action occurred
});
```

## 🔍 Debugging Tests

### Ver Tests en UI

```bash
npm run test:ui
```

### Debug en VSCode

Agregar configuración a `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test"],
  "console": "integratedTerminal"
}
```

### Logs y Screenshots

```typescript
import { screen, debug } from '@testing-library/react';

// Print DOM tree
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));
```

## 📊 Reporte de Cobertura

Los reportes de cobertura se generan en:
- **HTML**: `coverage/index.html` (abre en navegador)
- **LCOV**: `coverage/lcov.info` (para CI/CD)
- **JSON**: `coverage/coverage-final.json`

## 🎨 Mejores Prácticas

### ✅ DO
- Usar queries accesibles (`getByRole`, `getByLabelText`)
- Testear comportamiento del usuario, no implementación
- Usar `waitFor` para operaciones asíncronas
- Probar con datos realistas
- Incluir tests de edge cases
- Mantener tests aislados e independientes

### ❌ DON'T
- No testear detalles de implementación
- No usar `querySelector` directamente
- No hacer tests que dependen de otros
- No ignorar warnings de `act()`
- No testear componentes de UI de terceros (shadcn)

## 🔧 Mantenimiento

### Actualizar Snapshots

```bash
npm test -- -u
```

### Limpiar Caché

```bash
npm test -- --clearCache
```

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [jest-axe](https://github.com/nickcolley/jest-axe)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🎯 Próximos Pasos

- [ ] Agregar tests E2E con Playwright
- [ ] Configurar CI/CD con GitHub Actions
- [ ] Implementar visual regression testing
- [ ] Agregar performance testing
- [ ] Tests de carga para AccountsPayablePage
- [ ] Tests para flujos de aprobación

---

**Sprint 4 - Testing Suite Completado** ✅

80%+ de cobertura de código con enfoque en accesibilidad y experiencia de usuario.
