# API Documentation

This document specifies the REST and WebSocket APIs exposed by the Bridge Server. All APIs are versioned under /v1/.

Authentication
- REST endpoints require an Authorization header: `Bearer <JWT>` or `ApiKey <key>` for service accounts.
- WebSocket connections authenticate during the opening handshake by sending a signed `CONNECT` message or via query param `?token=` over wss (prefer header over query params in production).

REST Endpoints (v1)

- POST /v1/auth/token
  - Description: Exchange API key or credentials for a scoped JWT.
  - Request: { apiKey: string } or user credentials (TBD)
  - Response: { token: string, expiresIn: number }

- GET /v1/bps
  - Description: List registered Behavior Packs (BPs) connected to the Bridge
  - Response: [{ bpId, status, lastSeen, version, sessionId }]

- GET /v1/bps/{bpId}
  - Description: Get BP details and connection metadata

- POST /v1/bps/{bpId}/command
  - Description: Execute a command on a BP
  - Request: { command: string, args?: string[], timeoutMs?: number }
  - Response: { commandId, status: "queued" }

- GET /v1/commands/{commandId}
  - Description: Query command status/result
  - Response: { commandId, status: queued|running|failed|completed, result?: { exitCode, stdout, stderr } }

- GET /v1/events
  - Description: Query recent events (supports filtering by bpId, eventType, time range)
  - Query params: bpId, type, since, limit, cursor

WebSocket API

- Endpoint: /ws
  - Use wss. Client must authenticate on connect by sending an AUTH message.

Message envelope (same as BP protocol):
{
  "protocolVersion": 1,
  "type": "ClientCommand",
  "messageId": "uuid",
  "timestamp": "...",
  "payload": { ... }
}

Client commands over WS
- SUBSCRIBE_EVENTS { bpId?, eventTypes? }
- UNSUBSCRIBE_EVENTS { subscriptionId }
- SEND_COMMAND { bpId, command, args }

Events
- EventMessage sent by Bridge to subscribed clients when BP emits events.

Errors and codes
- Standard HTTP error codes for REST endpoints with structured JSON body:
{ "error": { "code": "UNAUTHORIZED", "message": "...", "details": {...} } }

Rate limiting
- Per-API-key and per-IP rate limiting. Defaults: 120 req/min for typical endpoints, 10 req/s for command execution endpoints.

Versioning
- API under /v1/. Breaking changes increment major version.

SDK integration
- SDKs wrap REST and WebSocket APIs, provide typed request/response objects, automatic reconnection, and convenience helpers for command lifecycle management.

