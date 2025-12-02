# 3.4 Gazebo-ROS 2 Integration

## Learning Objectives

By the end of this section, you will be able to:
- Integrate Gazebo simulations with ROS 2
- Use ros_gz_bridge to connect Gazebo and ROS 2 topics
- Add Gazebo plugins to robot models
- Control simulated robots from ROS 2 nodes
- Launch complete simulation environments with ROS 2

---

## Introduction

Gazebo and ROS 2 are powerful individually, but together they enable a complete development workflow:
- **Gazebo**: Realistic physics simulation
- **ROS 2**: Robot control and perception algorithms

This section teaches you how to bridge these two systems using **ros_gz** packages.

---

## The ros_gz Bridge

### What is ros_gz?

**ros_gz** is a collection of packages that connect Gazebo and ROS 2:
- `ros_gz_bridge`: Message translation between Gazebo and ROS 2
- `ros_gz_sim`: Launch Gazebo from ROS 2
- `ros_gz_image`: Image transport
- `ros_gz_interfaces`: Common message types

### Installation

```bash
# Install ros_gz packages
sudo apt install ros-humble-ros-gz

# Verify
ros2 pkg list | grep ros_gz
```

---

## Basic Bridge Example

### Bridging a Topic

**Example**: Bridge a velocity command topic from ROS 2 to Gazebo.

```bash
# Start Gazebo
gz sim empty_world.sdf

# Bridge /cmd_vel topic
ros2 run ros_gz_bridge parameter_bridge /cmd_vel@geometry_msgs/msg/Twist@gz.msgs.Twist
```

**Syntax**:
```
/topic_name@ros_msg_type@gz_msg_type
```

### Bidirectional Bridge

```bash
# Bridge in both directions
ros2 run ros_gz_bridge parameter_bridge \
  /cmd_vel@geometry_msgs/msg/Twist[gz.msgs.Twist \
  /odom@nav_msgs/msg/Odometry]gz.msgs.Odometry
```

**Notation**:
- `[` = ROS 2 → Gazebo (publish to Gazebo)
- `]` = Gazebo → ROS 2 (subscribe from Gazebo)
- `@` = Bidirectional

---

## Gazebo Plugins for ROS 2

### Differential Drive Plugin

Add to your robot's SDF:

```xml
<model name="my_robot">
  <!-- ... links and joints ... -->
  
  <!-- Differential drive plugin -->
  <plugin filename="gz-sim-diff-drive-system"
          name="gz::sim::systems::DiffDrive">
    <!-- Wheel joints -->
    <left_joint>left_wheel_joint</left_joint>
    <right_joint>right_wheel_joint</right_joint>
    
    <!-- Wheel parameters -->
    <wheel_separation>0.5</wheel_separation>
    <wheel_radius>0.1</wheel_radius>
    
    <!-- Odometry -->
    <odom_publish_frequency>50</odom_publish_frequency>
    <topic>/cmd_vel</topic>
    <odom_topic>/odom</odom_topic>
    <frame_id>odom</frame_id>
    <child_frame_id>base_link</child_frame_id>
  </plugin>
</model>
```

### Joint State Publisher Plugin

```xml
<plugin filename="gz-sim-joint-state-publisher-system"
        name="gz::sim::systems::JointStatePublisher">
  <topic>/joint_states</topic>
</plugin>
```

### IMU Sensor Plugin

```xml
<sensor name="imu_sensor" type="imu">
  <always_on>1</always_on>
  <update_rate>100</update_rate>
  <topic>/imu/data</topic>
  <gz_frame_id>imu_link</gz_frame_id>
</sensor>
```

---

## Complete Integration Example

### Robot with ROS 2 Control

