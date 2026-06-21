import type { TransportOptions } from "nodemailer"
import { parseNumber } from "./parsers.js"
import type { MailerConfig } from "./types.js"

export const buildMailerConfig = (env: NodeJS.ProcessEnv): MailerConfig => ({
    defaults: {
        from: env.MAILER_DEFAULT_FROM || "Starter <no-reply@example.com>",
        subject: env.MAILER_DEFAULT_SUBJECT || "Starter Notification",
        replyTo: env.MAILER_DEFAULT_REPLY_TO,
        priority: (env.MAILER_DEFAULT_PRIORITY as "high" | "normal" | "low") || "normal",
    },
    transport: {
        host: env.SMTP_HOST || "localhost",
        port: parseNumber(env.SMTP_PORT, 1025),
        secure: env.SMTP_SECURE === "true",
        pool: env.SMTP_POOL === "true",
        maxConnections: parseNumber(env.SMTP_MAX_CONNECTIONS, 5),
        maxMessages: parseNumber(env.SMTP_MAX_MESSAGES, 100),
        connectionTimeout: parseNumber(env.SMTP_CONNECTION_TIMEOUT, 2 * 60 * 1000),
        socketTimeout: parseNumber(env.SMTP_SOCKET_TIMEOUT, 10 * 60 * 1000),
        auth:
            env.SMTP_USER && env.SMTP_PASS
                ? {
                      user: env.SMTP_USER,
                      pass: env.SMTP_PASS,
                  }
                : undefined,
        tls: {
            rejectUnauthorized: env.SMTP_TLS_REJECT_UNAUTHORIZED !== "false",
        },
    } as TransportOptions,
})
