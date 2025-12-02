# Context for Robotics Code Generator Agent

## Code Generation Scope

Generate code examples for:

1. **ROS 2 Fundamentals**
   - Publishers and subscribers
   - Services and clients
   - Actions (servers and clients)
   - Launch files (Python and XML)
   - Parameter handling
   - Lifecycle nodes

2. **Robot Simulation**
   - Gazebo world files
   - URDF/SDF robot descriptions
   - Gazebo plugins
   - Isaac Sim Python scripts
   - Unity Robotics integration

3. **Perception and Sensing**
   - Camera processing (RGB, depth)
   - LIDAR data processing
   - IMU integration
   - Sensor fusion
   - Object detection and tracking

4. **Control and Planning**
   - Joint controllers
   - Trajectory planning
   - Path planning (Nav2)
   - Manipulation (MoveIt 2)
   - Whole-body control

5. **AI Integration**
   - LLM integration for conversational AI
   - Vision-language models
   - Reinforcement learning
   - Behavior trees

6. **Humanoid-Specific**
   - Bipedal locomotion
   - Balance control
   - Grasping and manipulation
   - Human-robot interaction

## Technology Stack

### Primary Languages
- **Python 3.10+**: Main language for examples
- **C++17/20**: For performance-critical code
- **YAML/XML**: For configuration and launch files

### Frameworks and Libraries
- **ROS 2 Humble Hawksbill** (LTS)
- **Gazebo Fortress/Garden**
- **NVIDIA Isaac Sim 2023.1+**
- **PyTorch 2.0+**
- **NumPy, SciPy** for numerical computing
- **OpenCV** for computer vision
- **Transformers** (Hugging Face) for AI models

### ROS 2 Packages to Use
- `rclpy` / `rclcpp`: Core ROS 2
- `tf2_ros`: Transforms
- `sensor_msgs`, `geometry_msgs`, `nav_msgs`: Common messages
- `control_msgs`, `trajectory_msgs`: Control interfaces
- `nav2_*`: Navigation stack
- `moveit2`: Motion planning

## Code Style Guidelines

### Python (PEP 8 + ROS 2 conventions)

```python
"""Module docstring explaining purpose."""

import sys  # Standard library first
from typing import List, Optional  # Then typing

import numpy as np  # Third-party packages
import rclpy  # ROS 2 packages
from rclpy.node import Node
from sensor_msgs.msg import Image


class MyRobotNode(Node):
    """
    Brief description of the node.
    
    Longer description explaining what this node does,
    its inputs, outputs, and purpose.
    
    Attributes:
        publisher_: Publisher for processed data
        subscription_: Subscriber for sensor data
    """
    
    def __init__(self, node_name: str = 'my_robot_node'):
        """
        Initialize the robot node.
        
        Args:
            node_name: Name of the ROS 2 node
        """
        super().__init__(node_name)
        
        # Declare parameters with defaults
        self.declare_parameter('update_rate', 10.0)
        
        # Create publishers/subscribers
        self.publisher_ = self.create_publisher(
            Image,
            'processed_image',
            10  # QoS depth
        )
        
        self.get_logger().info(f'{node_name} initialized')
    
    def process_data(self, data: np.ndarray) -> np.ndarray:
        """
        Process sensor data.
        
        Args:
            data: Input sensor data
            
        Returns:
            Processed data
            
        Raises:
            ValueError: If data shape is invalid
        """
        if data.shape[0] == 0:
            raise ValueError('Empty data array')
        
        # Processing logic here
        return data


def main(args: Optional[List[str]] = None) -> None:
    """Main entry point."""
    rclpy.init(args=args)
    node = MyRobotNode()
    
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### C++ (Modern C++ + ROS 2 conventions)

```cpp
/**
 * @file my_robot_node.hpp
 * @brief Brief description of the node
 */

#ifndef MY_ROBOT_NODE_HPP_
#define MY_ROBOT_NODE_HPP_

#include <memory>
#include <string>
#include <vector>

#include "rclcpp/rclcpp.hpp"
#include "sensor_msgs/msg/image.hpp"

namespace my_robot {

/**
 * @class MyRobotNode
 * @brief Description of what this node does
 */
class MyRobotNode : public rclcpp::Node
{
public:
  /**
   * @brief Constructor
   * @param options Node options
   */
  explicit MyRobotNode(const rclcpp::NodeOptions & options = rclcpp::NodeOptions());
  
