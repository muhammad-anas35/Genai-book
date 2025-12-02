# 3.3 URDF and Robot Description

## Learning Objectives

By the end of this section, you will be able to:
- Understand URDF (Unified Robot Description Format)
- Create robot models with links and joints
- Define visual, collision, and inertial properties
- Convert URDF to SDF for Gazebo
- Use Xacro for modular robot descriptions

---

## Introduction

**URDF (Unified Robot Description Format)** is the standard XML format for describing robot kinematics and dynamics in ROS. It defines:
- **Links**: Rigid bodies (torso, legs, arms)
- **Joints**: Connections between links (revolute, prismatic, fixed)
- **Sensors**: Cameras, LiDAR, IMUs
- **Visual/Collision**: Meshes and shapes

This section teaches you how to create URDF models for humanoid robots.

---

## URDF Basics

### Minimal Robot Example

**simple_robot.urdf**:
```xml
<?xml version="1.0"?>
<robot name="simple_robot">
  <!-- Base link -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.6 0.4 0.2"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 0.8 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.6 0.4 0.2"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="10.0"/>
      <inertia ixx="0.4" ixy="0.0" ixz="0.0"
               iyy="0.6" iyz="0.0" izz="0.8"/>
    </inertial>
  </link>
  
  <!-- Wheel link -->
  <link name="wheel_left">
    <visual>
      <geometry>
        <cylinder radius="0.1" length="0.05"/>
      </geometry>
      <material name="black">
        <color rgba="0 0 0 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.1" length="0.05"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.5"/>
      <inertia ixx="0.001" ixy="0.0" ixz="0.0"
               iyy="0.001" iyz="0.0" izz="0.001"/>
    </inertial>
  </link>
  
  <!-- Joint connecting base to wheel -->
  <joint name="base_to_wheel_left" type="continuous">
    <parent link="base_link"/>
    <child link="wheel_left"/>
    <origin xyz="0 0.25 0" rpy="1.5708 0 0"/>
    <axis xyz="0 0 1"/>
  </joint>
</robot>
```

---

## Links: Robot Parts

### Link Components

Every link has three optional elements:

#### 1. **Visual** (Appearance)
```xml
<visual>
  <origin xyz="0 0 0" rpy="0 0 0"/>
  <geometry>
    <box size="1 1 1"/>
    <!-- OR -->
    <cylinder radius="0.5" length="1"/>
    <!-- OR -->
    <sphere radius="0.5"/>
    <!-- OR -->
    <mesh filename="package://my_robot/meshes/part.dae" scale="1 1 1"/>
  </geometry>
  <material name="red">
    <color rgba="1 0 0 1"/>
  </material>
</visual>
```

#### 2. **Collision** (Physics)
```xml
<collision>
  <origin xyz="0 0 0" rpy="0 0 0"/>
  <geometry>
    <!-- Simplified geometry for faster collision detection -->
    <box size="1 1 1"/>
  </geometry>
</collision>
```

**Best Practice**: Use simplified collision shapes (boxes, cylinders) instead of complex meshes for performance.

#### 3. **Inertial** (Dynamics)
```xml
<inertial>
  <origin xyz="0 0 0" rpy="0 0 0"/>
  <mass value="10.0"/>
  <inertia ixx="1.0" ixy="0.0" ixz="0.0"
           iyy="1.0" iyz="0.0" izz="1.0"/>
</inertial>
```

**Calculating Inertia** (for a box):
```
ixx = (1/12) * mass * (height² + depth²)
iyy = (1/12) * mass * (width² + depth²)
izz = (1/12) * mass * (width² + height²)
```

---

## Joints: Connecting Links

### Joint Types

| Type | Description | Use Case |
|------|-------------|----------|
| **revolute** | Rotates around axis (limited range) | Knee, elbow |
| **continuous** | Rotates around axis (unlimited) | Wheels |
| **prismatic** | Slides along axis | Telescoping arm |
| **fixed** | No movement | Sensor mounts |
| **planar** | Moves in a plane | Rarely used |
| **floating** | 6-DOF (position + orientation) | Base of humanoid |

### Revolute Joint Example

