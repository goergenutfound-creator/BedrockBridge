/**
 * Configuration loader for the Bridge Server.
 *
 * This module loads environment variables using dotenv and exposes a typed
 * AppConfig object for the application. It validates required values and
 * converts types where appropriate.
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/** Application configuration */
export interface AppConfig {
  /** Host to bind the HTTP server to */
  host: string;
  /** Port to bind the HTTP server to */
  port: number;
  /** Log level for structured logger */
  logLevel: string;
  /** WebSocket path for BP connections */
  bpWsPath: string;
  /** HMAC pre-shared key for BP handshake */
  hmacPsk: string;
}

function required(name: string, value?: string): string {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const config: AppConfig = {
  host: process.env.HOST || '0.0.0.0',
  port: Number(process.env.PORT || 3000),
  logLevel: process.env.LOG_LEVEL || 'info',
  bpWsPath: process.env.BP_WS_PATH || '/ws/bp',
  hmacPsk: required('HMAC_PSK', process.env.HMAC_PSK),
};

export default config;
