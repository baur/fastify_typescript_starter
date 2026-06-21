# Project Simplification Notes

## Current Philosophy

The project is not broken. It is a "starter with batteries", but for a pragmatic PostgreSQL-only Fastify API it can be simplified.

The preferred direction:

- less generic abstraction
- more explicit PostgreSQL/Fastify code
- Kysely for typed runtime queries
- Dbmate for honest PostgreSQL SQL migrations
- generated `src/database/db.d.ts` as developer ergonomics, not as the source of truth

## Dbmate Decision

Replacing Kysely TypeScript migrations with Dbmate does not violate the project philosophy.

For a PostgreSQL-only project, Dbmate is a good fit because migrations become real SQL and can use PostgreSQL features directly:

- enums
- triggers
- functions
- partial indexes
- `jsonb`
- extensions

Kysely remains useful in application code as a typed query builder. Dbmate owns schema evolution.

Rule of thumb:

> Kysely for type-safe queries in runtime code, Dbmate for PostgreSQL migrations.

## Main Simplification Candidates

1. Simplify TLS

   Done. The app serves HTTP only. HTTPS belongs outside the Node process, through a reverse proxy, ingress, Caddy, nginx, or the cloud platform.

2. Replace schema autoscan with explicit registry

   `src/plugins/schemas.ts` recursively scans and dynamically imports schema files. It is convenient but magic.

   Simpler model:

   - explicitly import schema model arrays from each module
   - register a single `allModels` list
   - make schema registration easier to review

3. Decide whether pg-boss is needed right now

   pg-boss currently runs for one OTP email job.

   Keep pg-boss if the project needs real background jobs, retries, idempotency, delayed jobs, webhooks, imports, or email delivery durability.

   Otherwise, simplify by sending OTP email directly for now and bring the queue back when jobs become a real product need.

4. Revisit DB cache

   Current `CacheService` is a generic PostgreSQL key-value cache used for OTP, login attempts, and gallery cache.

   This works, but can become a black box.

   Possible simplifications:

   - explicit `otp_codes` and `login_attempts` tables
   - keep DB cache only for generic cache use
   - later use Redis/KeyDB if cache behavior becomes central

5. Reduce `environment.ts`

   `src/config/environment.ts` currently owns server, DB, queue, SMTP, S3, CSP, Swagger, healthcheck, TLS, and captcha config.

   Possible simplifications:

   - split into smaller config modules
   - or keep one file but remove unused knobs

6. Make captcha optional at the edge

   Turnstile verification is called from auth service methods but bypassed in development.

   If there is no public frontend yet, consider keeping captcha as an optional route hook/plugin instead of baking it into core auth service logic.

7. Remove unused generic DB helpers

   `src/database/helpers.ts` has generic pagination with `any`. If pagination is not used yet, delete it until a real endpoint needs it.

   When pagination is needed, implement it around the actual query pattern.

## Things That Are Not Overengineering

- Kysely for runtime queries
- Dbmate for SQL migrations
- TypeBox schemas for Fastify API validation/serialization
- Fastify plugins for DB/JWT/mailer
- repository/service split for auth, even if it can be made leaner

## Personal Cleanup Order

1. Simplify TLS: HTTP in the app, HTTPS outside. Done.
2. Replace schema autoscan with explicit schema registry.
3. Decide whether pg-boss is needed now.
4. Clean up cache: explicit tables for OTP/attempts or a clear cache adapter.
5. Split or reduce `environment.ts`.
6. Remove unused generic helpers with `any`.
