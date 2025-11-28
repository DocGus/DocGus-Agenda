# Contribuir

Gracias por querer contribuir a DocGus-Agenda. Este documento resume el flujo de trabajo, convenciones y pasos mínimos para que tus cambios sean revisables y fáciles de integrar.

## Flujo de trabajo (rápido)

- Crea una rama desde `main` para cada cambio pequeño o feature:
  - `feature/<nombre>` para nuevas funcionalidades.
  - `fix/<descripcion>` para correcciones.
  - `chore/<descripcion>` para tareas de mantenimiento.
- Mantén los PRs pequeños y enfocados: un PR == una idea clara.
- Añade tests cuando sea posible (backend: `pytest`, frontend: `vitest`).

## Convenciones de commits

Usa mensajes de commit claros en español o inglés, por ejemplo:

```
feat: añadir login con JWT
fix: corregir validación de email en register
docs: actualizar README con quickstart
```

## Antes de abrir un Pull Request

1. Asegúrate de que tu rama esté actualizada con `main`:

```bash
git fetch origin
git rebase origin/main
```

2. Ejecuta tests locales:

```bash
# Backend
pytest

# Frontend
npm ci && npm test
```

3. Añade una descripción clara en el PR: qué cambia, por qué, y cómo probarlo.

## Revisiones y aceptación

- Asigna revisores (al menos 1) y espera aprobación antes de mergear.
- Si el PR requiere cambios, responde a los comentarios y actualiza la rama.
- Prefiere squash merge para mantener `main` legible.

## Cómo ejecutar el proyecto localmente

Revisa `README.md` — contiene un `First run` con los pasos mínimos para arrancar backend y frontend.

## Issues y etiquetado

- Crea un issue antes de un cambio grande para discutir la implementación.
- Usa etiquetas claras: `bug`, `enhancement`, `docs`, `help wanted`.

## Código y estilo

- Mantén el estilo de código existente.
- Para JS/React, respeta las reglas de ESLint y formatea con las herramientas del proyecto.

## Gracias

Gracias por tu contribución. Si necesitas ayuda para configurar tu entorno, abre un issue y te ayudamos.
