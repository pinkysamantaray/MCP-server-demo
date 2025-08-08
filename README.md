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
`docker buildx build --platform linux/amd64,linux/arm64 -t pinkysamantaray/mcp-server-demo:latest .`

For Docker run:
`docker run --name mcp-server-demo -d -p 3001:3000 pinkysamantaray/mcp-server-demo`

Docker push to dockerhub
`docker push pinkysamantaray/mcp-server-demo`

Steps to follow in case of a new commit:
git commit > docker build > docker push > render deploy
