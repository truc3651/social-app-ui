# Coding Conventions

## General Principles
1. **Self-documenting code.** Variable names, function names, and component names must describe their purpose. Comments are a last resort for truly non-obvious logic.
2. **Single responsibility.** Each function does one thing. Each component renders one concern.
3. **Early returns.** Guard clauses at the top of functions to reduce nesting.
4. **No magic values.** Constants are named and placed in relevant files or a shared `utils/constants.js`.

## Vue Components
- Always use `<script setup>` with Composition API.
- File naming: `PascalCase.vue` (e.g., `PostCard.vue`, `BaseButton.vue`).
- Props use `defineProps` with object syntax for validation.
- Emits use `defineEmits` with explicit event names.
- Template ordering: `<script setup>` → `<template>` → (no `<style>` — Tailwind handles styling).

## API Layer Pattern
- **Components never call Axios directly.** All HTTP calls go through service modules in `src/services/`.
- Each service module groups endpoints by domain (e.g., `authService.js` handles `/auth/*`).
- Services return the Axios promise — stores or composables handle the response.
- The Axios instance in `src/services/api.js` attaches the JWT token via request interceptor and handles 401 responses globally via response interceptor.

## State Management (Pinia)
- Stores are defined with `defineStore` using the setup syntax (Composition API style).
- Store names follow `use<Domain>Store` pattern (e.g., `useAuthStore`).
- Stores handle API calls via service imports and manage loading/error states.
- Components read from stores reactively; they do not duplicate store logic.

## Naming Conventions
| Item              | Convention          | Example                    |
|-------------------|---------------------|----------------------------|
| Components        | PascalCase          | `FriendRequestCard.vue`    |
| Composables       | camelCase, `use` prefix | `useAuth.js`           |
| Services          | camelCase           | `authService.js`           |
| Stores            | camelCase, `use` prefix | `useAuthStore.js`      |
| Utilities         | camelCase           | `formatDate.js`            |
| Route names       | kebab-case          | `friend-suggestions`       |
| CSS classes       | Tailwind utilities only | —                       |

## File Organization
- Shared/reusable components live in `components/common/`.
- Feature-specific components live in `components/<feature>/`.
- Pages (routed views) live in `pages/<feature>/`.
- One component per file. No barrel exports unless clearly beneficial.

## Error Handling
- API errors are caught in stores and exposed as reactive `error` refs.
- Components display errors from the store — they do not catch API errors directly.
- The Axios response interceptor handles 401 (redirect to login) globally.

## Formatting
- 2-space indentation.
- Single quotes for strings.
- No semicolons (rely on ASI, standard Vue/Vite convention).
- Template attributes on separate lines when a tag has 3+ attributes.
