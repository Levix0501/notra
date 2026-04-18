# TASK: Система комментариев для Notra (r28)

> ТЗ для AI-агента. Читать ПОСЛЕ AGENTS.md.

---

## Цель

Добавить систему комментариев: древовидная структура (3 уровня),
модерация, защита от спама, демо-режим, переводы EN+ZH.

**НЕ использовать** Disqus, Commento и др. внешние сервисы.

---

## Шаг 1: Prisma модель

Добавить в `prisma/schema.prisma` (не менять существующее!):

```prisma
model CommentEntity {
  id            Int       @id @default(autoincrement())
  content       String
  authorName    String    @map("author_name")
  authorEmail   String    @map("author_email")
  authorWebsite String?   @map("author_website")
  isApproved    Boolean   @default(false) @map("is_approved")
  honeypot      String?   // spam protection

  parentId      Int?      @map("parent_id")
  parent        CommentEntity?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies       CommentEntity[] @relation("CommentReplies")

  docId         Int       @map("doc_id")
  doc           DocEntity @relation(fields: [docId], references: [id], onDelete: Cascade)

  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  @@index([docId])
  @@index([parentId])
  @@index([isApproved])
  @@map("comments")
}
```

Также добавить в DocEntity: `comments CommentEntity[]`

После: `pnpm db:migrate` (имя миграции: add_comment_entity)

---

## Шаг 2: TypeScript типы

Новый файл `types/comment.ts`:

- CreateCommentDto (content, authorName, authorEmail, authorWebsite?, honeypot?, parentId?)
- CommentWithReplies (с полем replies?: CommentWithReplies[])
- PaginatedComments (items, total, page, pageSize, hasMore)

---

## Шаг 3: Zod валидация

Новый файл `lib/comment-schemas.ts`:

- CreateCommentSchema: content (1-5000 символов), authorName, authorEmail, honeypot должен быть пустым
- SPAM_WORDS: базовый список

---

## Шаг 4: Rate Limiting

Новый файл `lib/rate-limit.ts`:

- In-memory Map<ip, {count, resetAt}>
- Лимит: 5 комментариев / 10 минут с одного IP
- Экспорт: checkRateLimit(ip: string): boolean

---

## Шаг 5: CommentService

Новый файл `services/comment.ts` — методы:

| Метод                                   | Описание                                     |
| --------------------------------------- | -------------------------------------------- |
| getComments(docId, page, pageSize)      | Одобренные комментарии, вложенность 3 уровня |
| createComment(docId, dto, ip)           | Создание: валидация + spam + rate limit      |
| replyToComment(parentId, dto, ip)       | Ответ (проверка глубины max 3)               |
| deleteComment(id)                       | Удаление каскадное                           |
| approveComment(id)                      | Одобрение                                    |
| getPendingComments(page, pageSize)      | Для admin                                    |
| getAllComments(filters, page, pageSize) | Для admin с фильтрами                        |
| getPendingCount()                       | Счётчик неодобренных                         |
| bulkApprove(ids) / bulkDelete(ids)      | Массовые операции                            |
| sendReplyNotification(...)              | Email (mock если нет SMTP)                   |

---

## Шаг 6: API Endpoints (новые файлы)

```
GET  /api/docs/[id]/comments         — публичный, пагинация
POST /api/docs/[id]/comments         — публичный + rate limit + honeypot
POST /api/comments/[id]/reply        — публичный
DELETE /api/comments/[id]            — только admin (auth)
PATCH /api/comments/[id]/approve     — только admin (auth)
POST /api/comments/bulk              — { action, ids[] } только admin
GET  /api/comments/pending-count     — только admin
```

---

## Шаг 7: UI компоненты

Новая папка `components/comments/`:

- **CommentSkeleton** — skeleton loading (shadcn/ui Skeleton)
- **CommentForm** — форма (react-hook-form + zod, honeypot hidden field, optimistic update, toast)
- **ReplyForm** — компактная форма ответа (inline, принимает parentId)
- **CommentItem** — отдельный комментарий (Avatar, имя, дата dayjs, текст, кнопки Reply/Approve/Delete, рекурсивные replies до depth=3)
- **CommentList** — список через SWR, loading/error/empty states, pagination "Load more"
- **CommentsSection** — главный компонент: заголовок "Comments (N)", CommentList + CommentForm
- **index.ts** — реэкспорт

---

## Шаг 8: Интеграция в DocView

Найти страницу просмотра документа → добавить в КОНЕЦ (не менять существующее):

```tsx
import { CommentsSection } from '@/components/comments';
<CommentsSection docId={doc.id} isAdmin={!!session} />;
```

---

## Шаг 9: i18n (en.ts + zh.ts)

Добавить ключ `comments` с секциями:

- заголовок, счётчик, empty/loading/error state
- form: name, email, website, comment, submit, reply, cancel, success
- errors: name_required, email_invalid, content_required, spam_detected, rate_limit, depth_exceeded

---

## Шаг 10: Admin Dashboard

- Новый файл `app/dashboard/comments/page.tsx`
- Таблица: автор, email, текст (truncated), документ, дата, статус, действия
- Фильтры: pending/approved/all
- Bulk actions (чекбоксы + кнопки)
- В sidebar: ссылка "Comments" + badge с count неодобренных

---

## Шаг 11: Демо-режим

Новый файл `lib/demo-comments.ts`:

- Если `NEXT_PUBLIC_DEMO === 'true'`: localStorage ключ `notra_demo_comments`
- Та же структура данных, что и серверная версия

---

## Шаг 12: Тесты (**tests**/comment.test.ts)

**Минимум 3 теста (обязательно):**

1. **Валидация**: CreateCommentSchema — valid data, empty content, invalid email, spam honeypot
2. **Rate Limiter**: 5 запросов OK, 6-й блокируется, другой IP проходит
3. **CommentService** (мок Prisma): пагинация, honeypot reject, max depth 3

Запуск: `pnpm test`

---

## Чеклист приёмки

- [ ] `pnpm check-types` — без ошибок
- [ ] `pnpm lint` — без ошибок
- [ ] `pnpm test` — все тесты зелёные
- [ ] Комментарии работают на странице документа
- [ ] Вложенные ответы до 3 уровней
- [ ] Admin страница комментариев
- [ ] Rate limiting (5/10min)
- [ ] Honeypot спам-защита
- [ ] Демо-режим (localStorage)
- [ ] Переводы EN + ZH
- [ ] Существующие тесты НЕ сломаны
- [ ] Существующие API работают как раньше

---

## Порядок реализации (для агента)

```
1.  types/comment.ts              ← только типы, безопасно
2.  lib/comment-schemas.ts        ← только zod
3.  lib/rate-limit.ts             ← новый файл
4.  lib/demo-comments.ts          ← новый файл
5.  prisma/schema.prisma          ← ОСТОРОЖНО: только добавить
6.  [pnpm db:migrate]
7.  services/comment.ts           ← новый сервис
8.  app/api/.../route.ts          ← новые API routes
9.  components/comments/*         ← UI компоненты
10. [DocView]                     ← ОСТОРОЖНО: только добавить в конец
11. i18n/en.ts + zh.ts            ← ОСТОРОЖНО: только добавить ключи
12. app/dashboard/comments/*      ← admin страница
13. [sidebar]                     ← ОСТОРОЖНО: только добавить ссылку
14. __tests__/comment.test.ts     ← тесты
15. pnpm lint && pnpm test        ← финальная проверка
```
