# 2.2 Nodes and Communication

## Learning Objectives

By the end of this section, you will be able to:
- Create and manage ROS 2 nodes in Python and C++
- Implement publishers and subscribers for topic-based communication
- Use services for request-reply interactions
- Implement actions for long-running tasks with feedback
- Understand when to use topics vs. services vs. actions

---

## Introduction

**Nodes** are the fundamental building blocks of any ROS 2 system. Each node is a modular, independent process responsible for a specific task—controlling a motor, processing sensor data, or planning a path. This section teaches you how to create nodes and enable them to communicate effectively.

---

## Understanding Nodes

### What is a Node?

A **node** is an executable process that performs computation. In a humanoid robot:
- **Perception Node**: Processes camera/LiDAR data
- **Localization Node**: Estimates robot position
- **Planning Node**: Computes navigation paths
- **Control Node**: Sends commands to motors

**Key Principle**: **One node, one purpose**. Keep nodes focused and modular.

### Node Lifecycle

Every node goes through these states:

```
┌─────────────┐
│ Unconfigured│  (Initial state)
└──────┬──────┘
       │ configure()
       ▼
┌─────────────┐
│  Inactive   │  (Configured but not running)
└──────┬──────┘
       │ activate()
       ▼
┌─────────────┐
│   Active    │  (Fully operational)
└──────┬──────┘
       │ deactivate()
       ▼
┌─────────────┐
│  Inactive   │
└──────┬──────┘
       │ cleanup() / shutdown()
       ▼
┌─────────────┐
│  Finalized  │  (Terminated)
└─────────────┘
```

---

## Topics: Publish-Subscribe Communication

### When to Use Topics

Use topics for:
- ✅ Continuous data streams (sensor readings, robot pose)
- ✅ One-to-many or many-to-many communication
- ✅ Asynchronous, fire-and-forget messaging

**Don't use topics for**:
- ❌ Request-reply interactions (use services)
- ❌ Long-running tasks with feedback (use actions)

### Creating a Publisher (Python)

```python
#!/usr/bin/env python3
"""
Simple publisher node that sends velocity commands.
"""

import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist

class VelocityPublisher(Node):
    def __init__(self):
        super().__init__('velocity_publisher')
        
        # Create publisher for /cmd_vel topic
        self.publisher = self.create_publisher(
            Twist,           # Message type
            '/cmd_vel',      # Topic name
            10               # QoS queue size
        )
        
        # Create timer to publish at 10 Hz
        self.timer = self.create_timer(0.1, self.timer_callback)
        self.get_logger().info('Velocity Publisher started')
    
    def timer_callback(self):
        """Publish velocity command every 100ms"""
        msg = Twist()
        msg.linear.x = 0.5   # Move forward at 0.5 m/s
        msg.angular.z = 0.1  # Turn slightly
        
        self.publisher.publish(msg)
        self.get_logger().info(f'Publishing: linear={msg.linear.x}, angular={msg.angular.z}')

def main(args=None):
    rclpy.init(args=args)
    node = VelocityPublisher()
    
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

### Creating a Subscriber (Python)

```python
#!/usr/bin/env python3
"""
Simple subscriber node that receives velocity commands.
"""

import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist

class VelocitySubscriber(Node):
    def __init__(self):
        super().__init__('velocity_subscriber')
        
        # Create subscription to /cmd_vel topic
        self.subscription = self.create_subscription(
            Twist,
            '/cmd_vel',
            self.velocity_callback,
            10
        )
        self.get_logger().info('Velocity Subscriber started')
    
    def velocity_callback(self, msg: Twist):
        """Called whenever a message is received"""
        self.get_logger().info(
            f'Received: linear={msg.linear.x:.2f}, angular={msg.angular.z:.2f}'
        )
        
        # Here you would send commands to motors
        # For now, just log the data

def main(args=None):
    rclpy.init(args=args)
    node = VelocitySubscriber()
    
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

### Running the Example

```bash
# Terminal 1: Start the publisher
python3 velocity_publisher.py

# Terminal 2: Start the subscriber
python3 velocity_subscriber.py

# Terminal 3: Inspect the topic
ros2 topic list
ros2 topic info /cmd_vel
ros2 topic echo /cmd_vel
```

---

## Services: Request-Reply Communication

### When to Use Services

