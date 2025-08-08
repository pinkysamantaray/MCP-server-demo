## MCP uses two types of communications:

The protocol currently defines two standard transport mechanisms for client-server communication:

- stdio, communication over standard in and standard out(good for local development)
- Streamable HTTP

To use the inspector:
For stdio:
`npx @modelcontextprotocol/inspector npx ts-node ./src/index.ts`

For HTTP:
`npx @modelcontextprotocol/inspector http://localhost:3000`
