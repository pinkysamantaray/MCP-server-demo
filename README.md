## MCP uses two types of communications:

The protocol currently defines two standard transport mechanisms for client-server communication:

- stdio, communication over standard in and standard out(good for local development)
- Streamable HTTP

To use the inspector:
For stdio:
`npx @modelcontextprotocol/inspector npx ts-node ./src/index.ts`

For HTTP:
`npx @modelcontextprotocol/inspector http://localhost:3000`

For local server:
`npm run start`

For Docker build:
`docker -D build -t mcp-server-demo:latest .`

For Docker run:
`docker run -p 3000:3000 mcp-server-demo`
