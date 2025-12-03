# Chapter 2: ROS 2 Fundamentals - Overview

## About This Chapter

This chapter introduces **ROS 2 (Robot Operating System 2)**, the industry-standard middleware for building robotic systems. ROS 2 provides the communication layer, tools, and libraries that enable different components of a robot (sensors, perception, control, actuators) to work together seamlessly.

## Learning Objectives

By the end of this chapter, you will be able to:
- Understand ROS 2 architecture and core concepts (DDS, computational graph)
- Create and configure ROS 2 packages with proper structure
- Work with nodes, topics, services, and actions
- Write Python code to build ROS 2 applications
- Use launch files and parameter management
- Build interconnected robotic systems

## Chapter Structure

### 2.1 ROS 2 Architecture and Core Concepts
- ROS 2 ecosystem and why it exists
- DDS middleware fundamentals
- Quality of Service (QoS) policies
- Computational graph (nodes, topics, services, actions)
- Comparison with ROS 1

### 2.2 Nodes and Communication Patterns  
- Creating your first ROS 2 node
- Publisher/Subscriber pattern (topics)
- Request/Response pattern (services)
- Long-running tasks pattern (actions)
- Custom message types

### 2.3 Building ROS 2 Packages
- Ament build system
- Package structure and organization
- Dependencies and setup
- Writing executable nodes
- Testing and debugging

### 2.4 Launch Files and Parameter Management
- Launch file syntax and structure
- Running multiple coordinated nodes
- Parameter servers and dynamic reconfiguration
- Node composition and namespacing
- Real-world launch file patterns

## Prerequisites

- Familiarity with Python 3.10+
- Ubuntu 22.04 LTS (recommended for ROS 2 Humble)
- Basic command-line skills
- Chapter 1: Introduction to Physical AI

## Key Technologies

| Technology | Version | Role |
|------------|---------|------|
| **ROS 2** | Humble (2022.12) | Core middleware |
| **Python** | 3.10+ | Development language |
| **rclpy** | Latest | Python client library |
| **DDS** | Multiple vendors | Communication |
| **colcon** | Latest | Build system |

## Estimated Time

- **Reading**: 6-8 hours
- **Hands-on Practice**: 8-10 hours  
- **Total**: 14-18 hours

## What You'll Build

In this chapter, you'll create:
1. A simple publisher/subscriber system
2. A service client and server
3. An action server for robot control
4. A complete ROS 2 package
5. A launch file coordinating multiple nodes

All examples will be tested on Unitree G1 specifications and simulatable in Gazebo.

---

**Next**: [2.1 ROS 2 Architecture and Core Concepts](./architecture.md)
