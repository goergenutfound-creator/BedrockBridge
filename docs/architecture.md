# Architecture

This document explains the high-level architecture for BedrockBridge, the responsibilities of each subsystem, and the design constraints that guide implementation.

1. Overview

BedrockBridge is composed of these primary components:

- Behavior Pack (BP): Runs inside Minecraft Bedrock Dedicated Server using the Bedrock Script API. It exposes a small, versioned protocol over UDP/TCP/HTTP (choice documented below) to communicate server events and accept management commands from an external Bridge.

- Bridge Server (Node.js): A stateless, horizontally-scalable server that mediates communication between the BP and external integrations. It provides REST and WebSocket APIs, handles authentication and authorization, maintains sessions, and routes commands/events.

- SDK(s): Language-specific client SDKs (initially TypeScript/Node.js) that implement the Bridge protocol, helpers for signing/authentication, reconnection/backoff logic, and typed interfaces for commands and events.

- Plugins: A plugin system for extending the Bridge Server with new command handlers, inbound webhooks (e.g., Discord), or transformations.

- Dashboard (future): A web frontend for visual management, authentication, and plugin configuration.

2. Architectural Principles

- Clean Architecture: Divide code into layers—API (controllers), Application (use-cases), Domain (entities, interfaces), Infrastructure (DB, network). Public interfaces live in the domain/application layers and are fully documented.

- SOLID: Single Responsibility, Open/Closed (via plugin interfaces), Liskov Substitution (interfaces for transports, authenticators), Interface Segregation, Dependency Inversion (use abstractions for external dependencies).

- Small modules: Each feature lives in its own package under /packages or /src, with a public TypeScript interface and unit tests.

- Testability: All public interfaces are designed to be mockable. Integration tests include an in-memory BP simulator.

- Versioning & Compatibility: Protocols and REST API are versioned. The BP advertises its protocol version during handshake; the Bridge can map or reject incompatible versions.

3. Component Responsibilities

- Behavior Pack (BP)
  - Collect server events (player join/leave, console output, command results)
  - Provide an API to execute privileged server commands coming from the Bridge
  - Securely authenticate the Bridge using pre-shared keys and per-connection challenges
  - Minimal dependency footprint and safe to run in production BDS

- Bridge Server
  - Authentication & Authorization (API keys, JWT for users/integrations)
  - REST/WS APIs for clients and dashboards
  - Routing and transformation of messages between BP and clients
  - Plugin lifecycle management (install, enable, disable)
  - Persistence layer for sessions, logs, and plugin data (pluggable: Postgres, SQLite for local)

- SDK
  - Provide typed interfaces for the Bridge protocol
  - Handle reconnection, exponential backoff, and message acknowledgement
  - Provide utilities for signing, encryption, and message formation

4. Data Flow and Lifecycles

- BP -> Bridge: on events, BP sends EventMessage to Bridge over an authenticated WebSocket or HTTP push. Bridge validates signature and persists the event.

- Client -> Bridge (REST/WS): Client issues a CommandRequest to Bridge (authenticated). Bridge validates permissions, translates to BP CommandMessage, and forwards it. BP executes, returns CommandResult; Bridge routes the result to requester and logs it.

5. Security

- Mutual authentication between BP and Bridge using HMAC-signed challenges or mTLS. Initial implementation: HMAC with rotating keys and nonce to avoid replay.
- REST/WS clients authenticate using API keys and obtain scoped JWTs for user sessions.
- All sensitive data in motion must be TLS-encrypted.

6. Observability

- Structured logging (JSON) with correlation IDs for requests and commands.
- Metrics: command latency, connection counts, error rates exposed via Prometheus endpoint.
- Tracing: optional OpenTelemetry integration.

7. Testing Strategy

- Unit tests for all modules using Jest.
- Integration tests with a BP simulator (in-memory mock) and temporary SQLite or Docker Postgres.
- End-to-end tests in CI using a lightweight BDS instance (optional/experimental).

8. Deployment

- Bridge Server packaged as a container image. Configuration via environment variables and secrets manager.
- BP distributed as a Behavior Pack ZIP with install instructions.


