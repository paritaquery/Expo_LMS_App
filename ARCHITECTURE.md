# App Architecture

## Layers

### Presentation layer
- `app/`
- `src/components/`
- feature UI inside `src/features/*/components`

This layer renders screens, layouts, feedback states, and reusable UI building blocks.

### Feature modules
- `src/features/auth`
- `src/features/courses`
- `src/features/profile`

Each feature owns its components, hooks, API bindings, and feature-specific types.

### Service/API layer
- `src/services/api`

This layer contains API configuration, request clients, error normalization, and network-facing utilities.

### Persistent storage layer
- `src/services/storage`

This layer will isolate SecureStore and AsyncStorage access so screens and hooks do not talk to device storage directly.

### Global state layer
- `src/store`
- `src/providers`

This layer manages app bootstrap state, shared providers, query caching, and long-lived client state.

## Rules
- Screens in `app/` should stay thin and compose feature modules.
- Features can depend on shared services, storage, hooks, types, and components.
- Services should not import from screens.
- Storage concerns should stay behind wrappers, not be used directly in UI files.
- Cross-feature app wiring belongs in `src/providers` and `src/store`.
