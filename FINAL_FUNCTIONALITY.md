# TASK: Реализация системы комментариев (Notra)

> **Контекст:** Добавление системы древовидных комментариев в базу знаний Notra.
> **Стек:** Next.js 16 (App Router), Prisma, PostgreSQL, shadcn/ui, SWR, Zod.
> **Инструкция для агента:** Выполняй задачи строго по порядку. Перед каждым этапом проверяй `@workspace` на наличие существующих паттернов.

---

## 1. Слой данных (Database & Types)

- [ ] **Prisma Model:** Добавить `CommentEntity` в `prisma/schema.prisma`.
  - Поля: `id (Int, PK)`, `content (String)`, `authorName`, `authorEmail`, `authorWebsite?`, `isApproved (Boolean, default: false)`, `honeypot (String?)`, `parentId (Int?)`, `docId (Int)`, `createdAt`, `updatedAt`.
  - Связи: `DocEntity` (1:N), `CommentEntity` (Self-relation parent/replies).
  - Индексы: `docId`, `parentId`, `isApproved`.
- [ ] **Синхронизация:** Выполнить форматирование и генерацию (`npx prisma format`, `npx prisma db push`).
- [ ] **TypeScript:** Создать `src/types/comment.ts` с интерфейсами для DTO и древовидной структуры (вложенность до 3 уровней).

## 2. Валидация и безопасность

- [ ] **Zod Schema:** Создать `src/lib/validations/comment.ts`.
  - Валидация email, длины текста (1-5000), обязательных полей.
  - Проверка `honeypot` (должен быть пустым).
- [ ] **Rate Limiter:** Создать `src/lib/rate-limit.ts` (In-memory Map: 5 сообщений / 10 минут на 1 IP).
- [ ] **Spam Filter:** Добавить список `BAD_WORDS` для базовой фильтрации контента в `src/lib/comment-utils.ts`.

## 3. Бизнес-логика (Service Layer)

- [ ] **CommentService:** Создать `src/services/comment.service.ts`.
  - `getComments(docId)`: Возвращает дерево комментариев (рекурсивно).
  - `createComment()`: Валидация + Spam Check + Rate Limit.
  - `approveComment(id)` / `deleteComment(id)`: Функции модерации.
- [ ] **Notifications:** Добавить заглушку `sendReplyNotification` (вывод в консоль).

## 4. API Endpoints (Route Handlers)

- [ ] **Public API:**
  - `GET /api/docs/[id]/comments` — получение списка.
  - `POST /api/docs/[id]/comments` — создание нового.
  - `POST /api/comments/[id]/reply` — ответ на комментарий.
- [ ] **Admin API:**
  - `PATCH /api/comments/[id]/approve` — одобрение (только для роли admin).
  - `DELETE /api/comments/[id]` — удаление (только для роли admin).

## 5. UI Компоненты (Frontend)

- [ ] **Shared:** Использовать компоненты из `@/components/ui` (shadcn).
- [ ] **Components:** Создать в `src/components/comments/`:
  - `CommentForm.tsx`: Форма с Optimistic UI.
  - `CommentItem.tsx`: Отображение, кнопка "Ответить", рекурсивный рендер веток.
  - `CommentsSection.tsx`: Главный контейнер для `DocView`.
- [ ] **SWR:** Настроить получение данных и автоматическую инвалидацию кэша.

## 6. Админка и Интернационализация

- [ ] **Admin Page:** Создать `src/app/dashboard/comments/page.tsx`.
  - Таблица с фильтрами (Pending/Approved) и Bulk Actions.
- [ ] **i18n:** Добавить ключи переводов в `src/i18n/en.ts` и `src/i18n/zh.ts`.
- [ ] **Demo Mode:** Если активен демо-режим, сохранять данные в `localStorage`.

## 7. Тестирование

- [ ] **Unit Tests:** Создать `src/__tests__/comments.test.ts`.
  - Проверка валидации, Rate Limiter и структуры дерева.
- [ ] **Final Check:** Запуск `npm run lint` и `npm run type-check`.
