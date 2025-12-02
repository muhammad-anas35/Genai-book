# 2.4 Launch Files and Parameters

## Learning Objectives

By the end of this section, you will be able to:
- Create launch files to start multiple nodes simultaneously
- Configure node parameters using YAML files
- Pass arguments to launch files for flexible configuration
- Organize complex robot systems with launch file composition
- Debug and troubleshoot launch files effectively

---

## Introduction

Imagine starting a humanoid robot: you need to launch the camera driver, IMU node, motor controllers, localization, navigation, and AI modules—potentially dozens of nodes. Doing this manually with `ros2 run` for each node is tedious and error-prone.

**Launch files** solve this problem by allowing you to start multiple nodes, set parameters, and configure your entire robot system with a single command. This section teaches you how to create professional launch files for complex robotic systems.

---

## Why Launch Files?

### The Problem

```bash
# Manual startup (tedious!)
ros2 run camera_driver camera_node &
ros2 run imu_driver imu_node &
ros2 run motor_controller left_leg &
ros2 run motor_controller right_leg &
ros2 run localization ekf_node &
ros2 run navigation nav2_node &
# ... and 20 more nodes
```

### The Solution

```bash
# Single command startup
ros2 launch my_robot robot.launch.py
```

**Benefits**:
- ✅ Start entire robot system with one command
- ✅ Configure parameters from YAML files
- ✅ Set node remappings and namespaces
- ✅ Conditional logic (launch nodes based on arguments)
- ✅ Composition (include other launch files)

---

## Creating Your First Launch File

### Basic Launch File Structure

Create `simple_launch.py`:

```python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='turtlesim',
            executable='turtlesim_node',
            name='sim'
        ),
        Node(
            package='turtlesim',
            executable='turtle_teleop_key',
            name='teleop',
            prefix='xterm -e',  # Run in separate terminal
            output='screen'
        )
    ])
```

**Run it**:
```bash
ros2 launch my_package simple_launch.py
```

### Launch File Components

| Component | Description |
|-----------|-------------|
| `LaunchDescription` | Container for all launch actions |
| `Node` | Launches a ROS 2 node |
| `DeclareLaunchArgument` | Defines command-line arguments |
| `IncludeLaunchDescription` | Includes another launch file |
| `ExecuteProcess` | Runs arbitrary commands |

---

## Parameters in Launch Files

### Inline Parameters

```python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='my_robot',
            executable='controller',
            name='controller',
            parameters=[{
                'max_velocity': 1.0,
                'min_velocity': -1.0,
                'control_frequency': 50.0,
                'use_sim_time': True
            }]
        )
    ])
```

### Parameters from YAML File

**config/robot_params.yaml**:
```yaml
controller:
  ros__parameters:
    max_velocity: 1.0
    min_velocity: -1.0
    control_frequency: 50.0
    pid_gains:
      kp: 1.0
      ki: 0.1
      kd: 0.05
```

**Launch file**:
```python
import os
from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    # Get path to config file
    config = os.path.join(
        get_package_share_directory('my_robot'),
        'config',
        'robot_params.yaml'
    )
    
    return LaunchDescription([
        Node(
            package='my_robot',
            executable='controller',
            name='controller',
            parameters=[config]
        )
    ])
```

---

## Launch Arguments

### Declaring Arguments

```python
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node

def generate_launch_description():
    # Declare arguments
    use_sim_arg = DeclareLaunchArgument(
        'use_sim',
        default_value='false',
        description='Use simulation time'
    )
    
    robot_name_arg = DeclareLaunchArgument(
        'robot_name',
        default_value='robot1',
        description='Name of the robot'
    )
    
    # Use arguments
    use_sim = LaunchConfiguration('use_sim')
    robot_name = LaunchConfiguration('robot_name')
    
    return LaunchDescription([
        use_sim_arg,
        robot_name_arg,
        
        Node(
            package='my_robot',
            executable='controller',
            name='controller',
            namespace=robot_name,
            parameters=[{
                'use_sim_time': use_sim
            }]
        )
    ])
```

**Run with arguments**:
```bash
ros2 launch my_robot robot.launch.py use_sim:=true robot_name:=atlas
```

---

## Advanced Launch File Techniques

