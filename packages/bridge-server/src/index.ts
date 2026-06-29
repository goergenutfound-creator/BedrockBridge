/**
 * Bootstrap and start the bridge server application.
 *
 * Responsibilities:
 * - Load config and logger
 * - Create DI container
 * - Create Express app and HTTP server
 * - Initialize WebSocket server (handlers implemented later)
 * - Manage graceful shutdown
 */

import http from 'http';
import { WebSocketServer } from 'ws';
import config from './config';
import logger from './logger';
import { createContainer } from './di/container';
import { createApp } from './app';

async function start(): Promise<http.Server> {
  const container = createContainer();
  const app = createApp(container);

  const server = http.createServer(app);

  const wss = new WebSocketServer({ noServer: true, path: config.bpWsPath });

  // NOTE: WebSocket message handlers will be implemented in a follow-up
  // change. For now, we initialise the server so the HTTP upgrade flow is
  // ready and can be extended safely.

  server.on('upgrade', (request, socket, head) => {
    // Validate request and let ws accept it. No handlers are attached yet.
    wss.handleUpgrade(request, socket as any, head, (ws) => {
      // Intentionally minimal: emit a connection log and leave message
      // handling to subsequent commits.
      logger.info({ url: request.url }, 'BP websocket connection upgraded');

      // Optionally attach a noop message handler to ensure socket remains
      // stable until real handlers are implemented.
      ws.on('message', () => {
        // Intentionally ignore messages until handlers exist. This ensures
        // the server accepts connections without processing messages.
      });
    });
  });

  return new Promise((resolve, reject) => {
    server.listen(config.port, config.host, () => {
      logger.info({ host: config.host, port: config.port }, 'Bridge server listening');
      resolve(server);
    });

    server.on('error', (err) => {
      logger.error({ err }, 'Server error during startup');
      reject(err);
    });
  });
}

async function shutdown(server?: http.Server) {
  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
    }
    logger.info('Bridge server shut down gracefully');
    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'Error during shutdown');
    process.exit(1);
  }
}

// Start when invoked directly
if (require.main === module) {
  start()
    .then((server) => {
      process.on('SIGINT', () => shutdown(server));
      process.on('SIGTERM', () => shutdown(server));
    })
    .catch((err) => {
      logger.error({ err }, 'Failed to start bridge server');
      process.exit(1);
    });
}

export { start, shutdown };
