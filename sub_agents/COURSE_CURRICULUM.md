# Course Curriculum - Physical AI & Humanoid Robotics

## Complete Module Breakdown

This document provides the official course curriculum that all content must align with.

### Module 1: The Robotic Nervous System (ROS 2) - Weeks 3-5

**Focus**: Middleware for robot control

**Topics**:
- ROS 2 Nodes, Topics, and Services
- Bridging Python Agents to ROS controllers using rclpy
- Understanding URDF (Unified Robot Description Format) for humanoids
- ROS 2 architecture and core concepts
- Building ROS 2 packages with Python
- Launch files and parameter management

**Chapter Mapping**: Chapter 2

---

### Module 2: The Digital Twin (Gazebo & Unity) - Weeks 6-7

**Focus**: Physics simulation and environment building

**Topics**:
- Simulating physics, gravity, and collisions in Gazebo
- High-fidelity rendering and human-robot interaction in Unity
- Simulating sensors: LiDAR, Depth Cameras, and IMUs
- URDF and SDF robot description formats
- Physics simulation and sensor simulation
- Introduction to Unity for robot visualization

**Chapter Mapping**: Chapter 3

---

### Module 3: The AI-Robot Brain (NVIDIA Isaac™) - Weeks 8-10

**Focus**: Advanced perception and training

**Topics**:
- NVIDIA Isaac Sim: Photorealistic simulation and synthetic data generation
- Isaac ROS: Hardware-accelerated VSLAM (Visual SLAM) and navigation
- Nav2: Path planning for bipedal humanoid movement
- AI-powered perception and manipulation
- Reinforcement learning for robot control
- Sim-to-real transfer techniques

**Chapter Mapping**: Chapter 4

---

### Module 4: Vision-Language-Action (VLA) - Weeks 11-13

**Focus**: The convergence of LLMs and Robotics

**Topics**:
- Voice-to-Action: Using OpenAI Whisper for voice commands
- Cognitive Planning: Using LLMs to translate natural language ("Clean the room") into ROS 2 actions
- Integrating GPT models for conversational AI in robots
- Speech recognition and natural language understanding
- Multi-modal interaction: speech, gesture, vision

**Chapter Mapping**: Chapters 5-6

---

## Weekly Breakdown

### Weeks 1-2: Introduction to Physical AI
- Foundations of Physical AI and embodied intelligence
- From digital AI to robots that understand physical laws
- Overview of humanoid robotics landscape
- Sensor systems: LIDAR, cameras, IMUs, force/torque sensors

**Chapter**: Chapter 1

### Weeks 3-5: ROS 2 Fundamentals
- ROS 2 architecture and core concepts
- Nodes, topics, services, and actions
- Building ROS 2 packages with Python
- Launch files and parameter management

**Chapter**: Chapter 2

### Weeks 6-7: Robot Simulation with Gazebo
- Gazebo simulation environment setup
- URDF and SDF robot description formats
- Physics simulation and sensor simulation
- Introduction to Unity for robot visualization

**Chapter**: Chapter 3

### Weeks 8-10: NVIDIA Isaac Platform
- NVIDIA Isaac SDK and Isaac Sim
- AI-powered perception and manipulation
- Reinforcement learning for robot control
- Sim-to-real transfer techniques

**Chapter**: Chapter 4

### Weeks 11-12: Humanoid Robot Development
- Humanoid robot kinematics and dynamics
- Bipedal locomotion and balance control
- Manipulation and grasping with humanoid hands
- Natural human-robot interaction design

**Chapter**: Chapter 5

### Week 13: Conversational Robotics
- Integrating GPT models for conversational AI in robots
- Speech recognition and natural language understanding
- Multi-modal interaction: speech, gesture, vision

**Chapter**: Chapter 6

---

## Hardware Context

### Required Workstation Specs
- **GPU**: NVIDIA RTX 4070 Ti (12GB VRAM) minimum, RTX 4090 (24GB) ideal
- **CPU**: Intel Core i7 (13th Gen+) or AMD Ryzen 9
- **RAM**: 64 GB DDR5 (32 GB minimum)
- **OS**: Ubuntu 22.04 LTS (mandatory for ROS 2)

### Edge Computing Kit
- **Brain**: NVIDIA Jetson Orin Nano (8GB) - $249
- **Vision**: Intel RealSense D435i - $349
- **Voice**: ReSpeaker USB Mic Array - $69
- **Total**: ~$700

### Robot Options
- **Budget**: Unitree Go2 Edu ($1,800-$3,000) - Quadruped proxy
- **Mid-Range**: Unitree G1 ($16k) - Actual humanoid
- **Premium**: Unitree G1 with full SDK access

---

## Assessments

1. **ROS 2 Package Development Project**
   - Build functional ROS 2 package
   - Demonstrate nodes, topics, services

2. **Gazebo Simulation Implementation**
   - Create robot model in URDF
   - Simulate in Gazebo environment

3. **Isaac-Based Perception Pipeline**
   - Implement VSLAM
   - Use Isaac ROS packages

4. **Capstone: Autonomous Humanoid**
   - Voice command input (Whisper)
   - Path planning (Nav2)
   - Obstacle navigation
   - Object identification (Computer Vision)
   - Object manipulation

---

## Key Technologies

### Software Stack
- **ROS 2**: Humble or Iron (Ubuntu 22.04)
- **Simulation**: Gazebo, NVIDIA Isaac Sim, Unity
- **AI/ML**: NVIDIA Isaac SDK, OpenAI Whisper, GPT models
- **Languages**: Python (rclpy), C++ (performance-critical)
- **Formats**: URDF, SDF, USD (Universal Scene Description)

### Critical Concepts
- **VSLAM**: Visual Simultaneous Localization and Mapping
- **Nav2**: ROS 2 navigation stack
- **Isaac ROS**: Hardware-accelerated perception
- **VLA**: Vision-Language-Action models
- **Sim-to-Real**: Transfer from simulation to physical

---

## Why Physical AI Matters

**Core Insight**: Humanoid robots are poised to excel in our human-centered world because they:
- Share our physical form
- Can be trained with abundant data from human environments
- Represent transition from digital AI to embodied intelligence
- Understand and operate within physical laws

This is a significant shift from AI models confined to digital environments to embodied intelligence that operates in physical space.

---

## Content Alignment Requirements

All textbook content must:
1. Align with the 4-module structure
2. Support the stated learning outcomes
3. Prepare students for the assessments
4. Reference appropriate hardware when relevant
5. Use correct terminology and versions
6. Build progressively across chapters
7. Include practical, hands-on examples

---

**Reference**: This curriculum is based on the official Physical AI & Humanoid Robotics course specification.
