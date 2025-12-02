# 2.1 ROS 2 Architecture

## Learning Objectives

By the end of this section, you will be able to:
- Understand the ROS 2 architecture and its key components
- Explain the role of DDS middleware in ROS 2
- Compare ROS 2 with ROS 1 and understand the improvements
- Describe the ROS 2 graph and node discovery mechanism
- Configure Quality of Service (QoS) policies for reliable communication

---

## Introduction

**ROS 2 (Robot Operating System 2)** is not an operating system in the traditional sense—it's a middleware framework that provides libraries, tools, and conventions for building complex robot software. Think of it as the "nervous system" that connects sensors, actuators, and intelligence in a robot.

This section introduces the architecture of ROS 2, focusing on the fundamental design decisions that make it suitable for production robotics, from research labs to commercial humanoid robots.

---

## Why ROS 2?

### The Evolution from ROS 1

ROS 1 (released in 2007) revolutionized robotics research but had limitations for production systems:

| Limitation | ROS 1 | ROS 2 |
|------------|-------|-------|
| **Single Point of Failure** | roscore (master) required | Distributed discovery (no master) |
| **Real-Time Support** | Limited | Built-in DDS with real-time capabilities |
| **Multi-Robot** | Difficult | Native support via DDS |
| **Security** | None | DDS Security (SROS2) |
| **Platform Support** | Linux-focused | Linux, Windows, macOS, RTOS |
| **Communication** | Custom TCPROS/UDPROS | Industry-standard DDS |

**Key Insight**: ROS 2 was designed from the ground up for **production robotics**, not just research.

---

## ROS 2 Architecture Overview

### The ROS 2 Graph

At its core, ROS 2 is a **graph of nodes** that communicate via **topics**, **services**, and **actions**.

```
┌─────────────┐         Topic: /cmd_vel          ┌─────────────┐
│   Planner   │────────────────────────────────▶│   Motor     │
│    Node     │                                  │  Controller │
└─────────────┘                                  └─────────────┘
       │                                                 │
       │ Service: /get_plan                             │
       │                                                 │
       ▼                                                 ▼
┌─────────────┐         Topic: /odom            ┌─────────────┐
│  Localization│◀────────────────────────────────│   Sensors   │
│    Node     │                                  │    Node     │
└─────────────┘                                  └─────────────┘
```

**Components**:
- **Nodes**: Independent processes that perform computation
- **Topics**: Asynchronous, many-to-many data streams
- **Services**: Synchronous, request-reply interactions
- **Actions**: Long-running tasks with feedback and cancellation

---

## DDS: The Middleware Layer

### What is DDS?

**DDS (Data Distribution Service)** is an industry-standard middleware for real-time, distributed systems. ROS 2 uses DDS as its communication layer, replacing the custom protocols of ROS 1.

**Why DDS?**
- **Proven Technology**: Used in aerospace, defense, and automotive industries
- **Real-Time**: Deterministic communication with QoS guarantees
- **Scalable**: Supports thousands of nodes across networks
- **Interoperable**: Multiple vendor implementations (Fast DDS, Cyclone DDS, RTI Connext)

### DDS Vendors in ROS 2 Humble

ROS 2 Humble supports multiple DDS implementations:

| DDS Vendor | Default? | License | Best For |
|------------|----------|---------|----------|
| **Fast DDS** (eProsima) | ✅ Yes | Apache 2.0 | General use, education |
| **Cyclone DDS** (Eclipse) | No | EPL 2.0 | Performance, embedded |
| **RTI Connext DDS** | No | Commercial | Industrial, safety-critical |
| **GurumDDS** | No | Commercial | Automotive |

**For this course**: We use **Fast DDS** (the default).

### How DDS Works

1. **Discovery**: Nodes automatically discover each other on the network (no master required)
2. **Matching**: Publishers and subscribers with matching topics/types connect
3. **Data Exchange**: Messages flow directly between nodes (peer-to-peer)
4. **QoS Enforcement**: DDS ensures reliability, latency, and bandwidth requirements

---

## Quality of Service (QoS)

QoS policies define **how** data is transmitted, allowing fine-grained control over reliability, latency, and resource usage.

### Key QoS Policies

#### 1. **Reliability**
- **Reliable**: Guarantees message delivery (TCP-like)
  - Use for: Commands, critical data