**robot.sdf**:
```xml
<?xml version="1.0" ?>
<sdf version="1.8">
  <model name="diff_drive_robot">
    <!-- Base link -->
    <link name="base_link">
      <pose>0 0 0.1 0 0 0</pose>
      <inertial>
        <mass>10.0</mass>
        <inertia>
          <ixx>0.4</ixx>
          <iyy>0.6</iyy>
          <izz>0.8</izz>
        </inertia>
      </inertial>
      <collision name="collision">
        <geometry>
          <box><size>0.6 0.4 0.2</size></box>
        </geometry>
      </collision>
      <visual name="visual">
        <geometry>
          <box><size>0.6 0.4 0.2</size></box>
        </geometry>
        <material>
          <ambient>0 0 0.8 1</ambient>
          <diffuse>0 0 0.8 1</diffuse>
        </material>
      </visual>
    </link>
    
    <!-- Left wheel -->
    <link name="left_wheel">
      <pose>0 0.25 0.1 -1.5708 0 0</pose>
      <inertial>
        <mass>0.5</mass>
        <inertia>
          <ixx>0.001</ixx>
          <iyy>0.001</iyy>
          <izz>0.001</izz>
        </inertia>
      </inertial>
      <collision name="collision">
        <geometry>
          <cylinder>
            <radius>0.1</radius>
            <length>0.05</length>
          </cylinder>
        </geometry>
      </collision>
      <visual name="visual">
        <geometry>
          <cylinder>
            <radius>0.1</radius>
            <length>0.05</length>
          </cylinder>
        </geometry>
        <material>
          <ambient>0 0 0 1</ambient>
          <diffuse>0 0 0 1</diffuse>
        </material>
      </visual>
    </link>
    
    <!-- Right wheel (similar to left) -->
    <link name="right_wheel">
      <pose>0 -0.25 0.1 -1.5708 0 0</pose>
      <!-- ... same as left wheel ... -->
    </link>
    
    <!-- Joints -->
    <joint name="left_wheel_joint" type="revolute">
      <parent>base_link</parent>
      <child>left_wheel</child>
      <axis>
        <xyz>0 0 1</xyz>
      </axis>
    </joint>
    
    <joint name="right_wheel_joint" type="revolute">
      <parent>base_link</parent>
      <child>right_wheel</child>
      <axis>
        <xyz>0 0 1</xyz>
      </axis>
    </joint>
    
    <!-- Plugins -->
    <plugin filename="gz-sim-diff-drive-system"
            name="gz::sim::systems::DiffDrive">
      <left_joint>left_wheel_joint</left_joint>
      <right_joint>right_wheel_joint</right_joint>
      <wheel_separation>0.5</wheel_separation>
      <wheel_radius>0.1</wheel_radius>
      <odom_publish_frequency>50</odom_publish_frequency>
      <topic>/cmd_vel</topic>
      <odom_topic>/odom</odom_topic>
    </plugin>
    
    <plugin filename="gz-sim-joint-state-publisher-system"
            name="gz::sim::systems::JointStatePublisher">
      <topic>/joint_states</topic>
    </plugin>
  </model>
</sdf>
```

---

## Launch File Integration

### Complete Launch File

**launch/sim.launch.py**:
```python
import os
from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.actions import IncludeLaunchDescription, DeclareLaunchArgument
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node

def generate_launch_description():
    pkg_ros_gz_sim = get_package_share_directory('ros_gz_sim')
    pkg_my_robot = get_package_share_directory('my_robot_description')
    
    # Paths
    world_file = os.path.join(pkg_my_robot, 'worlds', 'robot_world.sdf')
    
    # Launch arguments
    use_sim_time = LaunchConfiguration('use_sim_time', default='true')
    
    # Gazebo launch
    gazebo = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(
            os.path.join(pkg_ros_gz_sim, 'launch', 'gz_sim.launch.py')
        ),
        launch_arguments={'gz_args': f'-r {world_file}'}.items()
    )
    
    # Bridge
    bridge = Node(
        package='ros_gz_bridge',
        executable='parameter_bridge',
        arguments=[
            '/cmd_vel@geometry_msgs/msg/Twist@gz.msgs.Twist',
            '/odom@nav_msgs/msg/Odometry@gz.msgs.Odometry',
            '/joint_states@sensor_msgs/msg/JointState@gz.msgs.Model',
            '/imu/data@sensor_msgs/msg/Imu@gz.msgs.IMU',
        ],
        output='screen'
    )
    
    # Robot state publisher
    robot_state_publisher = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        parameters=[{
            'use_sim_time': use_sim_time,
            'robot_description': open(
                os.path.join(pkg_my_robot, 'urdf', 'robot.urdf')
            ).read()
        }]
    )
    
    return LaunchDescription([
        DeclareLaunchArgument('use_sim_time', default_value='true'),
        gazebo,
        bridge,
        robot_state_publisher
    ])
```

### Running the Simulation

```bash
ros2 launch my_robot_description sim.launch.py
```

---

## Controlling the Robot from ROS 2

### Teleop Control

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
import sys, select, termios, tty

