import { StreamableHttpServerTransport } from '@modelcontextprotocol/sdk/dist/cjs/server/streamableHttp.js';

const transport = new StreamableHttpServerTransport({ port: 3000 });

console.log('transport', transport);