  /**
   * @brief Destructor
   */
  ~MyRobotNode() override = default;

private:
  /**
   * @brief Callback for image processing
   * @param msg Incoming image message
   */
  void imageCallback(const sensor_msgs::msg::Image::SharedPtr msg);
  
  // Publishers and subscribers
  rclcpp::Publisher<sensor_msgs::msg::Image>::SharedPtr publisher_;
  rclcpp::Subscription<sensor_msgs::msg::Image>::SharedPtr subscription_;
  
  // Parameters
  double update_rate_;
};

}  // namespace my_robot

#endif  // MY_ROBOT_NODE_HPP_
```

## Common Code Patterns

### ROS 2 Publisher-Subscriber

```python
# Publisher
self.publisher_ = self.create_publisher(MessageType, 'topic_name', 10)
msg = MessageType()
msg.data = value
self.publisher_.publish(msg)

# Subscriber
self.subscription_ = self.create_subscription(
    MessageType,
    'topic_name',
    self.callback,
    10
)

def callback(self, msg: MessageType):
    self.get_logger().info(f'Received: {msg.data}')
```

### ROS 2 Service

```python
# Service server
self.srv = self.create_service(ServiceType, 'service_name', self.service_callback)

def service_callback(self, request, response):
    response.result = self.process(request.input)
    return response

# Service client
self.cli = self.create_client(ServiceType, 'service_name')
request = ServiceType.Request()
request.input = value
future = self.cli.call_async(request)
```

### ROS 2 Action

```python
from rclpy.action import ActionServer, ActionClient

# Action server
self._action_server = ActionServer(
    self,
    ActionType,
    'action_name',
    self.execute_callback
)

def execute_callback(self, goal_handle):
    # Process goal
    result = ActionType.Result()
    goal_handle.succeed()
    return result

# Action client
self._action_client = ActionClient(self, ActionType, 'action_name')
goal_msg = ActionType.Goal()
send_goal_future = self._action_client.send_goal_async(goal_msg)
```

### Launch File (Python)

```python
from launch import LaunchDescription
from launch_ros.actions import Node
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration

def generate_launch_description():
    return LaunchDescription([
        DeclareLaunchArgument(
            'param_name',
            default_value='default_value',
            description='Parameter description'
        ),
        
        Node(
            package='package_name',
            executable='node_name',
            name='node_instance_name',
            parameters=[{
                'param_name': LaunchConfiguration('param_name')
            }],
            output='screen'
        )
    ])
```

## Testing Examples

### Python Unit Test

```python
import unittest
import rclpy
from my_package.my_node import MyRobotNode

class TestMyRobotNode(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        rclpy.init()
    
    @classmethod
    def tearDownClass(cls):
        rclpy.shutdown()
    
    def test_initialization(self):
        node = MyRobotNode()
        self.assertIsNotNone(node)
        node.destroy_node()
    
    def test_data_processing(self):
        node = MyRobotNode()
        result = node.process_data(np.array([1, 2, 3]))
        self.assertEqual(result.shape[0], 3)
        node.destroy_node()

if __name__ == '__main__':
    unittest.main()
```

## Error Handling Patterns

```python
# Specific exceptions
try:
    result = self.process_data(data)
except ValueError as e:
    self.get_logger().error(f'Invalid data: {e}')
    return
except Exception as e:
    self.get_logger().error(f'Unexpected error: {e}')
    raise

# Resource cleanup
try:
    rclpy.spin(node)
except KeyboardInterrupt:
    pass
finally:
    node.destroy_node()
    rclpy.shutdown()
```

## Performance Considerations

- Use NumPy for numerical operations (vectorized)
- Avoid creating new objects in callbacks
- Use appropriate QoS settings for reliability vs latency
- Consider C++ for control loops > 100Hz
- Profile code with `cProfile` or `py-spy`
- Use ROS 2 lifecycle nodes for complex state management

## Documentation Standards

Every code file should include:
1. File-level docstring explaining purpose
2. Class docstrings with attributes
3. Function docstrings with Args, Returns, Raises
4. Inline comments for complex logic
5. Example usage in `if __name__ == '__main__'`
6. README with setup and run instructions
