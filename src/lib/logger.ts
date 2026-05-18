type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogMeta = Record<string, unknown>;

type Logger = {
  debug: (message: string, meta?: LogMeta) => void;
  info: (message: string, meta?: LogMeta) => void;
  warn: (message: string, meta?: LogMeta) => void;
  error: (message: string, meta?: LogMeta) => void;
};

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const DEFAULT_LEVEL: LogLevel =
  process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const LOG_LEVEL = (process.env.LOG_LEVEL as LogLevel | undefined) ?? DEFAULT_LEVEL;

const ENV_LABEL = process.env.NODE_ENV ?? 'development';

const shouldLog = (level: LogLevel) =>
  LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[LOG_LEVEL];

const normalizeError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  return { message: String(error) };
};

const truncate = (value: unknown, maxLength = 500) => {
  if (typeof value !== 'string') return value;
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
};

const safeStringify = (payload: unknown) => {
  try {
    return JSON.stringify(payload);
  } catch (error) {
    return JSON.stringify({
      level: 'error',
      message: 'Failed to serialize log payload.',
      error: normalizeError(error),
    });
  }
};

const writeLog = (level: LogLevel, message: string, meta?: LogMeta) => {
  if (!shouldLog(level)) return;

  const payload = {
    level,
    message: truncate(message),
    time: new Date().toISOString(),
    env: ENV_LABEL,
    ...(meta ? Object.fromEntries(
      Object.entries(meta).map(([key, value]) => [key, truncate(value)])
    ) : {}),
  };

  const output = safeStringify(payload);

  switch (level) {
    case 'debug':
      console.debug(output);
      break;
    case 'info':
      console.info(output);
      break;
    case 'warn':
      console.warn(output);
      break;
    case 'error':
      console.error(output);
      break;
  }
};

export const logger: Logger = {
  debug: (message, meta) => writeLog('debug', message, meta),
  info: (message, meta) => writeLog('info', message, meta),
  warn: (message, meta) => writeLog('warn', message, meta),
  error: (message, meta) => writeLog('error', message, meta),
};

export const createRequestId = () => {
  if (typeof crypto?.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `req_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
};

export const errorToMeta = (error: unknown) => ({
  error: normalizeError(error),
});