### Conditional Node Launch

```python
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.conditions import IfCondition
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node

def generate_launch_description():
    use_camera_arg = DeclareLaunchArgument(
        'use_camera',
        default_value='true'
    )
    
    use_camera = LaunchConfiguration('use_camera')
    
    return LaunchDescription([
        use_camera_arg,
        
        # Only launch camera if use_camera is true
        Node(
            package='camera_driver',
            executable='camera_node',
            name='camera',
            condition=IfCondition(use_camera)
        ),
        
        # Always launch this node
        Node(
            package='my_robot',
            executable='controller',
            name='controller'
        )
    ])
```

### Including Other Launch Files

```python
import os
from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.actions import IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource

def generate_launch_description():
    # Get path to another launch file
    nav2_launch = os.path.join(
        get_package_share_directory('nav2_bringup'),
        'launch',
        'navigation_launch.py'
    )
    
    return LaunchDescription([
        # Include Nav2 launch file
        IncludeLaunchDescription(
            PythonLaunchDescriptionSource(nav2_launch),
            launch_arguments={
                'use_sim_time': 'true',
                'params_file': '/path/to/nav2_params.yaml'
            }.items()
        ),
        
        # Add your own nodes
        Node(
            package='my_robot',
            executable='my_node',
            name='my_node'
        )
    ])
```

### Node Remapping

```python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='camera_driver',
            executable='camera_node',
            name='front_camera',
            remappings=[
                ('/image', '/front_camera/image'),
                ('/camera_info', '/front_camera/info')
            ]
        ),
        Node(
            package='camera_driver',
            executable='camera_node',
            name='rear_camera',
            remappings=[
                ('/image', '/rear_camera/image'),
                ('/camera_info', '/rear_camera/info')
            ]
        )
    ])
```

---

## Complete Example: Humanoid Robot Launch

### Directory Structure

```
humanoid_bringup/
├── launch/
│   ├── robot.launch.py          # Main launch file
│   ├── sensors.launch.py        # Sensor nodes
│   └── control.launch.py        # Control nodes
├── config/
│   ├── sensors.yaml
│   ├── control.yaml
│   └── navigation.yaml
└── package.xml
```

### Main Launch File

**launch/robot.launch.py**:
```python
import os
from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, IncludeLaunchDescription
from launch.conditions import IfCondition
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node

def generate_launch_description():
    # Package directory
    pkg_dir = get_package_share_directory('humanoid_bringup')
    
    # Declare arguments
    use_sim_arg = DeclareLaunchArgument(
        'use_sim',
        default_value='false',
        description='Use simulation time'
    )
    
    enable_camera_arg = DeclareLaunchArgument(
        'enable_camera',
        default_value='true',
        description='Enable camera nodes'
    )
    
    # Get argument values
    use_sim = LaunchConfiguration('use_sim')
    enable_camera = LaunchConfiguration('enable_camera')
    
    # Config files
    sensor_config = os.path.join(pkg_dir, 'config', 'sensors.yaml')
    control_config = os.path.join(pkg_dir, 'config', 'control.yaml')
    
    # Include sensor launch file
    sensors_launch = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(
            os.path.join(pkg_dir, 'launch', 'sensors.launch.py')
        ),
        launch_arguments={
            'use_sim': use_sim,
            'enable_camera': enable_camera
        }.items()
    )
    
    # Include control launch file
    control_launch = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(
            os.path.join(pkg_dir, 'launch', 'control.launch.py')
        ),
        launch_arguments={
            'use_sim': use_sim
        }.items()
    )
    
    # Robot state publisher
    robot_state_publisher = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        name='robot_state_publisher',
        parameters=[{
            'use_sim_time': use_sim,
            'robot_description': 'path/to/urdf'
        }]
    )
    
    return LaunchDescription([
        # Arguments
        use_sim_arg,
        enable_camera_arg,
        
        # Nodes and includes
        robot_state_publisher,
        sensors_launch,
        control_launch
    ])
```

### Sensor Launch File

