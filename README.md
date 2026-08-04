# mcp-klaviyo

Klaviyo MCP Pack — wraps the Klaviyo API for email marketing

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `klaviyo_list_profiles` | Search contacts by email, name, or custom attributes. Returns profile IDs, emails, names, and properties with pagination support. |
| `klaviyo_get_profile` | Get a contact's full profile by ID. Returns email, name, phone, custom properties, list memberships, and subscription status. |
| `klaviyo_list_lists` | Get all email lists in your account. Returns list IDs, names, subscriber counts, and creation dates. |
| `klaviyo_list_campaigns` | Search campaigns by status (draft, scheduled, sent). Returns campaign IDs, names, status, send dates, and performance metrics. |
| `klaviyo_get_campaign` | Get a campaign's full details by ID. Returns name, status, subject line, recipient list, performance stats, and send history. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "klaviyo": {
      "url": "https://gateway.pipeworx.io/klaviyo/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Klaviyo data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
