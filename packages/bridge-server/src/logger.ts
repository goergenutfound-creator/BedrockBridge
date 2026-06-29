/**
 * Logger wrapper using pino. Exposes a typed logger instance configured from
 * application configuration.
 */

import pino from 'pino';
import config from './config';

/** Application logger instance */
export const logger = pino({
  level: config.logLevel,
  base: { service: 'bridge-server' },
});

export type Logger = pino.Logger;

export default logger;