**launch/sensors.launch.py**:
```python
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.conditions import IfCondition
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node

def generate_launch_description():
    enable_camera = LaunchConfiguration('enable_camera')
    use_sim = LaunchConfiguration('use_sim')
    
    return LaunchDescription([
        # IMU Node
        Node(
            package='imu_driver',
            executable='imu_node',
            name='imu',
            parameters=[{
                'use_sim_time': use_sim,
                'frame_id': 'imu_link'
            }]
        ),
        
        # LiDAR Node
        Node(
            package='lidar_driver',
            executable='lidar_node',
            name='lidar',
            parameters=[{
                'use_sim_time': use_sim,
                'frame_id': 'lidar_link'
            }]
        ),
        
        # Camera Node (conditional)
        Node(
            package='camera_driver',
            executable='camera_node',
            name='camera',
            condition=IfCondition(enable_camera),
            parameters=[{
                'use_sim_time': use_sim,
                'frame_id': 'camera_link'
            }]
        )
    ])
```

---

## Debugging Launch Files

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| "Package not found" | Check package name, ensure it's built and sourced |
| "Executable not found" | Verify entry point in setup.py |
| "Config file not found" | Use `get_package_share_directory()` for paths |
| Nodes not starting | Check `ros2 node list` and logs in `~/.ros/log/` |

### Debugging Commands

```bash
# Verbose launch output
ros2 launch my_package robot.launch.py --debug

# Check running nodes
ros2 node list

# Check node info
ros2 node info /controller

# View logs
ros2 run rqt_console rqt_console

# Kill all nodes from launch
# Ctrl+C in terminal where launch was started
```

---

## Best Practices

### Launch File Organization

✅ **Do**:
- Separate concerns (sensors.launch.py, control.launch.py, navigation.launch.py)
- Use descriptive names
- Document arguments with descriptions
- Use YAML files for parameters
- Include example usage in comments

❌ **Don't**:
- Put everything in one giant launch file
- Hardcode paths (use `get_package_share_directory()`)
- Forget to declare arguments
- Mix configuration and logic

### Parameter Organization

```
my_robot/
├── config/
│   ├── simulation.yaml      # Sim-specific params
│   ├── hardware.yaml         # Real robot params
│   ├── navigation.yaml       # Nav2 params
│   └── sensors.yaml          # Sensor configs
└── launch/
    ├── sim.launch.py         # Uses simulation.yaml
    └── robot.launch.py       # Uses hardware.yaml
```

---

## Key Takeaways

✅ **Launch files** start multiple nodes with a single command

✅ **Parameters** can be set inline or loaded from YAML files

✅ **Arguments** make launch files flexible and reusable

✅ **Composition** allows including other launch files

✅ **Conditions** enable conditional node launching

✅ **Organization** is key—separate concerns into multiple launch files

---

## Reflection Questions

1. When would you use inline parameters vs. YAML parameter files?
2. How would you structure launch files for a robot that can run in both simulation and on real hardware?
3. What are the advantages of using `IncludeLaunchDescription` vs. copying node definitions?
4. How would you debug a launch file where one node fails to start?

---

## Further Reading

- **ROS 2 Launch Tutorial**: [docs.ros.org/en/humble/Tutorials/Intermediate/Launch/Launch-Main.html](https://docs.ros.org/en/humble/Tutorials/Intermediate/Launch/Launch-Main.html)
- **Launch File Architecture**: [design.ros2.org/articles/roslaunch.html](https://design.ros2.org/articles/roslaunch.html)
- **Parameters Guide**: [docs.ros.org/en/humble/Concepts/Basic/About-Parameters.html](https://docs.ros.org/en/humble/Concepts/Basic/About-Parameters.html)

---

## Chapter 2 Summary

Congratulations! You've completed Chapter 2: ROS 2 Fundamentals. You now understand:
- ROS 2 architecture and DDS middleware
- Creating nodes and implementing communication (topics, services, actions)
- Building and organizing ROS 2 packages
- Creating launch files and managing parameters

**Next**: In Chapter 3, we'll apply these skills to **robot simulation with Gazebo**, where you'll create virtual environments and test your ROS 2 code before deploying to real hardware.

---

**Previous Section**: [← 2.3 Building ROS 2 Packages](./building-packages.md)  
**Next Chapter**: [Chapter 3: Robot Simulation with Gazebo →](../chapter3/index.md)