class TeleopNode(Node):
    def __init__(self):
        super().__init__('teleop_node')
        self.publisher = self.create_publisher(Twist, '/cmd_vel', 10)
        self.get_logger().info('Teleop started. Use WASD to move.')
        
    def get_key(self):
        tty.setraw(sys.stdin.fileno())
        select.select([sys.stdin], [], [], 0)
        key = sys.stdin.read(1)
        termios.tcsetattr(sys.stdin, termios.TCSADRAIN, self.settings)
        return key
    
    def run(self):
        self.settings = termios.tcgetattr(sys.stdin)
        
        while True:
            key = self.get_key()
            msg = Twist()
            
            if key == 'w':
                msg.linear.x = 0.5
            elif key == 's':
                msg.linear.x = -0.5
            elif key == 'a':
                msg.angular.z = 0.5
            elif key == 'd':
                msg.angular.z = -0.5
            elif key == 'q':
                break
            
            self.publisher.publish(msg)

def main(args=None):
    rclpy.init(args=args)
    node = TeleopNode()
    try:
        node.run()
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

---

## Sensor Integration

### Camera Bridge

```bash
# Bridge camera images
ros2 run ros_gz_image image_bridge /camera/image_raw
```

### LiDAR Bridge

```xml
<!-- In robot SDF -->
<sensor name="lidar" type="gpu_lidar">
  <topic>/scan</topic>
  <update_rate>10</update_rate>
  <lidar>
    <scan>
      <horizontal>
        <samples>640</samples>
        <resolution>1</resolution>
        <min_angle>-1.57</min_angle>
        <max_angle>1.57</max_angle>
      </horizontal>
    </scan>
    <range>
      <min>0.1</min>
      <max>30.0</max>
    </range>
  </lidar>
</sensor>
```

```bash
# Bridge LiDAR
ros2 run ros_gz_bridge parameter_bridge /scan@sensor_msgs/msg/LaserScan@gz.msgs.LaserScan
```

---

## Debugging Tips

### Check Topics

```bash
# List Gazebo topics
gz topic -l

# List ROS 2 topics
ros2 topic list

# Echo a topic
ros2 topic echo /cmd_vel
```

### Verify Bridge

```bash
# Check if bridge is running
ros2 node list | grep bridge

# Check bridge info
ros2 node info /parameter_bridge
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Topics not bridged | Check message type compatibility |
| Robot not moving | Verify joint names in plugin |
| No odometry | Check `odom_publish_frequency` |
| Sensors not working | Ensure sensor plugins are loaded |

---

## Key Takeaways

✅ **ros_gz_bridge** connects Gazebo and ROS 2 topics

✅ **Gazebo plugins** enable robot control (diff drive, joint states)

✅ **Launch files** orchestrate Gazebo + ROS 2 + bridges

✅ **Sensor integration** requires proper topic bridging

✅ **Debugging** uses `gz topic` and `ros2 topic` commands

---

## Chapter 3 Summary

Congratulations! You've completed Chapter 3: Robot Simulation with Gazebo. You now understand:
- Gazebo architecture (ECS, physics engines, rendering)
- Creating worlds and models (SDF format)
- URDF robot descriptions (links, joints, Xacro)
- Gazebo-ROS 2 integration (ros_gz_bridge, plugins)

**Next**: In Chapter 4, we'll explore **NVIDIA Isaac Platform** for GPU-accelerated simulation and AI training.

---

## Reflection Questions

1. Why is the ros_gz_bridge necessary instead of direct communication?
2. How would you add a camera sensor to your robot and bridge it to ROS 2?
3. What are the advantages of using Gazebo plugins vs. external ROS 2 nodes?
4. How would you debug a situation where your robot doesn't respond to /cmd_vel commands?

---

## Further Reading

- **ros_gz Documentation**: [github.com/gazebosim/ros_gz](https://github.com/gazebosim/ros_gz)
- **Gazebo Plugins**: [gazebosim.org/api/sim/7/namespace gz_1_1sim_1_1systems.html](https://gazebosim.org/api/sim/7/namespacegz_1_1sim_1_1systems.html)
- **ROS 2 + Gazebo Tutorial**: [docs.ros.org/en/humble/Tutorials/Advanced/Simulators/Gazebo](https://docs.ros.org/en/humble/Tutorials/Advanced/Simulators/Gazebo.html)

---

**Previous Section**: [← 3.3 URDF and Robot Description](./urdf-robot-description.md)  
**Next Chapter**: [Chapter 4: NVIDIA Isaac Platform →](../chapter4/index.md)
