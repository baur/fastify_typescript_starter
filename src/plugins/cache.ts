import type { FastifyInstance } from "fastify"
import fp from "fastify-plugin"
import { type Kysely, sql } from "kysely"
import type { DB, Json } from "#database/db.d.js"

declare module "fastify" {
    interface FastifyInstance {
        cache: CacheService
    }
}

async function fastifyCache(fastify: FastifyInstance) {
    if (!fastify.hasDecorator("cache")) {
        fastify.decorate("cache", new CacheService(fastify.db))
    }
}

export default fp(fastifyCache, {
    fastify: ">=5.0.0",
    name: "cache",
    dependencies: ["db"],
})

class CacheService {
    constructor(private readonly db: Kysely<DB>) {}

    async get<T = unknown>(key: string): Promise<T | false> {
        const item = await this.db
            .selectFrom("cache")
            .select(["key", "value", "expires_at"])
            .where("key", "=", key)
            .where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", sql<Date>`NOW()`)]))
            .executeTakeFirst()

        return item ? (item.value as T) : false
    }

    async set(key: string, data: Json, exp = 300): Promise<void> {
        const expiresAt = exp ? sql<Date>`NOW() + ${exp} * INTERVAL '1 second'` : null

        await this.db
            .insertInto("cache")
            .values({ key, value: data, expires_at: expiresAt })
            .onConflict((oc) =>
                oc.column("key").doUpdateSet({
                    value: data,
                    expires_at: expiresAt,
                    created_at: sql<Date>`NOW()`,
                }),
            )
            .execute()
    }

    async flush(keys: string | string[]): Promise<void> {
        const list = Array.isArray(keys) ? keys : [keys]
        await this.db.deleteFrom("cache").where("key", "in", list).execute()
    }

    async flushPattern(pattern: string): Promise<string> {
        await this.db.deleteFrom("cache").where("key", "like", pattern.replace(/\*/g, "%")).execute()
        return `Cache cleared on: ${pattern}`
    }

    async getPattern(pattern: string): Promise<string[]> {
        const items = await this.db
            .selectFrom("cache")
            .select("key")
            .where("key", "like", pattern.replace(/\*/g, "%"))
            .where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", sql<Date>`NOW()`)]))
            .execute()

        return items.map((item) => item.key)
    }

    async flush_pattern(pattern: string): Promise<string> {
        return this.flushPattern(pattern)
    }

    async get_pattern(pattern: string): Promise<string[]> {
        return this.getPattern(pattern)
    }
}
