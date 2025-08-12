import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { promises as fs } from 'fs';

const app = express();
app.use(express.json());

// Map to store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// Handle POST requests for client-to-server communication
app.post('/mcp', async (req: express.Request, res: express.Response) => {
  // Check for existing session ID
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    // Reuse existing transport
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    // New initialization request
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        // Store the transport by session ID
        transports[sessionId] = transport;
      },
      // DNS rebinding protection is disabled by default for backwards compatibility. If you are running this server
      // locally, make sure to set:
      // enableDnsRebindingProtection: true,
      // allowedHosts: ['127.0.0.1'],
    });

    // Clean up transport when closed
    transport.onclose = () => {
      if (transport.sessionId) {
        delete transports[transport.sessionId];
      }
    };
    const server = new McpServer({
      name: 'example-server',
      version: '1.0.0',
      description: 'An example MCP server for demonstration purposes.',
      capabilities: {
        streaming: true,
        batching: true,
        logging: {},
        tools: {
          listChanged: true,
        },
        resources: {
          subscribe: true,
          listChanged: true,
        },
      },
    });

    // ... set up server resources, tools, and prompts ...

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

    // We'll create a resource to download a file
    server.resource('downloadFile', 'file:///download', async () => {
      // Import fs/promises at the top of your file:
      // import { promises as fs } from 'fs';
      const filePath = './download/example.txt';
      let fileContent: string;
      try {
        fileContent = await fs.readFile(filePath, 'utf-8');
      } catch (err) {
        return {
          contents: [
            {
              uri: 'file:///download',
              name: 'example.txt',
              title: 'Example Text File',
              mimeType: 'text/plain',
              text: `Error reading file: ${(err as Error).message}`,
            },
          ],
        };
      }
      return {
        contents: [
          {
            uri: 'file:///download',
            name: 'example.txt',
            title: 'Example Text File',
            mimeType: 'text/plain',
            text: fileContent,
          },
        ],
      };
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
      async ({ name }: { name: string }) => {
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

    // Define another tool for fetching Pokémon details
    server.tool(
      'getPokemonDetails', // The name of the tool, used by the AI to call it.
      {
        name: z
          .string()
          .describe('The name of the Pokémon to get details for.'),
      },
      async ({ name }: { name: string }) => {
        console.log(`Tool 'getPokemonDetails' called with name: ${name}`);
        let pokemonDetails: any = null;

        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(
            name.toLowerCase()
          )}`
        );
        if (response.ok) {
          pokemonDetails = await response.json();
        }

        if (!pokemonDetails) {
          return {
            content: [
              {
                type: 'text',
                text: `Pokémon with name '${name}' not found.`,
              },
            ],
          };
        } else {
          const responseObj = (({ types, stats, sprites, name, id }) => ({
            types,
            stats,
            image: sprites?.front_default,
            name,
            id,
          }))(pokemonDetails);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(responseObj),
              },
            ],
          };
        }
      }
    );

    // Define another tool for fetching Pokémon types
    server.tool(
      'getPokemonsPerType', // The name of the tool, used by the AI to call it.
      {
        name: z.string().describe('Type of the Pokémon to get details for.'),
      },
      async ({ name }: { name: string }) => {
        console.log(`Tool 'getPokemonsPerType' called with name: ${name}`);
        let pokemonTypes: any = null;

        const response = await fetch(
          `https://pokeapi.co/api/v2/type/${encodeURIComponent(
            name.toLowerCase()
          )}`
        );
        if (response.ok) {
          pokemonTypes = await response.json();
        }

        if (!pokemonTypes) {
          return {
            content: [
              {
                type: 'text',
                text: `Pokémon with name '${name}' not found.`,
              },
            ],
          };
        } else {
          const responseObj = (({ pokemon }) => ({
            pokemon: pokemon.splice(0, 5),
          }))(pokemonTypes);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(responseObj),
              },
            ],
          };
        }
      }
    );

    // Connect to the MCP server
    await server.connect(transport);
  } else {
    // Invalid request
    res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Bad Request: No valid session ID provided',
      },
      id: null,
    });
    return;
  }

  // Handle the request
  await transport.handleRequest(req, res, req.body);
});

// Reusable handler for GET and DELETE requests
const handleSessionRequest = async (
  req: express.Request,
  res: express.Response
) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }

  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
};

// Add CORS middleware before your MCP routes
app.use(
  cors({
    origin: '*', // Configure appropriately for production, for example:
    // origin: ['https://your-remote-domain.com', 'https://your-other-remote-domain.com'],
    exposedHeaders: ['Mcp-Session-Id'],
    allowedHeaders: ['Content-Type', 'mcp-session-id'],
  })
);

// Handle GET requests for server-to-client notifications via SSE
app.get('/mcp', handleSessionRequest);

// Handle DELETE requests for session termination
app.delete('/mcp', handleSessionRequest);

app.listen(3000);
