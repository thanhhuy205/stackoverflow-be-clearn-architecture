---
name: code-base-architecture
description: backend architecture and prisma usage guidelines focusing on clean module structure, repository pattern, reusable selects, strict typing, and minimal/lean service usage. use when designing backend modules, structuring prisma queries, organizing select objects, or enforcing clean code practices.
---

# Prisma Architecture & Clean Code Guidelines

Apply these rules to keep a Prisma-based backend clean as it scales. Prefer pragmatic layering (controller → service → repository) with strict typing, reusable Prisma selects, and minimal service complexity.

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
| --- | --- | --- | --- |
| 1 | Architecture | CRITICAL | `arch-` |
| 2 | Repository | HIGH | `repository-` |
| 3 | Select Structure | HIGH | `select-` |
| 4 | Service Usage | HIGH | `service-` |
| 5 | Utilities | MEDIUM | `utils-` |
| 6 | Type Safety | CRITICAL | `type-` |

## Core Architecture

### arch-1: prefer feature modules for medium/large codebases

Use a feature-first layout once the project has multiple domains.

modules/
└─ user/
   ├─ controller/
   │  └─ user.controller.ts
   ├─ service/
   │  ├─ user.service.ts
   │  └─ index.ts
   ├─ repository/
   │  ├─ repository.ts
   │  ├─ selects/
   │  │  ├─ user.select.ts
   │  │  └─ index.ts
   │  ├─ dto/
   │  │  ├─ create-user.dto.ts
   │  │  └─ update-user.dto.ts
   │  ├─ mapper/
   │  │  └─ user.mapper.ts
   │  ├─ types/
   │  │  └─ user.types.ts
   │  └─ index.ts
   └─ index.ts

If you are not ready to move to `modules/` yet, keep `controllers/`, `services/`, `repositories/` at root, but still group per domain as folders.

### arch-2: strict flow and responsibilities

Controller → Service → Repository

- controller: HTTP concerns only (parse input, validate, map errors, send response)
- service: business rules + orchestration (transactions, cross-entity workflows)
- repository: Prisma queries only (no business rules)

### arch-3: export a stable public API per folder

Every folder that is imported by other layers must have an `index.ts` that exports the public surface.

- do not import deep paths like `.../user/repository/dto/create-user.dto`
- do import `.../user/repository` (via its `index.ts`)

## Repository Pattern (Prisma)

### repository-1: repository can be a folder, not a single file

Prefer the structure below when the repository needs DTOs, mappers, and multiple selects.

repositories/
└─ user/
   ├─ repository.ts
   ├─ dto/
   │  ├─ create-user.dto.ts
   │  └─ update-user.dto.ts
   ├─ mapper/
   │  └─ user.mapper.ts
   ├─ types/
   │  └─ user.types.ts
   └─ index.ts

### repository-2: repository files only do data access

Allowed inside repository:
- prisma calls (`findUnique`, `findMany`, `create`, `update`, `delete`, `$transaction` when it is purely data-layer)
- reusable `select/include` objects
- mapping DB records → domain/output types

Not allowed inside repository:
- permissions/authorization rules
- business validations (except low-level constraints like "not found")
- composing multiple repositories (belongs in service)

### repository-3: name methods by intent, not prisma verbs

Prefer:
- `findById`, `findByEmail`, `list`, `create`, `updateProfile`, `setStatus`

Avoid:
- `findUniqueUser`, `updateUserByWhere` (leaks Prisma thinking)

## Reusable Prisma Selects

### select-1: centralize selects per entity

Put selects near the repository and export them.

modules/user/repository/selects/
- `user.select.ts` (base + variants)
- `index.ts`

### select-2: define a base select and extend it

Pattern:
- `baseUserSelect`
- `userSelectPublic`
- `userSelectAdmin`

Use `Prisma.validator<Prisma.UserSelect>()({...})` to lock the shape.

### select-3: never duplicate select objects across repositories

If two repositories need the same select, move it to:
- the entity's `selects/` folder, or
- `shared/prisma-selects/` only if it is truly cross-domain

## Service Usage (Pragmatic)

### service-1: keep 1 service per domain; do not create 20+ services unnecessarily

Typical mapping:
- `UserService` handles user-related business workflows
- `OrderService` handles order workflows
- `AuthService` handles auth workflows

A service may contain 20+ operations. That is normal.

### service-2: start with a single service file; split only when it becomes painful

Thresholds (choose one):
- > 10–15 public methods, or
- > ~300 lines, or
- repeated patterns across methods

When splitting, do NOT jump to heavy clean-arch. Use `actions/` (thin use-case files).

modules/user/service/
├─ user.service.ts      (facade + dependency wiring)
├─ actions/
│  ├─ create.ts
│  ├─ update.ts
│  ├─ get.ts
│  ├─ list.ts
│  └─ index.ts
└─ index.ts

Rules:
- `user.service.ts` should be a thin facade that delegates to `actions/*`.
- `actions/*` may call multiple repositories and contain business rules.
- `actions/*` must not call Prisma directly.

### service-3: transactions live in service/actions, not in controllers

If multiple repositories must be consistent, wrap the workflow in a service/action using `$transaction`.

## Utilities

### utils-1: shared code must stay small and boring

Create `shared/` only for:
- error helpers
- logger
- pagination utilities
- time helpers

Do NOT put domain rules in shared.

## Type Safety (TypeScript)

### type-1: always type repository returns via Prisma payload helpers

Use:
- `Prisma.UserGetPayload<{ select: typeof userSelectPublic }>`
- `Prisma.UserGetPayload<{ include: ... }>`

Avoid:
- `any`
- manual object typing that drifts from Prisma

### type-2: DTOs are layer-specific

- controller DTOs: request/response shapes (validation)
- service DTOs: business input types (often similar but not always)
- repository DTOs: data-layer inputs (Prisma create/update inputs, where filters)

Do not reuse controller DTOs directly inside repository.

### type-3: never leak Prisma types above the repository unless intentional

Preferred:
- repository returns domain/output types (or Prisma payload types exported by the repo)

Avoid:
- controller importing `Prisma.UserCreateInput`

## Minimal Examples (Reference)

### controller skeleton

- parse + validate input
- call service
- map errors to HTTP status

### service skeleton

- enforce business rules
- orchestrate repositories
- manage transactions

### repository skeleton

- call prisma
- use shared selects
- map return to typed payload
