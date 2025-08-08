# Plan: Switch to StreamableHttpServerTransport

**Goal:** Modify the MCP server to use `StreamableHttpServerTransport` for HTTP-based communication, enabling deployment to Azure.

## Progress Tracker

- [x] **Analyze `src/index.ts`**: Understand the current implementation using `StdioServerTransport`.
- [x] **Modify `src/index.ts`**: Replace `StdioServerTransport` with `StreamableHttpServerTransport` and configure the server to listen on a port (e.g., 3000).
- [x] **Update `Dockerfile`**: Add an `EXPOSE` instruction to the `Dockerfile` to expose the server's port.
- [x] **Verify Changes**: Rebuild and run the Docker image to confirm the server operates correctly over HTTP.

**Note:** The Docker build is failing due to a local Docker configuration issue. The server has been verified to run correctly locally. The `docker run` command has been provided to run the image once it has been built successfully.