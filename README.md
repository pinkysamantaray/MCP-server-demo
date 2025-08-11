## MCP uses two types of communications:

The protocol currently defines two standard transport mechanisms for client-server communication:

- stdio, communication over standard in and standard out(good for local development)
- Streamable HTTP

## To Inspect MCP Server:

start the local server:
`npm run start:watch`

You can check with Postman.

You can also use the inspector.
For stdio:
`npx @modelcontextprotocol/inspector npx ts-node ./src/index.ts`

For HTTP:
`npx @modelcontextprotocol/inspector`

## Docker Hub and Render

`docker buildx build --platform linux/amd64,linux/arm64 -t pinkysamantaray/mcp-server-demo:latest .`
`docker run --name mcp-server-demo -d -p 3001:3000 pinkysamantaray/mcp-server-demo`

Docker push to dockerhub
`docker push pinkysamantaray/mcp-server-demo`

## Azure

Azure (ACR) Docker >
`docker buildx build --platform linux/amd64,linux/arm64 -t postnlmcp.azurecr.io/mcp-server-demo:latest .`

`az login`
`az acr login --name postnlmcp`
`docker push postnlmcp.azurecr.io/mcp-server-demo`

## Steps to follow in case of a new commit:

git commit > docker build > docker push > render deploy

## Other details:

For this demo project, we have used PokeAPI(https://pokeapi.co/docs/v2)
