import { type Kysely, sql } from "kysely"
import type { DB } from "./db.d.js"

export const PG_ERROR_CODES = {
    unique: "23505",
    foreignKey: "23503",
    checkViolation: "23514",
    notNull: "23502",
} as const

export type PgErrorCode = (typeof PG_ERROR_CODES)[keyof typeof PG_ERROR_CODES]

export function isPgError(error: unknown, code: PgErrorCode): boolean {
    return error instanceof Error && "code" in error && (error as { code?: string }).code === code
}

export const pgerr = PG_ERROR_CODES

export interface DbHealthInfo {
    version: string
    uptime: string
    connectionCount: number
}

export const getDbHealth = async (db: Kysely<DB>): Promise<DbHealthInfo> => {
    const result = await sql<{ version: string; uptime: string; connection_count: string }>`
        SELECT
            version() AS version,
            (current_timestamp - pg_postmaster_start_time())::text AS uptime,
            (
                SELECT count(*)::text
                FROM pg_stat_activity
                WHERE state = 'active'
            ) AS connection_count
    `.execute(db)
    const row = result.rows[0]

    return {
        version: row?.version?.split(" ")[0] ?? "PostgreSQL",
        uptime: row?.uptime ?? "0",
        connectionCount: Number(row?.connection_count ?? 0),
    }
}