```xml
<joint name="knee_joint" type="revolute">
  <parent link="thigh"/>
  <child link="shin"/>
  <origin xyz="0 0 -0.5" rpy="0 0 0"/>
  <axis xyz="0 1 0"/>
  <limit lower="-2.0" upper="0.0" effort="100" velocity="10"/>
  <dynamics damping="0.7" friction="0.0"/>
</joint>
```

**Parameters**:
- `lower/upper`: Joint limits (radians)
- `effort`: Maximum torque (N·m)
- `velocity`: Maximum speed (rad/s)
- `damping`: Joint damping coefficient
- `friction`: Joint friction

---

## Humanoid Leg Example

### Simple Biped Leg

```xml
<?xml version="1.0"?>
<robot name="humanoid_leg">
  <!-- Hip link -->
  <link name="hip">
    <visual>
      <geometry>
        <box size="0.2 0.3 0.1"/>
      </geometry>
      <material name="gray">
        <color rgba="0.5 0.5 0.5 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.2 0.3 0.1"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="5.0"/>
      <inertia ixx="0.05" ixy="0" ixz="0"
               iyy="0.04" iyz="0" izz="0.04"/>
    </inertial>
  </link>
  
  <!-- Thigh link -->
  <link name="thigh">
    <visual>
      <origin xyz="0 0 -0.25" rpy="0 0 0"/>
      <geometry>
        <cylinder radius="0.05" length="0.5"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 0.8 1"/>
      </material>
    </visual>
    <collision>
      <origin xyz="0 0 -0.25" rpy="0 0 0"/>
      <geometry>
        <cylinder radius="0.05" length="0.5"/>
      </geometry>
    </collision>
    <inertial>
      <origin xyz="0 0 -0.25" rpy="0 0 0"/>
      <mass value="3.0"/>
      <inertia ixx="0.06" ixy="0" ixz="0"
               iyy="0.06" iyz="0" izz="0.001"/>
    </inertial>
  </link>
  
  <!-- Hip joint -->
  <joint name="hip_joint" type="revolute">
    <parent link="hip"/>
    <child link="thigh"/>
    <origin xyz="0 0 -0.05" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" effort="150" velocity="5"/>
    <dynamics damping="1.0"/>
  </joint>
  
  <!-- Shin link -->
  <link name="shin">
    <visual>
      <origin xyz="0 0 -0.25" rpy="0 0 0"/>
      <geometry>
        <cylinder radius="0.04" length="0.5"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 0.8 1"/>
      </material>
    </visual>
    <collision>
      <origin xyz="0 0 -0.25" rpy="0 0 0"/>
      <geometry>
        <cylinder radius="0.04" length="0.5"/>
      </geometry>
    </collision>
    <inertial>
      <origin xyz="0 0 -0.25" rpy="0 0 0"/>
      <mass value="2.0"/>
      <inertia ixx="0.04" ixy="0" ixz="0"
               iyy="0.04" iyz="0" izz="0.001"/>
    </inertial>
  </link>
  
  <!-- Knee joint -->
  <joint name="knee_joint" type="revolute">
    <parent link="thigh"/>
    <child link="shin"/>
    <origin xyz="0 0 -0.5" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-2.0" upper="0.0" effort="100" velocity="5"/>
    <dynamics damping="0.7"/>
  </joint>
  
  <!-- Foot link -->
  <link name="foot">
    <visual>
      <origin xyz="0.05 0 0" rpy="0 0 0"/>
      <geometry>
        <box size="0.2 0.1 0.05"/>
      </geometry>
      <material name="black">
        <color rgba="0 0 0 1"/>
      </material>
    </visual>
    <collision>
      <origin xyz="0.05 0 0" rpy="0 0 0"/>
      <geometry>
        <box size="0.2 0.1 0.05"/>
      </geometry>
    </collision>
    <inertial>
      <origin xyz="0.05 0 0" rpy="0 0 0"/>
      <mass value="0.5"/>
      <inertia ixx="0.001" ixy="0" ixz="0"
               iyy="0.002" iyz="0" izz="0.002"/>
    </inertial>
  </link>
  
  <!-- Ankle joint -->
  <joint name="ankle_joint" type="revolute">
    <parent link="shin"/>
    <child link="foot"/>
    <origin xyz="0 0 -0.5" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-0.5" upper="0.5" effort="50" velocity="5"/>
    <dynamics damping="0.5"/>
  </joint>
</robot>
```

