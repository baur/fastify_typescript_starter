import type { ConstructorOptions } from "pg-boss"
import { buildDatabaseUrl, parseNumber } from "./parsers.js"
import type { DatabaseConfig } from "./types.js"

export const buildDatabaseConfig = (env: NodeJS.ProcessEnv): DatabaseConfig => {
    const connectionString = buildDatabaseUrl(env)

    return {
        pool: {
            application_name: env.DB_APP_NAME || "fastify-starter",
            connectionString,
            min: parseNumber(env.DB_POOL_MIN, 1),
            max: parseNumber(env.DB_POOL_MAX, 10),
            idleTimeoutMillis: parseNumber(env.DB_POOL_IDLE_TIMEOUT, 10000),
            connectionTimeoutMillis: parseNumber(env.DB_POOL_CONNECTION_TIMEOUT, 5000),
            query_timeout: parseNumber(env.DB_QUERY_TIMEOUT, 30000),
            lock_timeout: parseNumber(env.DB_LOCK_TIMEOUT, 5000),
            statement_timeout: parseNumber(env.DB_STATEMENT_TIMEOUT, 30000),
            keepAliveInitialDelayMillis: parseNumber(env.DB_KEEP_ALIVE_INITIAL_DELAY, 30000),
            idle_in_transaction_session_timeout: parseNumber(env.DB_IDLE_IN_TRANSACTION_SESSION_TIMEOUT, 30000),
        },
        queue: {
            connectionString,
            application_name: env.PGBOSS_APP_NAME || "fastify-starter-queue",
            schema: env.PGBOSS_SCHEMA || "queue",
            migrate: env.PGBOSS_MIGRATE !== "false",
            max: parseNumber(env.PGBOSS_MAX_CONN, 5),
            archiveCompletedAfterSeconds: parseNumber(env.PGBOSS_ARCHIVE_COMPLETED_AFTER, 60 * 60 * 12),
            archiveFailedAfterSeconds: parseNumber(env.PGBOSS_ARCHIVE_FAILED_AFTER, 60 * 60 * 12),
            deleteAfterDays: parseNumber(env.PGBOSS_DELETE_AFTER_DAYS, 7),
            monitorStateIntervalMinutes: parseNumber(env.PGBOSS_MONITOR_INTERVAL, 5),
        } as ConstructorOptions & Record<string, unknown>,
        timezone: env.DB_TIMEZONE || "UTC",
    }
}
