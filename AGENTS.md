# AGENTS.md — Notra Project Agent Guide

> Этот файл читают AI-агенты перед началом работы.
> Обновляй его каждый раз, когда агент чему-то "не знал".

---

## 1. Среда разработки

- **ОС:** [ВСТАВЬ СВОЮ: Windows 11 / macOS / Ubuntu]
- **Node.js:** >=20.12.0
- **Package manager:** `pnpm` версия >=10.0.0 (НЕ npm, НЕ yarn)
- **IDE:** Cursor

---

## 2. Структура проекта

```
notra/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth.js конфигурация
│   ├── (main)/            # Публичные страницы
│   │   └── [slug]/(doc)/[doc]/   # Страница документа
│   ├── api/               # API routes
│   └── dashboard/         # Админ-панель
├── actions/               # Server Actions
├── services/              # Бизнес-логика (классы DocService, etc.)
├── lib/                   # Утилиты
├── components/            # React-компоненты
├── prisma/schema.prisma   # Схема БД — редактировать осторожно!
├── i18n/                  # Переводы (en.ts, zh.ts)
└── types/                 # TypeScript типы
```

---

## 3. Запуск проекта

```bash
pnpm install
pnpm dev           # = prisma generate && next dev
pnpm build         # = prisma generate + migrate deploy + next build
```

**ВАЖНО:** Всегда используй `pnpm`, не `npm` и не `yarn`.

---

## 4. База данных

- **СУБД:** PostgreSQL, **ORM:** Prisma 6.x

```bash
pnpm db:generate   # генерация клиента
pnpm db:migrate    # создать + применить миграцию (dev)
pnpm db:deploy     # применить миграции (prod)
```

**Соглашения schema.prisma:**
- Модели называются `XxxEntity`
- Таблицы: `@@map("snake_case")`
- Поля: `@map("snake_case")`
- Всегда: `createdAt` и `updatedAt`

---

## 5. Паттерны кода

### Service Layer (services/)
```typescript
export class CommentService {
  static readonly getComments = cache(async (docId: number) => {
    try {
      return ServiceResult.success(data);
    } catch (error) {
      logger('CommentService.getComments', error);
      return ServiceResult.fail('Error message');
    }
  });
}
```

### API Routes
```typescript
// app/api/docs/[id]/comments/route.ts
export async function GET(_, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;  // params — всегда Promise в App Router!
  const result = await CommentService.getComments(Number(id));
  return result.nextResponse();
}
```

### i18n — добавлять в ОБА файла
- `i18n/en.ts` — английский
- `i18n/zh.ts` — китайский

### Клиентский fetching — SWR
### Валидация — Zod (уже установлен)
### UI — shadcn/ui (Card, Button, Input, Textarea, Avatar, Skeleton)

---

## 6. Тесты

```bash
pnpm test              # запуск всех тестов (Vitest)
pnpm test -- --watch   # watch mode
```

---

## 7. Линтинг

```bash
pnpm lint      # ESLint + Prettier + Stylelint + TypeScript
pnpm lint:fix  # автоисправление
pnpm check-types  # только TypeScript
```

---

## 8. Что НЕЛЬЗЯ делать агенту

- ❌ Использовать `npm` или `yarn` — только `pnpm`
- ❌ Удалять существующие модели в schema.prisma
- ❌ Менять сигнатуры существующих функций
- ❌ Использовать Disqus, Commento или другие внешние сервисы
- ❌ Делать breaking changes в существующих API
- ❌ Изменять существующие тесты

---

## 9. Демо-режим

```typescript
const isDemoMode = process.env.NEXT_PUBLIC_DEMO === 'true';
// В демо-режиме данные → localStorage
```

---

## 10. Известные подводные камни

- `params` в App Router — это `Promise`, всегда `await params`
- `cache()` из React — для дедупликации в Server Components
- `revalidatePath` — после мутаций для инвалидации кэша
- Аутентификация: `const session = await auth();` → null если не авторизован