# 3.1 Gazebo Architecture

## Learning Objectives

By the end of this section, you will be able to:
- Understand the architecture of modern Gazebo (Fortress/Harmonic)
- Explain the difference between Gazebo Classic and modern Gazebo
- Identify key Gazebo components (physics, rendering, sensors)
- Configure Gazebo for humanoid robot simulation
- Understand the role of simulation in the development workflow

---

## Introduction

Before deploying a humanoid robot in the real world, you need to test your algorithms safely and efficiently. **Gazebo** is the industry-standard 3D robot simulator that allows you to:
- Test navigation algorithms without risking hardware
- Train reinforcement learning policies in accelerated time
- Validate sensor processing pipelines
- Debug control systems in a reproducible environment

This section introduces the architecture of modern Gazebo and its role in the Physical AI development workflow.

---

## Gazebo Classic vs. Modern Gazebo

### The Evolution

| Feature | Gazebo Classic (11) | Modern Gazebo (Fortress/Harmonic) |
|---------|---------------------|-----------------------------------|
| **Status** | EOL (January 2025) | Active (LTS until 2026/2028) |
| **Architecture** | Monolithic | Modular (loosely coupled libraries) |
| **Physics** | ODE (primary) | DART, Bullet, TPE |
| **Rendering** | OGRE 1.x | OGRE 2.x (Ogre-Next) |
| **ROS Integration** | ROS 1 (`gazebo_ros_pkgs`) | ROS 2 (`ros_gz_bridge`) |
| **Graphics** | Basic | Enhanced (PBR, better shadows) |
| **Headless Mode** | Limited | Full EGL support |
| **Python API** | Limited | Native Python interface |

**For this course**: We use **Gazebo Fortress** (LTS until September 2026) or **Gazebo Harmonic** (LTS until September 2028).

### Why the Change?

Gazebo Classic served the robotics community for over a decade, but modern robotics demands required a redesign:
- **Modularity**: Swap physics engines without recompiling
- **Performance**: Better multi-threading and GPU utilization
- **Scalability**: Support for large-scale multi-robot simulations
- **Maintainability**: Cleaner codebase, easier to extend

---

## Gazebo Architecture Overview

### Core Components

Modern Gazebo is built from **modular libraries**, each handling a specific aspect of simulation:

```
┌─────────────────────────────────────────────────┐
│              Gazebo Sim (gz-sim)                │
│         Main simulation orchestrator            │
└──────────┬──────────────────────────────────────┘
           │
           ├──▶ gz-physics    (Physics engines)
           ├──▶ gz-rendering  (3D graphics)
           ├──▶ gz-sensors    (Sensor simulation)
           ├──▶ gz-gui        (User interface)
           ├──▶ gz-transport  (Communication)
           ├──▶ gz-msgs       (Message definitions)
           └──▶ gz-math       (Math utilities)
```

### 1. **gz-sim** (Gazebo Sim)

The main simulation engine that orchestrates all components.

**Key Features**:
- Entity-Component-System (ECS) architecture
- Plugin system for extensibility
- Distributed simulation support
- Headless mode for CI/CD

### 2. **gz-physics**

Abstraction layer for multiple physics engines.

**Supported Engines**:
- **DART** (Default): Fast, stable, good for manipulation
- **Bullet**: Real-time collision detection, rigid body dynamics
- **TPE** (Trivial Physics Engine): Lightweight, for simple scenarios

**Why Multiple Engines?**
- DART: Best for humanoid walking (contact dynamics)
- Bullet: Best for fast collision detection
- TPE: Best for lightweight simulations (drones)

### 3. **gz-rendering**

3D rendering engine with multiple backends.

**Rendering Engines**:
- **OGRE 2.x** (Default): Modern, PBR (Physically Based Rendering)
- **Optix**: NVIDIA ray-tracing (photorealistic)

**Features**:
- Real-time shadows and reflections
- Depth cameras and semantic segmentation
- GPU-accelerated rendering

### 4. **gz-sensors**

Simulates robot sensors with realistic noise models.

**Supported Sensors**:
- **Camera**: RGB, depth, thermal, segmentation
- **LiDAR**: 2D/3D, configurable resolution
- **IMU**: Accelerometer, gyroscope, magnetometer
- **Contact**: Force/torque sensors
- **GPS**: Global positioning
- **Altimeter**: Altitude measurement

### 5. **gz-transport**

Communication layer for inter-process messaging.

**Features**:
- Topic-based pub/sub (like ROS)
- Service calls
- Protobuf messages
- Discovery mechanism

---

## Entity-Component-System (ECS) Architecture

Modern Gazebo uses **ECS**, a design pattern common in game engines.

### Concepts

**Entity**: A unique ID representing an object (robot, sensor, light)
**Component**: Data attached to an entity (pose, velocity, mesh)
**System**: Logic that operates on entities with specific components

### Example: A Humanoid Robot

```
Entity: "Atlas Robot" (ID: 42)
├── Components:
│   ├── Pose (position, orientation)
│   ├── Model (URDF/SDF description)
│   ├── Physics (mass, inertia)
│   ├── Collision (shapes for contact)
│   └── Visual (meshes for rendering)
└── Systems:
    ├── PhysicsSystem (updates pose based on forces)
    ├── RenderingSystem (draws the robot)
    └── SensorSystem (processes camera/LiDAR)
```

**Benefits**:
- **Performance**: Systems process only relevant entities
- **Flexibility**: Add/remove components dynamically
- **Parallelism**: Systems can run concurrently

---

## Gazebo Workflow

