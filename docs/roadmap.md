# Roadmap and Milestones

This roadmap outlines the initial milestones for BedrockBridge. Timeline is indicative and assumes open-source volunteer effort.

M0: Project setup (complete)
- Architecture, protocol and API docs
- Repo scaffolding and contribution guidelines

M1: Core Bridge Server (MVP)
- Basic Bridge server with REST and WebSocket endpoints
- HMAC handshake implementation for BP
- BP simulator for local testing
- Unit tests and CI

M2: Behavior Pack (BP) MVP
- Minimal BP that can connect and respond to commands
- Implement PLAYER_JOIN event and `say` command
- Packaging and install instructions

M3: SDK and CLI
- TypeScript SDK for Node that wraps Bridge APIs
- CLI tool for sending commands and viewing events

M4: Plugin system & Discord integration
- Plugin lifecycle and example Discord plugin
- Webhook handlers and sample integrations

M5: Dashboard & advanced features
- Web dashboard for server management
- Role-based access control, audit logs

M6: Stability and scaling
- Metrics, tracing, horizontal scaling guidance
- Production-ready deployment docs and monitoring

