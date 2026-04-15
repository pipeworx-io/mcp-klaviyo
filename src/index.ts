interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Klaviyo MCP Pack — wraps the Klaviyo API for email marketing
 *
 * BYO key: pass _apiKey (Klaviyo private API key).
 * Auth: Klaviyo-API-Key header + revision header.
 * Tools: list/get profiles, list lists, list/get campaigns.
 */


const API = 'https://a.klaviyo.com/api';
const REVISION = '2024-10-15';

function headers(apiKey: string): Record<string, string> {
  return {
    Authorization: `Klaviyo-API-Key ${apiKey}`,
    revision: REVISION,
    Accept: 'application/json',
  };
}

async function klaviyoGet(apiKey: string, path: string, params?: URLSearchParams): Promise<unknown> {
  const qs = params?.toString();
  const url = `${API}${path}${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, { headers: headers(apiKey) });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Klaviyo API error (${res.status}): ${text}`);
  }
  return res.json();
}

// -- Tool definitions --------------------------------------------------------

const tools: McpToolExport['tools'] = [
  {
    name: 'klaviyo_list_profiles',
    description:
      'List profiles (contacts) from Klaviyo. Supports optional filtering and page size.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Klaviyo private API key' },
        filter: {
          type: 'string',
          description: 'Filter string in Klaviyo filter syntax (e.g., "equals(email,\\"user@example.com\\")")',
        },
        page_size: {
          type: 'number',
          description: 'Number of profiles per page (default 20, max 100)',
        },
      },
      required: ['_apiKey'],
    },
  },
  {
    name: 'klaviyo_get_profile',
    description:
      'Get a single Klaviyo profile by its ID. Returns full profile details.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Klaviyo private API key' },
        profile_id: { type: 'string', description: 'Klaviyo profile ID' },
      },
      required: ['_apiKey', 'profile_id'],
    },
  },
  {
    name: 'klaviyo_list_lists',
    description: 'List all email lists in Klaviyo.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Klaviyo private API key' },
      },
      required: ['_apiKey'],
    },
  },
  {
    name: 'klaviyo_list_campaigns',
    description:
      'List campaigns from Klaviyo. Optionally filter by status (draft, scheduled, sent).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Klaviyo private API key' },
        filter: {
          type: 'string',
          description: 'Filter by status (e.g., "equals(messages.channel,\\"email\\")")',
        },
      },
      required: ['_apiKey'],
    },
  },
  {
    name: 'klaviyo_get_campaign',
    description: 'Get a single Klaviyo campaign by its ID. Returns full campaign details.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Klaviyo private API key' },
        campaign_id: { type: 'string', description: 'Klaviyo campaign ID' },
      },
      required: ['_apiKey', 'campaign_id'],
    },
  },
];

// -- callTool dispatcher -----------------------------------------------------

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = args._apiKey as string | undefined;
  delete args._context;
  delete args._apiKey;

  if (!apiKey) throw new Error('_apiKey is required for Klaviyo API access');

  switch (name) {
    case 'klaviyo_list_profiles': {
      const params = new URLSearchParams();
      if (args.filter) params.set('filter', args.filter as string);
      if (args.page_size) params.set('page[size]', String(Math.min(100, args.page_size as number)));
      return klaviyoGet(apiKey, '/profiles', params);
    }
    case 'klaviyo_get_profile':
      return klaviyoGet(apiKey, `/profiles/${encodeURIComponent(args.profile_id as string)}`);
    case 'klaviyo_list_lists':
      return klaviyoGet(apiKey, '/lists');
    case 'klaviyo_list_campaigns': {
      const params = new URLSearchParams();
      if (args.filter) params.set('filter', args.filter as string);
      return klaviyoGet(apiKey, '/campaigns', params);
    }
    case 'klaviyo_get_campaign':
      return klaviyoGet(apiKey, `/campaigns/${encodeURIComponent(args.campaign_id as string)}`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 10 } } satisfies McpToolExport;
