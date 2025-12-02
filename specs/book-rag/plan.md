# Book RAG Project Plan

## 1. Overview

This document outlines the technical plan for creating the Book RAG, an interactive, AI-powered online book. The project will use Docusaurus for the content platform, enhanced with a Retrieval-Augmented Generation (RAG) system to provide an interactive chat experience.

The backend will be powered by a Gemini-family model, with Neon DB as the primary database and Qdrant as the vector database.

## 2. Architecture

The system will have three main components:

1.  **Docusaurus Frontend**: The user-facing website, built with Docusaurus. This will include the book's content and the `openai-chatkit` frontend widget.
2.  **AI/RAG Backend**: A set of serverless functions or a Node.js backend that handles the RAG pipeline. This includes:
    *   An API endpoint to receive user queries from the chat widget.
    *   Logic to query the Qdrant vector database for relevant content chunks.
    *   Integration with a Gemini model to generate answers based on the retrieved content.
3.  **Data Layer**:
    *   **Neon DB (PostgreSQL)**: To store user data, authentication details, chat history, and other relational data.
    *   **Qdrant**: To store vector embeddings of the book's content.

## 3. Technology Stack

-   **Frontend Framework**: Docusaurus
-   **Chat UI**: Custom-built within Docusaurus (using React components)
-   **AI Model**: Gemini family (gemini-pro for chat, embedding-001 for embeddings)
-   **Primary Database**: Neon DB (Serverless PostgreSQL)
-   **Vector Database**: Qdrant
-   **Authentication**: A modern, token-based library (e.g., Lucia Auth, Better Auth)
-   **Backend**: Node.js/TypeScript (likely as serverless functions, e.g., Vercel Functions)
-   **Deployment**: Vercel or a similar platform that supports Docusaurus and serverless functions.

## 4. Phased Implementation

The project will be implemented in the following phases:

### Phase 0: Book Content Creation
- **Goal**: Write the content for the "Physical AI & Humanoid Robotics" textbook.
- **Tasks**:
    - **Chapter 1: Introduction to Physical AI (Weeks 1-2)**
        - Foundations of Physical AI and embodied intelligence.
        - From digital AI to robots that understand physical laws.
        - Overview of humanoid robotics landscape.
        - Sensor systems: LIDAR, cameras, IMUs, force/torque sensors.
    - **Chapter 2: ROS 2 Fundamentals (Weeks 3-5)**
        - ROS 2 architecture and core concepts.
        - Nodes, topics, services, and actions.
        - Building ROS 2 packages with Python.
        - Launch files and parameter management.
    - **Chapter 3: Robot Simulation with Gazebo (Weeks 6-7)**
        - Gazebo simulation environment setup.
        - URDF and SDF robot description formats.
        - Physics simulation and sensor simulation.
        - Introduction to Unity for robot visualization.
    - **Chapter 4: NVIDIA Isaac Platform (Weeks 8-10)**
        - NVIDIA Isaac SDK and Isaac Sim.
        - AI-powered perception and manipulation.
        - Reinforcement learning for robot control.
        - Sim-to-real transfer techniques.
    - **Chapter 5: Humanoid Robot Development (Weeks 11-12)**
        - Humanoid robot kinematics and dynamics.
        - Bipedal locomotion and balance control.
        - Manipulation and grasping with humanoid hands.
        - Natural human-robot interaction design.
    - **Chapter 6: Conversational Robotics (Week 13)**
        - Integrating GPT models for conversational AI in robots.
        - Speech recognition and natural language understanding.
        - Multi-modal interaction: speech, gesture, vision.

### Phase 1: Core Docusaurus Site
- **Goal**: Set up the basic Docusaurus website with the book's content.
- **Tasks**:
    - Initialize the Docusaurus project.
    - Structure the book's content in `.md` and `.mdx` files.
    - Customize the Docusaurus theme and layout.

### Phase 2: Backend and Data Layer Setup
- **Goal**: Set up the databases and the initial backend services.
- **Tasks**:
    - Provision the Neon DB and Qdrant instances.
    - Define the database schemas for user data and vector metadata.
    - Create a simple backend service with a health check endpoint.

### Phase 3: Content Ingestion and Embedding
- **Goal**: Create the pipeline for ingesting and embedding the book's content.
- **Tasks**:
    - Write a script to read the Docusaurus content files.
    - Implement a chunking strategy to split the content into manageable pieces.
    - Use an embedding model to convert the chunks into vectors.
    - Store the vectors and their metadata in Qdrant.

### Phase 4: RAG Pipeline and Chat Integration
- **Goal**: Implement the core RAG functionality and integrate the chat widget.
- **Tasks**:
    - Create the API endpoint to handle user queries.
    - Implement the logic to query Qdrant and retrieve relevant content.
    - Integrate with the Gemini API to generate answers.
    - Add the `openai-chatkit` widget to the Docusaurus frontend.
    - Connect the chat widget to the backend API.

### Phase 5: Authentication and User Features
- **Goal**: Add user authentication and personalized features.
- **Tasks**:
    - Integrate an authentication library.
    - Implement user registration and login.
    - Store chat history in the Neon database, linked to user accounts.
    - Add features like saving conversations or personalizing the user experience.

### Phase 6: Polish and Deployment
- **Goal**: Finalize the application and deploy it to production.
- **Tasks**:
    - Perform thorough testing of the entire system.
    - Optimize the performance of the RAG pipeline.
    - Set up CI/CD for automated deployments.
    - Deploy the application to Vercel or a similar platform.

## 5. Next Steps

The next step is to create a detailed task breakdown for Phase 1 using the `/sp.tasks` command.
