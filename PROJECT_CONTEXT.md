# SocialApp — Project Context

## Overview
A Vue.js Social Network web application built as a university graduation project.
The frontend communicates with a RESTful API backend (Spring Boot/Java) via JWT-authenticated Axios calls.

## Tech Stack
- **Core:** Vue 3 (Composition API, `<script setup>`), Vite
- **Styling:** Tailwind CSS v4
- **Routing:** Vue Router v4
- **State:** Pinia v3
- **HTTP:** Axios with JWT interceptors
- **Utilities:** VueUse, dayjs

## Folder Structure
```
src/
├── assets/              # Static assets (images, fonts)
├── components/
│   ├── common/          # Reusable UI primitives (BaseButton, BaseInput, BaseModal, etc.)
│   ├── layout/          # App shell components (AppNavbar, AppSidebar)
│   ├── auth/            # Auth-specific components
│   ├── connections/     # Friend/follow/block components
│   ├── posts/           # Post card, post form, feed components
│   └── interactions/    # Reactions, comments components
├── composables/         # Shared composition functions (useAuth, useApi, etc.)
├── pages/
│   ├── auth/            # LoginPage, RegisterPage, ForgotPasswordPage
│   ├── connections/     # FriendsPage, SuggestionsPage, BlockedUsersPage
│   ├── posts/           # NewsfeedPage, UserPostsPage, TaggedPostsPage
│   └── profile/         # ProfilePage, SessionManagementPage
├── router/              # Vue Router config and route guards
├── services/            # API service modules (authService, postService, etc.)
├── stores/              # Pinia stores (authStore, postStore, etc.)
└── utils/               # Pure utility functions (date formatting, validators)
```

## Routing Map
| Route                     | Page Component           | Auth Required |
|---------------------------|--------------------------|---------------|
| `/login`                  | LoginPage                | No            |
| `/register`               | RegisterPage             | No            |
| `/forgot-password`        | ForgotPasswordPage       | No            |
| `/`                       | NewsfeedPage             | Yes           |
| `/profile/:userId`        | ProfilePage              | Yes           |
| `/profile/sessions`       | SessionManagementPage    | Yes           |
| `/friends`                | FriendsPage              | Yes           |
| `/friends/suggestions`    | SuggestionsPage          | Yes           |
| `/friends/blocked`        | BlockedUsersPage         | Yes           |
| `/posts/tagged`           | TaggedPostsPage          | Yes           |

## State Management Strategy
- **authStore:** Current user data, JWT tokens, login/logout/register actions
- **postStore:** Feed posts, user posts, CRUD operations, pagination
- **connectionStore:** Friends list, friend requests, follow state, block list
- **interactionStore:** Reactions and comments per post (keyed by postId)

## Feature Checklist
- [x] Project scaffolding & dependencies
- [x] Foundational architecture (Router, Pinia, Axios, Services)
- [x] Shared UI components
- [x] Authentication (Login, Register, Forgot Password, Sessions, Profile)
- [x] Connections (Friends, Follow, Block, Suggestions)
- [x] Content (Newsfeed, Post CRUD, Visibility, Tagging)
- [x] Interactions (Reactions, Comments, Nested Comments, Comment Likes)

## API Base URL
Configured via environment variable `VITE_API_BASE_URL` (defaults to `http://localhost:8080/api`).