---

## Xacro: Modular URDF

**Xacro** (XML Macros) allows you to create reusable, parameterized robot descriptions.

### Why Xacro?

✅ **Reduce repetition** (define a leg once, use twice)  
✅ **Parameterization** (change dimensions easily)  
✅ **Modularity** (include files)  
✅ **Math expressions** (calculate inertia automatically)

### Xacro Example

**robot.urdf.xacro**:
```xml
<?xml version="1.0"?>
<robot xmlns:xacro="http://www.ros.org/wiki/xacro" name="my_robot">
  <!-- Parameters -->
  <xacro:property name="leg_length" value="0.5"/>
  <xacro:property name="leg_radius" value="0.05"/>
  <xacro:property name="leg_mass" value="3.0"/>
  
  <!-- Macro for a leg -->
  <xacro:macro name="leg" params="prefix reflect">
    <link name="${prefix}_thigh">
      <visual>
        <origin xyz="0 0 -${leg_length/2}" rpy="0 0 0"/>
        <geometry>
          <cylinder radius="${leg_radius}" length="${leg_length}"/>
        </geometry>
      </visual>
      <inertial>
        <mass value="${leg_mass}"/>
        <inertia ixx="${leg_mass * leg_length * leg_length / 12}"
                 iyy="${leg_mass * leg_length * leg_length / 12}"
                 izz="${leg_mass * leg_radius * leg_radius / 2}"
                 ixy="0" ixz="0" iyz="0"/>
      </inertial>
    </link>
    
    <joint name="${prefix}_hip" type="revolute">
      <parent link="base_link"/>
      <child link="${prefix}_thigh"/>
      <origin xyz="0 ${reflect * 0.15} 0" rpy="0 0 0"/>
      <axis xyz="0 1 0"/>
      <limit lower="-1.57" upper="1.57" effort="150" velocity="5"/>
    </joint>
  </xacro:macro>
  
  <!-- Base link -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.4 0.3 0.2"/>
      </geometry>
    </visual>
  </link>
  
  <!-- Instantiate legs -->
  <xacro:leg prefix="left" reflect="1"/>
  <xacro:leg prefix="right" reflect="-1"/>
</robot>
```

### Converting Xacro to URDF

```bash
xacro robot.urdf.xacro > robot.urdf
```

---

## URDF to SDF Conversion

Gazebo uses SDF, but ROS uses URDF. Conversion happens automatically, but you can do it manually:

```bash
gz sdf -p robot.urdf > robot.sdf
```

### Key Differences

| Feature | URDF | SDF |
|---------|------|-----|
| **Format** | ROS-specific | Gazebo-standard |
| **Closed loops** | No | Yes |
| **Multiple robots** | No | Yes |
| **Plugins** | Limited | Extensive |

---

## Visualizing URDF

### In RViz

```bash
# Install joint_state_publisher_gui
sudo apt install ros-humble-joint-state-publisher-gui

# Launch
ros2 launch urdf_tutorial display.launch.py model:=robot.urdf
```

### In Gazebo

```bash
gz sim robot.urdf
```

---

## Key Takeaways

✅ **URDF** is the standard format for robot description in ROS

✅ **Links** define rigid bodies with visual, collision, and inertial properties

✅ **Joints** connect links (revolute, continuous, prismatic, fixed)

✅ **Xacro** enables modular, parameterized robot descriptions

✅ **URDF → SDF** conversion happens automatically in Gazebo

---

## Reflection Questions

1. Why use simplified collision geometries instead of detailed meshes?
2. How would you calculate the inertia tensor for a cylinder?
3. When would you use a `continuous` joint vs. a `revolute` joint?
4. What are the advantages of using Xacro over plain URDF?

---

## Further Reading

- **URDF Tutorial**: [wiki.ros.org/urdf/Tutorials](http://wiki.ros.org/urdf/Tutorials)
- **Xacro Documentation**: [wiki.ros.org/xacro](http://wiki.ros.org/xacro)
- **SDF Format**: [sdformat.org](http://sdformat.org)

---

**Previous Section**: [← 3.2 Creating Worlds and Models](./worlds-models.md)  
**Next Section**: [3.4 Gazebo-ROS 2 Integration →](./gazebo-ros2-integration.md)