### Development Cycle

```
1. Design Robot (URDF/SDF)
   ↓
2. Create World (SDF file)
   ↓
3. Launch Gazebo
   ↓
4. Test Algorithms (ROS 2 nodes)
   ↓
5. Iterate (modify, relaunch)
   ↓
6. Deploy to Real Robot
```

### Simulation Modes

#### 1. **GUI Mode** (Development)
```bash
gz sim world.sdf
```
- Full 3D visualization
- Interactive controls
- Real-time debugging

#### 2. **Headless Mode** (Testing/CI)
```bash
gz sim -s world.sdf
```
- No GUI (faster)
- Ideal for automated testing
- Batch simulations

#### 3. **Accelerated Mode** (Training)
```bash
gz sim --iterations 1000 world.sdf
```
- Run faster than real-time
- Train RL policies quickly
- Requires headless mode

---

## Configuration Files

### SDF (Simulation Description Format)

Gazebo uses **SDF** to describe worlds, models, and robots.

**Example: Simple World**
```xml
<?xml version="1.0" ?>
<sdf version="1.8">
  <world name="humanoid_world">
    <!-- Physics engine -->
    <physics name="dart_physics" type="dart">
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1.0</real_time_factor>
    </physics>
    
    <!-- Lighting -->
    <light type="directional" name="sun">
      <pose>0 0 10 0 0 0</pose>
      <diffuse>1 1 1 1</diffuse>
      <specular>0.5 0.5 0.5 1</specular>
    </light>
    
    <!-- Ground plane -->
    <model name="ground_plane">
      <static>true</static>
      <link name="link">
        <collision name="collision">
          <geometry>
            <plane>
              <normal>0 0 1</normal>
            </plane>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <plane>
              <normal>0 0 1</normal>
              <size>100 100</size>
            </plane>
          </geometry>
        </visual>
      </link>
    </model>
  </world>
</sdf>
```

### Plugin System

Gazebo's functionality is extended via **plugins**.

**Plugin Types**:
- **World Plugins**: Modify world behavior
- **Model Plugins**: Control robot behavior
- **Sensor Plugins**: Process sensor data
- **System Plugins**: Add custom systems

**Example: Simple Model Plugin**
```xml
<model name="my_robot">
  <plugin filename="gz-sim-diff-drive-system"
          name="gz::sim::systems::DiffDrive">
    <left_joint>left_wheel_joint</left_joint>
    <right_joint>right_wheel_joint</right_joint>
    <wheel_separation>0.5</wheel_separation>
    <wheel_radius>0.1</wheel_radius>
  </plugin>
</model>
```

---

## Performance Considerations

### Real-Time Factor (RTF)

**RTF** measures simulation speed relative to real time:
- **RTF = 1.0**: Simulation runs at real-time speed
- **RTF > 1.0**: Faster than real-time (good for training)
- **RTF < 1.0**: Slower than real-time (complex scenes)

**Factors Affecting RTF**:
- Physics engine (DART vs Bullet)
- Number of contacts (humanoid feet on ground)
- Sensor resolution (high-res cameras slow down)
- Rendering quality (shadows, reflections)

### Optimization Tips

✅ **Do**:
- Use headless mode for training (`-s` flag)
- Reduce physics step size only if needed
- Use simplified collision meshes
- Disable unnecessary sensors

❌ **Don't**:
- Run GUI mode for batch simulations
- Use high-res textures unnecessarily
- Enable all visual effects in headless mode

---

## Installation (Ubuntu 22.04)

### Gazebo Fortress (LTS)

```bash
# Add Gazebo repository
sudo sh -c 'echo "deb http://packages.osrfoundation.org/gazebo/ubuntu-stable `lsb_release -cs` main" > /etc/apt/sources.list.d/gazebo-stable.list'
wget https://packages.osrfoundation.org/gazebo.key -O - | sudo apt-key add -

# Install Gazebo Fortress
sudo apt update
sudo apt install gz-fortress

# Verify installation
gz sim --version
```

### Gazebo Harmonic (Newer LTS)

```bash
# Install Gazebo Harmonic
sudo apt update
sudo apt install gz-harmonic

# Verify
gz sim --version
```

---

## Key Takeaways

✅ **Modern Gazebo** (Fortress/Harmonic) replaces Gazebo Classic (EOL 2025)

✅ **Modular Architecture**: Swap physics engines, rendering backends

✅ **ECS Design**: Efficient, flexible, parallelizable

✅ **Multiple Physics Engines**: DART (default), Bullet, TPE

✅ **ROS 2 Integration**: Native support via `ros_gz_bridge`

✅ **Performance**: Headless mode, accelerated time for training

---

## Reflection Questions

1. Why did Gazebo move from a monolithic to a modular architecture?
2. When would you choose DART over Bullet as your physics engine?
3. How does the ECS architecture improve simulation performance?
4. What are the trade-offs between GUI mode and headless mode?

---

## Further Reading

- **Gazebo Documentation**: [gazebosim.org/docs](https://gazebosim.org/docs)
- **Gazebo Fortress**: [gazebosim.org/docs/fortress](https://gazebosim.org/docs/fortress)
- **Migration Guide**: [gazebosim.org/docs/all/migration](https://gazebosim.org/docs/all/migration)
- **SDF Specification**: [sdformat.org/spec](http://sdformat.org/spec)

---

**Previous Chapter**: [← Chapter 2: ROS 2 Fundamentals](../chapter2/launch-parameters.md)  
**Next Section**: [3.2 Creating Worlds and Models →](./worlds-models.md)
