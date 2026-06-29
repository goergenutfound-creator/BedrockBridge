/**
 * Dependency injection container setup.
 *
 * Uses awilix to register application-wide dependencies so modules can
 * depend on abstractions rather than concrete implementations.
 */

import { createContainer, asValue, AwilixContainer } from 'awilix';
import config from '../config';
import logger from '../logger';

/** Create and configure the DI container for the bridge server */
export function createContainer(): AwilixContainer {
  const container = createContainer();

  container.register({
    config: asValue(config),
    logger: asValue(logger),
  });

  return container;
}
