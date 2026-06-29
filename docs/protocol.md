# Protocol

This document defines the protocol between the Bedrock Behavior Pack (BP) and the Bridge Server (Bridge). The protocol is intentionally minimal, JSON-over-WebSocket friendly, and versioned.

Versioning
- Protocol messages MUST include a top-level `protocolVersion` integer.
- Bridge and BP negotiate the highest mutually supported version during handshake.

Transport
- Primary transport: WebSocket over TLS (wss). Fallback transports may include HTTP(S) POST for event push or UDP for stateless events (not recommended for commands).

Authentication
- Two modes supported:
  1. HMAC pre-shared keys (PSK) with nonce-challenge
  2. Mutual TLS (mTLS) for deployments that prefer certificate auth

Handshake (HMAC PSK)
1. BP connects to Bridge WebSocket endpoint: /ws/bp
2. Bridge replies with HANDSHAKE_CHALLENGE { nonce, serverTime }
3. BP computes signature = HMAC_SHA256(PSK, nonce || serverTime || bpId) and sends HANDSHAKE_RESPONSE { bpId, signature, supportedVersions }
4. Bridge validates signature and responds with HANDSHAKE_ACK { acceptedVersion, assignedSessionId }

Message Types

Common envelope (JSON):
{
  "protocolVersion": 1,
  "type": "EventMessage",
  "sessionId": "uuid",
  "messageId": "uuid",
  "timestamp": "ISO8601",
  "payload": { ... }
}

1. EventMessage (BP -> Bridge)
- type: "EventMessage"
- payload: { eventType: string, data: object }
- Example eventTypes: PLAYER_JOIN, PLAYER_LEAVE, CONSOLE_OUTPUT, TICK_STATS

2. CommandMessage (Bridge -> BP)
- type: "CommandMessage"
- payload: { commandId: uuid, command: string, args: array, meta: { requesterId, correlationId } }
- The BP MUST acknowledge receipt with CommandAck and produce a final CommandResult.

3. CommandAck (BP -> Bridge)
- type: "CommandAck"
- payload: { commandId, status: "accepted" | "rejected", reason? }

4. CommandResult (BP -> Bridge)
- type: "CommandResult"
- payload: { commandId, exitCode: number, stdout: string, stderr: string, durationMs: number }

5. Ping / Pong
- Keepalive messages to detect dead peers. Include lastProcessedMessageId optionally.

Error model
- Errors use a structured shape:
{
  "type": "Error",
  "payload": { "code": "INVALID_COMMAND", "message": "...", "details": {...} }
}

Delivery guarantees
- Commands are at-least-once by default. Client must handle idempotency for non-idempotent operations.
- Optional exactly-once semantics can be implemented by the Bridge using command deduplication and command sequencing.

Examples

Command request from Bridge to BP:
{
  "protocolVersion": 1,
  "type": "CommandMessage",
  "sessionId": "...",
  "messageId": "...",
  "timestamp": "2026-06-29T12:00:00Z",
  "payload": {
    "commandId": "...",
    "command": "say",
    "args": ["Hello from Bridge!"],
    "meta": { "requesterId": "admin:123" }
  }
}

Corresponding result from BP:
{
  "protocolVersion": 1,
  "type": "CommandResult",
  "sessionId": "...",
  "messageId": "...",
  "timestamp": "2026-06-29T12:00:00Z",
  "payload": {
    "commandId": "...",
    "exitCode": 0,
    "stdout": "Message sent to all players",
    "stderr": "",
    "durationMs": 34
  }
}

Extension points
- The `payload`s are intentionally flexible so new eventTypes and message types can be introduced in minor protocol versions.
- All messages MUST include `messageId` and `sessionId` for tracing and deduplication.

Security considerations
- All messages MUST be sent over TLS.
- Nonce-based HMAC handshake prevents replay.
- Rotate PSKs periodically; include PSK version in handshake to support key rotation.

