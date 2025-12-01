# Book RAG Constitution

## Core Principles

### I. Content-First with Docusaurus
This project is foremost a documentation and knowledge-sharing platform. All development must align with and enhance the Docusaurus ecosystem. Content is the core, and the user experience revolves around reading, searching, and interacting with the book's content.

### II. AI-Powered Interactivity
The book will be enhanced with a Retrieval-Augmented Generation (RAG) system.
- **Frontend**: `openai-chatkit` will be used for the chat interface.
- **Backend**: The chat logic will be powered by a Gemini-family model, configured for our specific use case.
- **Vector Search**: Qdrant will be the vector database for finding relevant content chunks.

### III. Robust and Scalable Data Layer
- **Primary Database**: Neon DB (serverless PostgreSQL) will be used for storing user data, authentication information, and other relational data.
- **Vector Database**: Qdrant will store vector embeddings of the book's content for the RAG system.
- **Data Integrity**: All data models must have clear schemas and validation.

### IV. Modern Authentication
User authentication is critical for personalized features. A modern, token-based authentication library (e.g., Lucia Auth, Better Auth) will be implemented to ensure secure and scalable user management.

### V. Modular and Testable Components
All new features, especially the AI and data components, should be developed as modular, independently testable units. This includes:
- Clear separation between the Docusaurus frontend, the chat components, and the backend services.
- Unit and integration tests for all backend services, especially the RAG pipeline.

### VI. Spec-Driven Development
This project follows the Spec-Driven Development (SDD) methodology. All new features must go through the `/sp.specify`, `/sp.plan`, and `/sp.tasks` workflow before implementation.

## Development Workflow

- **Specification (`/sp.specify`)**: All features begin with a clear specification.
- **Planning (`/sp.plan`)**: A detailed technical plan must be created, considering the tech stack (Docusaurus, Neon, Qdrant, Gemini).
- **Tasking (`/sp.tasks`)**: The plan is broken down into actionable tasks.
- **Implementation (`/sp.implement`)**: Implementation follows the generated tasks.
- **Committing (`/sp.git.commit_pr`)**: All work is committed with clear, conventional commit messages and associated with a pull request.

## Governance

This constitution is the source of truth for the project's architecture and development practices. Any deviation must be discussed and documented in an Architecture Decision Record (ADR) using the `/sp.adr` command.

**Version**: 1.0.0 | **Ratified**: 2025-12-02 | **Last Amended**: 2025-12-02