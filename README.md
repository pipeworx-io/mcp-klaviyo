# mcp-klaviyo

Klaviyo MCP Pack — wraps the Klaviyo API for email marketing

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `klaviyo_list_lists` | List all email lists in Klaviyo. |
| `klaviyo_get_campaign` | Get a single Klaviyo campaign by its ID. Returns full campaign details. |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "klaviyo": {
      "url": "https://gateway.pipeworx.io/klaviyo/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use klaviyo
```

## License

MIT
