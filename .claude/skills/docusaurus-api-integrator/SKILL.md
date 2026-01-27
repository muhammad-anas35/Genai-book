---
name: docusaurus-api-integrator
description: |
  Integrates the RAGAI Book Backend API into a Docusaurus site.
  Use when users ask to setup the API, integrate the chat widget, or configure backend connections for the Book RAG project.
allowed-tools: Write, Read, Grep
---

# Docusaurus API Integrator

This skill helps integrate the RAGAI Book Backend API into a Docusaurus documentation site. It automates the creation of the API service, the Chat Widget component, and provides guidance on configuration.

## What This Skill Does
- Creates `src/services/api.js` for backend communication
- Creates `src/components/ChatWidget/index.js` for the UI
- Configures Docusaurus for API integration
- Provides guidance on environment variables and CORS

## What This Skill Does NOT Do
- Modify the backend code
- Deploy the backend server
- Setup the database

---

## Before Implementation

Gather context to ensure successful implementation:

| Source | Gather |
|--------|--------|
| **Codebase** | Check if `src/services` and `src/components` directories exist. |
| **Conversation** | Confirm if the user wants to use the default `localhost:8000` or a deployed URL. |
| **Skill References** | Use `references/integration_guide.md` for specific implementation details. |

Ensure all required context is gathered before implementing.

---

## Workflow

1. **Verify Structure**: Ensure the Docusaurus project structure is standard (`src/` exists).
2. **Create Service**: Copy `assets/api.js` to `src/services/api.js`.
3. **Create Component**: Copy `assets/ChatWidget.js` to `src/components/ChatWidget/index.js`.
4. **Environment Setup**: Advise user on `docusaurus.config.js` `customFields` for API URL if needed.
5. **Usage Guide**: Show how to embed `<ChatWidget />` in markdown.

---

## Reference Files

| File | When to Read |
|------|--------------|
| `references/integration_guide.md` | For detailed API endpoints, payload structures, and troubleshooting. |
| `assets/api.js` | The source code for the API service. |
| `assets/ChatWidget.js` | The source code for the Chat Widget component. |

## Output Checklist
- [ ] `src/services/api.js` created
- [ ] `src/components/ChatWidget/index.js` created
- [ ] User informed about CORS and Environment Variables