- **Best Effort**: No delivery guarantee (UDP-like)
  - Use for: Sensor streams where latest data matters

#### 2. **Durability**
- **Transient Local**: Late-joining subscribers receive last message
  - Use for: Configuration, map data
- **Volatile**: Only live data (default)
  - Use for: Real-time sensor streams

#### 3. **History**
- **Keep Last (N)**: Store last N messages
- **Keep All**: Store all messages (until resource limits)

#### 4. **Deadline**
- Maximum time between messages
- Triggers callback if violated

### QoS Profiles

ROS 2 provides preset profiles:

```python
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy

# Sensor data (best effort, volatile)
sensor_qos = QoSProfile(
    reliability=ReliabilityPolicy.BEST_EFFORT,
    durability=DurabilityPolicy.VOLATILE,
    depth=10
)

# System state (reliable, transient local)
system_qos = QoSProfile(
    reliability=ReliabilityPolicy.RELIABLE,
    durability=DurabilityPolicy.TRANSIENT_LOCAL,
    depth=10
)
```

---

## ROS 2 vs ROS 1: Key Differences

### Architecture

**ROS 1**:
```
All Nodes ──▶ roscore (Master) ◀── All Nodes
              Single Point of Failure
```

**ROS 2**:
```
Node A ◀──▶ DDS Discovery ◀──▶ Node B
Node C ◀──▶ DDS Discovery ◀──▶ Node D
        Distributed, No Master
```

### Communication

| Feature | ROS 1 | ROS 2 |
|---------|-------|-------|
| **Protocol** | Custom TCPROS/UDPROS | DDS (RTPS) |
| **Discovery** | Centralized (roscore) | Distributed (DDS) |
| **Real-Time** | No | Yes (with DDS) |
| **QoS** | Limited | Extensive |
| **Security** | None | DDS Security |

### Lifecycle Management

ROS 2 introduces **managed nodes** with explicit lifecycle states:

```
┌──────────┐
│Unconfigured│
└─────┬──────┘
      │ configure()
      ▼
┌──────────┐
│ Inactive │
└─────┬──────┘
      │ activate()
      ▼
┌──────────┐
│  Active  │
└─────┬──────┘
      │ deactivate()
      ▼
┌──────────┐
│ Inactive │
└──────────┘
```

This allows deterministic startup/shutdown, crucial for safety-critical systems.

---

## ROS 2 Distributions

ROS 2 follows a **time-based release schedule** with LTS (Long-Term Support) versions:

| Distribution | Release Date | Support Until | Python | Ubuntu |
|--------------|--------------|---------------|--------|--------|
| **Humble Hawksbill** | May 2022 | May 2027 | 3.10 | 22.04 |
| Jazzy Jalisco | May 2024 | May 2026 | 3.12 | 24.04 |
| Kilted Kaiju | May 2025 | TBD | 3.12+ | 24.04 |

**For this course**: We use **ROS 2 Humble** (LTS).

---

## Key Takeaways

✅ **ROS 2** is a middleware framework for building robot software, not an OS

✅ **DDS** provides industry-standard, real-time communication (replacing ROS 1's custom protocols)

✅ **No Master**: Distributed discovery eliminates single point of failure

✅ **QoS Policies**: Fine-grained control over reliability, latency, and durability

✅ **Production-Ready**: Designed for commercial robots, not just research

✅ **Humble Hawksbill**: LTS version supported until 2027

---

## Reflection Questions

1. Why is the elimination of the roscore master a significant improvement in ROS 2?
2. In what scenarios would you use "Best Effort" reliability vs. "Reliable"?
3. How does DDS enable multi-robot systems more easily than ROS 1?
4. What are the trade-offs between different DDS vendors?

---

## Further Reading

- **ROS 2 Design**: [design.ros2.org](https://design.ros2.org)
- **DDS Specification**: [OMG DDS](https://www.omg.org/spec/DDS/)
- **ROS 2 Humble Documentation**: [docs.ros.org/en/humble](https://docs.ros.org/en/humble/)
- **Fast DDS Documentation**: [fast-dds.docs.eprosima.com](https://fast-dds.docs.eprosima.com)

---

**Previous Chapter**: [← Chapter 1: Introduction to Physical AI](../01-intro/sensor-systems.md)  
**Next Section**: [2.2 Nodes and Communication →](./nodes-communication.md)
