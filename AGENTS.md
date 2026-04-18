# Agent Guidelines for Notra Project: Comment System Feature

This document contains all necessary information for AI agents to work on this project. Read it carefully before writing any code.

## 1. Environment & Stack

- **OS:** Ubuntu 22.04.3 LTS (running on WSL2 on Windows)
- **Stack:** Next.js 16 (App Router), TypeScript, Prisma, PostgreSQL, React Server Components (RSC), Tailwind CSS, shadcn/ui.
- **State/Data:** SWR for client-side fetching, Next.js Server Actions/Route Handlers for mutations.

## 2. Execution & Database

- **Run dev server:** `npm run dev`
- **Database Schema Updates:** After modifying `prisma/schema.prisma`, ALWAYS run `npx prisma format`, `npx prisma generate` and suggest `npx prisma db push` to sync the DB.

## 3. SDD (Spec-Driven Development) Workflow

- **Rule 1:** NEVER write implementation code immediately.
- **Rule 2:** Always start by exploring the current codebase and proposing a step-by-step implementation plan (Spec).
- **Rule 3:** Wait for the user to approve the plan before writing any code.
- **Rule 4:** Execute the plan one step at a time. Do not try to complete the entire feature in one prompt.

## 4. Coding Guidelines

- Follow existing project patterns (services, actions, SWR).
- Use `shadcn/ui` components located in the project. Do not install new UI libraries.
- Maintain backward compatibility. Do not break existing core features.
