# 3.2 Creating Worlds and Models

## Learning Objectives

By the end of this section, you will be able to:
- Create custom Gazebo worlds using SDF
- Build and import 3D models for simulation
- Configure physics properties and materials
- Add sensors and plugins to models
- Organize reusable model libraries

---

## Introduction

A **world** in Gazebo is the complete simulation environment—the ground, obstacles, lighting, and physics configuration. **Models** are the objects within that world: robots, furniture, buildings, or any interactive element.

This section teaches you how to create realistic simulation environments for testing humanoid robots.

---

## Creating a Basic World

### Minimal World File

**worlds/empty_world.sdf**:
```xml
<?xml version="1.0" ?>
<sdf version="1.8">
  <world name="empty_world">
    <!-- Physics configuration -->
    <physics name="1ms" type="dart">
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1.0</real_time_factor>
    </physics>
    
    <!-- Plugin for physics engine -->
    <plugin filename="gz-sim-physics-system"
            name="gz::sim::systems::Physics">
    </plugin>
    
    <!-- Plugin for scene rendering -->
    <plugin filename="gz-sim-scene-broadcaster-system"
            name="gz::sim::systems::SceneBroadcaster">
    </plugin>
    
    <!-- Sun light -->
    <light type="directional" name="sun">
      <cast_shadows>true</cast_shadows>
      <pose>0 0 10 0 0 0</pose>
      <diffuse>0.8 0.8 0.8 1</diffuse>
      <specular>0.2 0.2 0.2 1</specular>
      <attenuation>
        <range>1000</range>
      </attenuation>
      <direction>-0.5 0.1 -0.9</direction>
    </light>
    
    <!-- Ground plane -->
    <model name="ground_plane">
      <static>true</static>
      <link name="link">
        <collision name="collision">
          <geometry>
            <plane>
              <normal>0 0 1</normal>
              <size>100 100</size>
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
          <material>
            <ambient>0.8 0.8 0.8 1</ambient>
            <diffuse>0.8 0.8 0.8 1</diffuse>
          </material>
        </visual>
      </link>
    </model>
  </world>
</sdf>
```

**Launch it**:
```bash
gz sim empty_world.sdf
```

---

## Building Custom Models

### Model Structure

```
my_model/
├── model.config       # Metadata
├── model.sdf          # Model description
└── meshes/            # 3D meshes (optional)
    └── model.dae
```

### Simple Box Model

**models/simple_box/model.config**:
```xml
<?xml version="1.0"?>
<model>
  <name>Simple Box</name>
  <version>1.0</version>
  <sdf version="1.8">model.sdf</sdf>
  <author>
    <name>Your Name</name>
    <email>you@example.com</email>
  </author>
  <description>
    A simple box for testing
  </description>
</model>
```

**models/simple_box/model.sdf**:
```xml
<?xml version="1.0" ?>
<sdf version="1.8">
  <model name="simple_box">
    <pose>0 0 0.5 0 0 0</pose>
    <link name="link">
      <!-- Inertial properties -->
      <inertial>
        <mass>1.0</mass>
        <inertia>
          <ixx>0.166667</ixx>
          <ixy>0</ixy>
          <ixz>0</ixz>
          <iyy>0.166667</iyy>
          <iyz>0</iyz>
          <izz>0.166667</izz>
        </inertia>
      </inertial>
      
      <!-- Collision shape -->
      <collision name="collision">
        <geometry>
          <box>
            <size>1 1 1</size>
          </box>
        </geometry>
      </collision>
      
      <!-- Visual appearance -->
      <visual name="visual">
        <geometry>
          <box>
            <size>1 1 1</size>
          </box>
        </geometry>
        <material>
          <ambient>1 0 0 1</ambient>
          <diffuse>1 0 0 1</diffuse>
          <specular>1 0 0 1</specular>
        </material>
      </visual>
    </link>
  </model>
</sdf>
```

### Using the Model

```xml
<!-- In your world file -->
<include>
  <uri>model://simple_box</uri>
  <pose>2 0 0.5 0 0 0</pose>
</include>
```

---

## Advanced World Features

### Multiple Lights

```xml
<!-- Ambient light -->
<light type="ambient" name="ambient">
  <diffuse>0.4 0.4 0.4 1</diffuse>
</light>

<!-- Point light -->
<light type="point" name="point_light">
  <pose>0 0 5 0 0 0</pose>
  <diffuse>0.5 0.5 0.5 1</diffuse>
  <specular>0.1 0.1 0.1 1</specular>
  <attenuation>
    <range>20</range>
    <linear>0.01</linear>
    <constant>0.5</constant>
    <quadratic>0.001</quadratic>
  </attenuation>
  <cast_shadows>false</cast_shadows>
</light>

<!-- Spot light -->
<light type="spot" name="spot_light">
  <pose>5 5 5 0 0 0</pose>
  <diffuse>0.8 0.8 0.8 1</diffuse>
  <direction>-1 -1 -1</direction>
  <spot>
    <inner_angle>0.6</inner_angle>
    <outer_angle>1.0</outer_angle>
    <falloff>1.0</falloff>
  </spot>
</light>
```

### Physics Configuration

```xml
<physics name="fast_physics" type="dart">
  <!-- Time step (smaller = more accurate, slower) -->
  <max_step_size>0.001</max_step_size>
  
  <!-- Real-time factor (1.0 = real-time) -->
  <real_time_factor>1.0</real_time_factor>
  
  <!-- Solver iterations (more = stable, slower) -->
  <solver>
    <iterations>50</iterations>
  </solver>
  
  <!-- Gravity -->
  <gravity>0 0 -9.81</gravity>
</physics>
```

