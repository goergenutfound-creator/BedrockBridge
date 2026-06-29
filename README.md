# BedrockBridge

BedrockBridge is an open-source remote management platform for Minecraft Bedrock Dedicated Server that uses the Bedrock Scripting API to provide a secure, modern replacement for RCON.

Goals
- Provide a reliable, authenticated remote management protocol for Bedrock Dedicated Server (BDS)
- Enable REST and WebSocket APIs for automation and integrations
- Provide a Node.js bridge server and SDKs for building integrations
- Include a Bedrock Behavior Pack (BP) to run inside the server and communicate with the Bridge
- Support plugins, Discord integration, and a future web dashboard

This repository contains the project architecture, protocol design, API contract, and initial project structure. No runtime code is implemented yet — see docs/ for detailed design and roadmap.

Next steps
1. Review architecture and protocol documents in docs/
2. Approve interfaces and API contracts
3. Begin implementing the Bridge Server, SDK, and Bedrock Behavior Pack modules incrementally with tests

See docs/ for complete documentation.