Use services for:
- ✅ On-demand computations (inverse kinematics, path planning)
- ✅ Configuration changes (set parameters, trigger calibration)
- ✅ Synchronous interactions where you need a response

**Don't use services for**:
- ❌ Continuous data streams (use topics)
- ❌ Tasks that take >1 second (use actions)

### Creating a Service Server (Python)

```python
#!/usr/bin/env python3
"""
Service server that adds two integers.
"""

import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts

class AddTwoIntsServer(Node):
    def __init__(self):
        super().__init__('add_two_ints_server')
        
        # Create service
        self.srv = self.create_service(
            AddTwoInts,
            'add_two_ints',
            self.add_two_ints_callback
        )
        self.get_logger().info('Add Two Ints service ready')
    
    def add_two_ints_callback(self, request, response):
        """Handle service request"""
        response.sum = request.a + request.b
        self.get_logger().info(
            f'Request: {request.a} + {request.b} = {response.sum}'
        )
        return response

def main(args=None):
    rclpy.init(args=args)
    node = AddTwoIntsServer()
    
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

### Creating a Service Client (Python)

```python
#!/usr/bin/env python3
"""
Service client that calls the add_two_ints service.
"""

import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts
import sys

class AddTwoIntsClient(Node):
    def __init__(self):
        super().__init__('add_two_ints_client')
        
        # Create client
        self.client = self.create_client(AddTwoInts, 'add_two_ints')
        
        # Wait for service to be available
        while not self.client.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Waiting for service...')
    
    def send_request(self, a, b):
        """Send request to service"""
        request = AddTwoInts.Request()
        request.a = a
        request.b = b
        
        # Call service asynchronously
        future = self.client.call_async(request)
        rclpy.spin_until_future_complete(self, future)
        
        if future.result() is not None:
            self.get_logger().info(f'Result: {future.result().sum}')
            return future.result().sum
        else:
            self.get_logger().error('Service call failed')
            return None

def main(args=None):
    rclpy.init(args=args)
    
    if len(sys.argv) != 3:
        print('Usage: add_two_ints_client.py <a> <b>')
        return
    
    node = AddTwoIntsClient()
    result = node.send_request(int(sys.argv[1]), int(sys.argv[2]))
    
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Running the Service Example

```bash
# Terminal 1: Start the server
python3 add_two_ints_server.py

# Terminal 2: Call the service
python3 add_two_ints_client.py 5 3
# Output: Result: 8

# Terminal 3: Inspect the service
ros2 service list
ros2 service type /add_two_ints
ros2 service call /add_two_ints example_interfaces/srv/AddTwoInts "{a: 10, b: 20}"
```

---

## Actions: Long-Running Tasks with Feedback

### When to Use Actions

Use actions for:
- ✅ Tasks that take >1 second (navigation, grasping)
- ✅ Tasks that need progress feedback
- ✅ Tasks that can be canceled mid-execution

**Example**: Navigating to a goal position (takes seconds/minutes, provides distance feedback, can be canceled).

### Action Structure

Actions have three parts:
1. **Goal**: What to achieve (e.g., target position)
2. **Feedback**: Progress updates (e.g., current distance to goal)
3. **Result**: Final outcome (e.g., success/failure)

### Creating an Action Server (Python)

```python
#!/usr/bin/env python3
"""
Action server for Fibonacci sequence generation.
"""

import rclpy
from rclpy.action import ActionServer
from rclpy.node import Node
from example_interfaces.action import Fibonacci
import time

class FibonacciActionServer(Node):
    def __init__(self):
        super().__init__('fibonacci_action_server')
        
        # Create action server
        self._action_server = ActionServer(
            self,
            Fibonacci,
            'fibonacci',
            self.execute_callback
        )
        self.get_logger().info('Fibonacci Action Server ready')
    
    def execute_callback(self, goal_handle):
        """Execute the action"""
        self.get_logger().info(f'Executing goal: order={goal_handle.request.order}')
        
        # Initialize feedback
        feedback_msg = Fibonacci.Feedback()
        feedback_msg.sequence = [0, 1]
        
        # Generate Fibonacci sequence
        for i in range(1, goal_handle.request.order):
            # Check if goal was canceled
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                self.get_logger().info('Goal canceled')
                return Fibonacci.Result()
            
            # Compute next number
            feedback_msg.sequence.append(
                feedback_msg.sequence[i] + feedback_msg.sequence[i-1]
            )
            
            # Publish feedback
            goal_handle.publish_feedback(feedback_msg)
            self.get_logger().info(f'Feedback: {feedback_msg.sequence}')
            
            time.sleep(0.5)  # Simulate work
        
        # Mark goal as succeeded
        goal_handle.succeed()
        
        # Return result
        result = Fibonacci.Result()
        result.sequence = feedback_msg.sequence
        return result

def main(args=None):
    rclpy.init(args=args)
    node = FibonacciActionServer()
    
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

### Creating an Action Client (Python)

```python
#!/usr/bin/env python3
"""
Action client for Fibonacci sequence.
"""

