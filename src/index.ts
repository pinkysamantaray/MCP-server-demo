import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

/**
 * Initializes and starts a basic MCP server.
 * This server will expose a single tool: a simple greeting function.
 * The server uses the StdioServerTransport, which is great for local testing
 * as it communicates via standard input/output.
 */
async function startServer() {
  // Create a new MCP server instance.
  // The name and version are required for protocol compliance.
  const server = new McpServer({
    name: 'mcp-demo-server',
    version: '1.0.0',
  });

  // Define a "tool" for the server. Tools are actions an AI can perform.
  // In this case, our tool is a simple greeting.
  server.tool(
    'greetUser', // The name of the tool, used by the AI to call it.
    {
      // We use Zod to define the input schema for our tool.
      // The AI will be able to provide a 'name' as a string.
      name: z.string().describe('The name of the user to greet.'),
    },
    async ({ name }) => {
      // This is the handler function for the tool.
      // It receives the validated arguments (in this case, 'name').
      console.log(`Tool 'greetUser' called with name: ${name}`);

      // We return the response as structured content.
      // This is how the server sends a message back to the client/AI.
      return {
        content: [
          {
            type: 'text',
            text: `Hello, ${name}! Welcome to the MCP demo.`,
          },
        ],
      };
    }
  );

  // Define a "tool" for the server. Tools are actions an AI can perform.
  // In this case, our tool is to send a random auth token.
  server.tool('sendAuthToken', {}, async () => {
    const token = Math.random().toString(36).substring(2);
    console.log(`Tool 'sendAuthToken' called, generated token: ${token}`);
    return {
      content: [
        {
          type: 'text',
          text: `Your authentication token is: ${token}`,
        },
      ],
    };
  });

  // Define a "tool" for the server. Tools are actions an AI can perform.
  // In this case, our tool is to get the sender's address.
  server.tool(
    'getSenderAddress', // The name of the tool, used by the AI to call it.
    {
      // We use Zod to define the input schema for our tool.
      // The AI will be able to provide a 'address' as a string.
      address: z.string().describe('The postcode of the sender.'),
    },
    async ({ address }) => {
      // This is the handler function for the tool.
      // It receives the validated arguments (in this case, 'address').
      console.log(`Tool 'getSenderAddress' called with address: ${address}`);

      // We return the response as structured content.
      // This is how the server sends a message back to the client/AI.
      return {
        content: [
          {
            type: 'text',
            text: `The address of the sender is: ${address}, NL.`,
          },
        ],
      };
    }
  );

  // Define a "resource" for the server. Resources are read-only data endpoints.
  // We'll create a simple resource for the server's status.
  server.resource('serverStatus', 'status://server', async () => {
    return {
      contents: [
        {
          uri: 'status://server',
          text: `Server is running and operational.`,
        },
      ],
    };
  });

  // Create a transport to handle communication. StdioServerTransport
  // uses standard input and output, making it easy to test from the command line.
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// Start the server.
startServer().catch(console.error);