### Contact Properties

```xml
<collision name="collision">
  <geometry>
    <box><size>1 1 1</size></box>
  </geometry>
  <surface>
    <friction>
      <ode>
        <mu>1.0</mu>      <!-- Friction coefficient -->
        <mu2>1.0</mu2>
      </ode>
    </friction>
    <contact>
      <ode>
        <kp>1e6</kp>      <!-- Contact stiffness -->
        <kd>100</kd>      <!-- Contact damping -->
      </ode>
    </contact>
  </surface>
</collision>
```

---

## Humanoid Test Environment

### Complete World Example

**worlds/humanoid_test.sdf**:
```xml
<?xml version="1.0" ?>
<sdf version="1.8">
  <world name="humanoid_test">
    <physics name="dart_physics" type="dart">
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1.0</real_time_factor>
    </physics>
    
    <plugin filename="gz-sim-physics-system"
            name="gz::sim::systems::Physics"/>
    <plugin filename="gz-sim-scene-broadcaster-system"
            name="gz::sim::systems::SceneBroadcaster"/>
    <plugin filename="gz-sim-user-commands-system"
            name="gz::sim::systems::UserCommands"/>
    
    <!-- Lighting -->
    <light type="directional" name="sun">
      <cast_shadows>true</cast_shadows>
      <pose>0 0 10 0 0 0</pose>
      <diffuse>0.8 0.8 0.8 1</diffuse>
      <specular>0.2 0.2 0.2 1</specular>
      <direction>-0.5 0.1 -0.9</direction>
    </light>
    
    <!-- Ground with texture -->
    <model name="ground_plane">
      <static>true</static>
      <link name="link">
        <collision name="collision">
          <geometry>
            <plane>
              <normal>0 0 1</normal>
              <size>100 100</size>
            </plane>
          </geometry>
          <surface>
            <friction>
              <ode>
                <mu>100</mu>
                <mu2>50</mu2>
              </ode>
            </friction>
          </surface>
        </collision>
        <visual name="visual">
          <geometry>
            <plane>
              <normal>0 0 1</normal>
              <size>100 100</size>
            </plane>
          </geometry>
          <material>
            <ambient>0.5 0.5 0.5 1</ambient>
            <diffuse>0.8 0.8 0.8 1</diffuse>
          </material>
        </visual>
      </link>
    </model>
    
    <!-- Obstacles for testing -->
    <model name="box_obstacle">
      <pose>3 0 0.5 0 0 0</pose>
      <static>false</static>
      <link name="link">
        <inertial>
          <mass>10.0</mass>
        </inertial>
        <collision name="collision">
          <geometry>
            <box><size>1 1 1</size></box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <box><size>1 1 1</size></box>
          </geometry>
          <material>
            <ambient>0.7 0.3 0.3 1</ambient>
            <diffuse>0.9 0.3 0.3 1</diffuse>
          </material>
        </visual>
      </link>
    </model>
    
    <!-- Stairs for locomotion testing -->
    <model name="stairs">
      <static>true</static>
      <pose>5 0 0 0 0 0</pose>
      <link name="step1">
        <pose>0 0 0.1 0 0 0</pose>
        <collision name="collision">
          <geometry>
            <box><size>1 2 0.2</size></box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <box><size>1 2 0.2</size></box>
          </geometry>
        </visual>
      </link>
      <link name="step2">
        <pose>1 0 0.3 0 0 0</pose>
        <collision name="collision">
          <geometry>
            <box><size>1 2 0.2</size></box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <box><size>1 2 0.2</size></box>
          </geometry>
        </visual>
      </link>
    </model>
  </world>
</sdf>
```

---

## Model Libraries

### Setting Model Path

```bash
# Add to ~/.bashrc
export GZ_SIM_RESOURCE_PATH=$GZ_SIM_RESOURCE_PATH:~/my_gazebo_models
```

### Organizing Models

```
~/my_gazebo_models/
├── humanoid_robots/
│   ├── atlas/
│   ├── unitree_g1/
│   └── custom_robot/
├── obstacles/
│   ├── box/
│   ├── cylinder/
│   └── stairs/
└── environments/
    ├── office/
    ├── warehouse/
    └── outdoor/
```

---

## Key Takeaways

✅ **Worlds** define the complete simulation environment (physics, lighting, models)

✅ **Models** are reusable objects with collision, visual, and inertial properties

✅ **SDF** is the standard format for describing worlds and models

✅ **Physics configuration** affects simulation accuracy and speed

✅ **Model libraries** enable code reuse across projects

---

## Reflection Questions

1. Why separate collision and visual geometries?
2. How does `max_step_size` affect simulation accuracy and speed?
3. When would you use a static vs. dynamic model?
4. How would you create a realistic indoor environment for humanoid testing?

---

## Further Reading

- **SDF Specification**: [sdformat.org/spec](http://sdformat.org/spec)
- **Gazebo Fuel Models**: [app.gazebosim.org/fuel/models](https://app.gazebosim.org/fuel/models)
- **Building Editor**: [gazebosim.org/docs/fortress/building_editor](https://gazebosim.org/docs/fortress/building_editor)

---

**Previous Section**: [← 3.1 Gazebo Architecture](./gazebo-architecture.md)  
**Next Section**: [3.3 URDF and Robot Description →](./urdf-robot-description.md)
