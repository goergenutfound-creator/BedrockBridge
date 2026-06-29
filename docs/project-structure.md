# Project Structure

Proposed repository layout (top-level):

- /docs - Architecture, protocol, API, roadmap, contribution docs (this folder)
- /bp - Behavior Pack source (Minecraft Bedrock BP project)
  - manifest.json
  - scripts/ (TypeScript/JS source that compiles to the BP format)
- /packages
  - /bridge-server - Node.js TypeScript bridge server (express + ws)
  - /sdk-node - TypeScript SDK for Node.js
  - /sdk-web - TypeScript SDK for browsers (if applicable)
  - /plugins - Example plugin packages
- /tools - dev utilities, simulators (BP simulator for tests)
- /ci - CI configs and test harnesses
- /examples - deployment and configuration examples
- /scripts - release, packaging, and build scripts

Notes
- Each package is expected to be a small, independent TypeScript project with its own tests and package.json.
- Use monorepo tooling (pnpm workspaces or Yarn workspaces) when we start implementing multiple packages.

