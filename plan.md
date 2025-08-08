# Plan: Switch to StreamableHttpServerTransport

**Goal:** Modify the MCP server to use `StreamableHttpServerTransport` for HTTP-based communication, enabling deployment to Azure.

## Progress Tracker

- [x] **Analyze `src/index.ts`**: Understand the current implementation using `StdioServerTransport`.
- [x] **Modify `src/index.ts`**: Replace `StdioServerTransport` with `StreamableHttpServerTransport` and configure the server to listen on a port (e.g., 3000).
- [ ] **Update `Dockerfile`**: Add an `EXPOSE` instruction to the `Dockerfile` to expose the server's port.
- [ ] **Verify Changes**: Rebuild and run the Docker image to confirm the server operates correctly over HTTP.