import rclpy
from rclpy.action import ActionClient
from rclpy.node import Node
from example_interfaces.action import Fibonacci

class FibonacciActionClient(Node):
    def __init__(self):
        super().__init__('fibonacci_action_client')
        
        # Create action client
        self._action_client = ActionClient(self, Fibonacci, 'fibonacci')
    
    def send_goal(self, order):
        """Send goal to action server"""
        goal_msg = Fibonacci.Goal()
        goal_msg.order = order
        
        # Wait for server
        self._action_client.wait_for_server()
        
        # Send goal
        self._send_goal_future = self._action_client.send_goal_async(
            goal_msg,
            feedback_callback=self.feedback_callback
        )
        self._send_goal_future.add_done_callback(self.goal_response_callback)
    
    def goal_response_callback(self, future):
        """Handle goal acceptance/rejection"""
        goal_handle = future.result()
        if not goal_handle.accepted:
            self.get_logger().info('Goal rejected')
            return
        
        self.get_logger().info('Goal accepted')
        
        # Wait for result
        self._get_result_future = goal_handle.get_result_async()
        self._get_result_future.add_done_callback(self.get_result_callback)
    
    def get_result_callback(self, future):
        """Handle final result"""
        result = future.result().result
        self.get_logger().info(f'Result: {result.sequence}')
        rclpy.shutdown()
    
    def feedback_callback(self, feedback_msg):
        """Handle feedback"""
        feedback = feedback_msg.feedback
        self.get_logger().info(f'Feedback: {feedback.sequence}')

def main(args=None):
    rclpy.init(args=args)
    node = FibonacciActionClient()
    node.send_goal(10)
    
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass

if __name__ == '__main__':
    main()
```

---

## Topics vs. Services vs. Actions

| Feature | Topics | Services | Actions |
|---------|--------|----------|---------|
| **Pattern** | Publish-Subscribe | Request-Reply | Goal-Feedback-Result |
| **Synchronous?** | No | Yes | No (with feedback) |
| **One-to-Many?** | Yes | No | No |
| **Feedback?** | No | No | Yes |
| **Cancelable?** | N/A | No | Yes |
| **Use Case** | Sensor streams | Configuration | Navigation, grasping |
| **Duration** | Continuous | &lt;1 second | &gt;1 second |

---

## Key Takeaways

✅ **Nodes** are modular, independent processes (one node, one purpose)

✅ **Topics** for continuous, asynchronous data streams (sensor data, commands)

✅ **Services** for synchronous request-reply (configuration, quick computations)

✅ **Actions** for long-running tasks with feedback and cancellation (navigation, manipulation)

✅ **Choose wisely**: Use the right communication pattern for your use case

---

## Reflection Questions

1. Why is it better to have many small nodes instead of one large node?
2. In a humanoid robot, which communication pattern would you use for:
   - Sending joint angle commands?
   - Requesting inverse kinematics calculation?
   - Executing a "walk to position" command?
3. What happens if a subscriber's callback takes too long to execute?
4. How would you handle a situation where an action needs to be canceled mid-execution?

---

## Further Reading

- **ROS 2 Tutorials**: [docs.ros.org/en/humble/Tutorials](https://docs.ros.org/en/humble/Tutorials.html)
- **rclpy API**: [docs.ros2.org/latest/api/rclpy](https://docs.ros2.org/latest/api/rclpy/)
- **Action Design**: [design.ros2.org/articles/actions.html](https://design.ros2.org/articles/actions.html)

---

**Previous Section**: [← 2.1 ROS 2 Architecture](./ros2-architecture.md)  
**Next Section**: [2.3 Building ROS 2 Packages →](./building-packages.md)
