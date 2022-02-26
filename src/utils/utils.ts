import { LogLevel } from "@nestjs/common/services/logger.service";

export function recursivelyStripNullValues(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(recursivelyStripNullValues);
    }
    if (value !== null && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value).map(([key, value]) => [key, recursivelyStripNullValues(value)])
        );
    }
    if (value !== null) {
        return value;
    }
}
 
export function getLogLevels(isProduction: boolean): LogLevel[] {
  if (isProduction) {
    return ['log', 'warn', 'error'];
  }
  return ['error', 'warn', 'log', 'verbose', 'debug'];
}