Project Plan and Iteration:

1. Build an API Server with @modelcontextprotocol Typescript SDK(https://github.com/modelcontextprotocol/typescript-sdk)
   a. Start with STDIN for a basic input output(good for local development)
   b. Build Streamable HTTP API afterwards

2. Install the MCP Inspector(https://github.com/modelcontextprotocol/inspector) and inspect the MCP Server. You can also use Postman, Claude Desktop(paid).
   You should be able to view the resources, Tools, Prompts etc. defined in the MCP server.

3. Create a Docker file and deploy to a web service platform(Azure, Render etc.)
   In my case, I created a Docker image and upload to Docker Hub, used that as a source in Render deployment(Manual deployment).
   Drawback with Render is that the free instance will spin down with inactivity, which can delay requests by 50 seconds or more.

4. Integrate the MCP API URL within an Agentic AI tool.
   In our case, Cognigy MCP Tool, we entered the details of the URL endpoint and Test it out.

5. We added the Docker image in Azure with Azure Container Registry(ACR), exposed at port 3000.
   MCP URL: http://mcp-server-demo.gydtbxdfevetghbm.westeurope.azurecontainer.io:3000/

   docker tag pinkysamantaray/mcp-server-demo postnlmcp.azurecr.io/mcp-server-demo
   docker push postnlmcp.azurecr.io/mcp-server-demo
