export const parseNumber = (value: string | undefined, defaultValue: number): number => {
    if (value === undefined || value.trim().length === 0) {
        return defaultValue
    }

    const parsed = Number.parseInt(value.trim(), 10)
    return Number.isNaN(parsed) ? defaultValue : parsed
}

export const parseDecimal = (value: string | undefined, defaultValue: number): number => {
    if (value === undefined || value.trim().length === 0) {
        return defaultValue
    }

    const parsed = Number.parseFloat(value.trim())
    return Number.isNaN(parsed) ? defaultValue : parsed
}

export const buildDatabaseUrl = (env: NodeJS.ProcessEnv): string =>
    env.PG_CONNECTION_STRING ||
    env.DB_CONNECTION_STRING ||
    env.DATABASE_URL ||
    `postgres://${env.DB_USER || "starteruser"}:${env.DB_PASSWORD || "starterpass"}@${env.DB_HOST || "localhost"}:${env.DB_PORT || 5432}/${env.DB_NAME || "starterdb"}`
