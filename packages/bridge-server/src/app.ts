/**
 * Express application factory.
 *
 * This module creates and configures the Express application instance using
 * only pure functions and injection-friendly patterns. Side effects (like
 * starting servers) are handled in the bootstrap code.
 */

import express, { Express, Request, Response } from 'express';
import { AwilixContainer } from 'awilix';

/** Create the Express application and register routes/middleware.
 *
 * @param container DI container exposing app dependencies (config, logger)
 */
export function createApp(container: AwilixContainer): Express {
  const app = express();

  app.use(express.json());

  // Health endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  // Versioned API root
  app.get('/v1', (_req: Request, res: Response) => {
    res.status(200).json({ name: 'bedrockbridge-bridge', version: '0.1.0' });
  });

  return app;
}
