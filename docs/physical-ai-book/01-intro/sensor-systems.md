# 1.4 Sensor Systems Overview

## Learning Objectives

By the end of this section, you will be able to:
- Identify the major sensor types used in humanoid robotics
- Understand the specifications and applications of LiDAR, RGB-D cameras, and IMUs
- Compare different sensor technologies and their trade-offs
- Recognize the role of sensor fusion in Physical AI systems
- Write basic ROS 2 code to subscribe to sensor data

---

## Introduction

If embodied AI is the "brain" of a humanoid robot, then **sensors are its eyes, ears, and sense of touch**. Without sensors, a robot is blind to its environment—unable to navigate, manipulate objects, or respond to the world around it.

This section introduces the core sensor technologies that enable Physical AI, with a focus on the sensors you'll encounter in this course:
- **LiDAR**: For 3D spatial mapping
- **RGB-D Cameras**: For visual perception and depth sensing
- **IMUs**: For orientation and motion tracking
- **Force/Torque Sensors**: For manipulation feedback

We'll also write our first ROS 2 program to read sensor data—a preview of Chapter 2.

---

## 1. LiDAR (Light Detection and Ranging)

LiDAR sensors emit laser pulses and measure the time it takes for reflections to return, creating precise 3D point clouds of the environment.

### How LiDAR Works

1. **Emit**: Laser pulses are sent out
2. **Reflect**: Pulses bounce off objects
3. **Measure**: Time-of-flight (ToF) is calculated
4. **Compute**: Distance = (Speed of Light × Time) / 2

### Types of LiDAR

#### Mechanical Spinning LiDAR
- **Example**: Velodyne VLP-16 Puck
- **Mechanism**: Multiple lasers rotate 360° on a spinning platform
- **Pros**: Complete surround view, proven technology
- **Cons**: Moving parts (wear and tear), bulky, expensive ($4,000-$8,000)

#### Solid-State LiDAR
- **Example**: Livox Mid-360
- **Mechanism**: No moving parts; uses MEMS mirrors or phased arrays
- **Pros**: Compact, durable, lower cost ($500-$1,500)
- **Cons**: Limited field of view (often < 360°)

#### Digital Spinning LiDAR
- **Example**: Ouster OS1
- **Mechanism**: Electronically controlled laser firing with structured data output
- **Pros**: High resolution, uniform point density, rugged (IP68/IP69K)
- **Cons**: More expensive than solid-state

### LiDAR Comparison Table

| Sensor | Type | Range | FOV | Points/sec | Price | Use Case |
|--------|------|-------|-----|------------|-------|----------|
| **Velodyne VLP-16** | Mechanical Spinning | 100m | 360° × 30° | 300,000 | ~$4,000 | Autonomous vehicles, outdoor mapping |
| **Ouster OS1-64** | Digital Spinning | 120m | 360° × 45° | 1,310,720 | ~$12,000 | High-res mapping, industrial |
| **Livox Mid-360** | Solid-State (MEMS) | 40m | 360° × 59° | 200,000 | ~$500 | Mobile robots, drones, SLAM |

**For this course**: The **Livox Mid-360** (used in Unitree G1) represents the best balance of cost and capability for educational robotics.

---

## 2. RGB-D Cameras (Depth Cameras)

RGB-D cameras combine standard color imaging with depth sensing, providing both visual appearance and 3D structure.

### Intel RealSense D435i

The **RealSense D435i** is the industry standard for robotics education and research.

**Key Specifications**:
- **Depth Technology**: Stereoscopic (dual global shutter cameras)
- **Depth Range**: 0.3m to 3m (ideal), up to 10m (max)
- **Depth Accuracy**: &lt;2% at 2m (~20mm error)
- **Depth Resolution**: Up to 1280×720 @ 90 FPS
- **RGB Resolution**: 1920×1080 @ 30 FPS
- **Field of View**: 87° × 58° (H × V)
- **IMU**: Integrated BMI055 (6-DoF)
- **Interface**: USB-C 3.1
- **Price**: ~$349

**Why It's Popular**:
- **Global Shutter**: No motion blur (critical for moving robots)
- **Integrated IMU**: Enables visual-inertial odometry (VIO)
- **ROS 2 Support**: Official `realsense-ros` package
- **Compact**: 90mm × 25mm × 25mm

### How Stereoscopic Depth Works

1. Two cameras capture the same scene from slightly different angles
2. Software identifies matching features in both images
3. Triangulation calculates depth based on disparity (pixel offset)
4. Result: A depth map where each pixel has a distance value

**Limitation**: Struggles with textureless surfaces (white walls, glass) because there are no features to match.

---

## 3. Inertial Measurement Units (IMUs)

IMUs measure orientation, angular velocity, and linear acceleration—essential for balance and navigation.

### IMU Components

- **Accelerometer**: Measures linear acceleration (m/s²) in 3 axes
- **Gyroscope**: Measures angular velocity (°/s or rad/s) in 3 axes
- **Magnetometer** (optional): Measures magnetic field for absolute heading

### BNO055 vs. MPU6050

| Feature | BNO055 | MPU6050 |
|---------|--------|---------|
| **Axes** | 9-axis (Accel + Gyro + Mag) | 6-axis (Accel + Gyro) |
| **Sensor Fusion** | **Hardware fusion** (ARM Cortex-M0) | Software fusion required |
| **Output** | Quaternions, Euler angles, vectors | Raw sensor data |
| **Ease of Use** | Plug-and-play for orientation | Requires complex software |
| **Price** | ~$30 | ~$5 |
| **Best For** | Drones, humanoids (absolute orientation) | Cost-sensitive projects |

**For this course**: The **BNO055** is recommended because it outputs fused orientation data directly, saving you from implementing complex sensor fusion algorithms.

### Why IMUs Matter for Humanoids

- **Balance Control**: Detect when the robot is tilting and correct posture
- **Odometry**: Estimate position by integrating acceleration (prone to drift)
- **Sensor Fusion**: Combine with cameras/LiDAR for robust localization

---

## 4. Force/Torque Sensors

Force/torque sensors measure the forces and moments applied to a robot's joints or end-effector (gripper).

### Applications

- **Grasping**: Detect when an object is securely held
- **Compliance Control**: Apply precise forces (e.g., polishing, assembly)
- **Safety**: Detect collisions and stop movement
- **Manipulation**: Adjust grip based on object weight and fragility

### Example: ATI Mini40

- **Force Range**: ±40 N (all axes)
- **Torque Range**: ±2 N·m (all axes)
- **Resolution**: 0.02 N (force), 0.001 N·m (torque)
- **Price**: ~$3,000

**Note**: Force/torque sensors are expensive and typically found only in high-end research robots. For this course, we'll simulate them in Gazebo.

---

## 5. Sensor Fusion

No single sensor is perfect. **Sensor fusion** combines data from multiple sensors to overcome individual limitations.

### Example: Visual-Inertial Odometry (VIO)

**Problem**: Cameras struggle in low light; IMUs drift over time.

**Solution**: Fuse camera and IMU data:
1. **Camera**: Provides visual features for position estimation
2. **IMU**: Provides high-frequency motion updates
3. **Fusion**: Kalman filter combines both, compensating for each sensor's weaknesses

**Result**: Robust localization that works in varied lighting and doesn't drift.

### Common Fusion Techniques

- **Kalman Filter**: Optimal for linear systems with Gaussian noise
- **Extended Kalman Filter (EKF)**: For non-linear systems
- **Particle Filter**: For multi-modal distributions
- **Graph-Based SLAM**: Optimizes sensor measurements over time

---

## ROS 2 Code Example: Reading Sensor Data

Let's write our first ROS 2 program to subscribe to IMU data. This previews Chapter 2's content.

### Prerequisites

- ROS 2 Humble installed
- Python 3.10+
- A sensor publishing IMU data (or simulated data)

### Code: `imu_subscriber.py`

```python
#!/usr/bin/env python3
"""
Simple ROS 2 subscriber to read IMU sensor data.
Demonstrates basic sensor integration in Physical AI systems.
"""

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Imu
import math

class IMUSubscriber(Node):
    """
    Subscribes to IMU data and prints orientation in Euler angles.
    """
    
    def __init__(self):
        super().__init__('imu_subscriber')
        
        # Create subscription to /imu/data topic
        self.subscription = self.create_subscription(
            Imu,
            '/imu/data',
            self.imu_callback,
            10  # QoS queue size
        )
        self.get_logger().info('IMU Subscriber started. Listening to /imu/data...')
    
    def imu_callback(self, msg: Imu):
        """
        Callback function executed when IMU data is received.
        
        Args:
            msg: IMU message containing orientation, angular velocity, linear acceleration
        """
        # Extract quaternion orientation
        q = msg.orientation
        
        # Convert quaternion to Euler angles (roll, pitch, yaw)
        roll, pitch, yaw = self.quaternion_to_euler(q.x, q.y, q.z, q.w)
        
        # Extract angular velocity
        angular_vel = msg.angular_velocity
        
        # Extract linear acceleration
        linear_accel = msg.linear_acceleration
        
        # Log the data
        self.get_logger().info(
            f'Orientation (deg): Roll={math.degrees(roll):.2f}, '
            f'Pitch={math.degrees(pitch):.2f}, Yaw={math.degrees(yaw):.2f}'
        )
        self.get_logger().info(
            f'Angular Velocity (rad/s): x={angular_vel.x:.3f}, '
            f'y={angular_vel.y:.3f}, z={angular_vel.z:.3f}'
        )
        self.get_logger().info(
            f'Linear Acceleration (m/s²): x={linear_accel.x:.3f}, '
            f'y={linear_accel.y:.3f}, z={linear_accel.z:.3f}\n'
        )
    
    def quaternion_to_euler(self, x, y, z, w):
        """
        Convert quaternion to Euler angles (roll, pitch, yaw).
        
        Args:
            x, y, z, w: Quaternion components
            
        Returns:
            tuple: (roll, pitch, yaw) in radians
        """
        # Roll (x-axis rotation)
        sinr_cosp = 2 * (w * x + y * z)
        cosr_cosp = 1 - 2 * (x * x + y * y)
        roll = math.atan2(sinr_cosp, cosr_cosp)
        
        # Pitch (y-axis rotation)
        sinp = 2 * (w * y - z * x)
        if abs(sinp) >= 1:
            pitch = math.copysign(math.pi / 2, sinp)  # Use 90 degrees if out of range
        else:
            pitch = math.asin(sinp)
        
        # Yaw (z-axis rotation)
        siny_cosp = 2 * (w * z + x * y)
        cosy_cosp = 1 - 2 * (y * y + z * z)
        yaw = math.atan2(siny_cosp, cosy_cosp)
        
        return roll, pitch, yaw

def main(args=None):
    """
    Main function to initialize and run the ROS 2 node.
    """
    rclpy.init(args=args)
    
    imu_subscriber = IMUSubscriber()
    
    try:
        rclpy.spin(imu_subscriber)
    except KeyboardInterrupt:
        imu_subscriber.get_logger().info('Shutting down IMU Subscriber...')
    finally:
        imu_subscriber.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### How to Run

```bash
# Terminal 1: Run the subscriber
python3 imu_subscriber.py

# Terminal 2: Publish test IMU data (if no real sensor)
ros2 topic pub /imu/data sensor_msgs/msg/Imu "{
  orientation: {x: 0.0, y: 0.0, z: 0.0, w: 1.0},
  angular_velocity: {x: 0.1, y: 0.2, z: 0.3},
  linear_acceleration: {x: 0.0, y: 0.0, z: 9.81}
}"
```

### Code Explanation

1. **Import ROS 2 Libraries**: `rclpy` (ROS Client Library for Python)
2. **Create Node**: Inherit from `Node` class
3. **Subscribe to Topic**: Listen to `/imu/data` (standard IMU topic)
4. **Callback Function**: Processes incoming messages
5. **Quaternion to Euler**: Converts orientation to human-readable angles
6. **Logging**: Prints data to console

**What You'll Learn in Chapter 2**:
- ROS 2 architecture and concepts
- Publishers, subscribers, services, actions
- Creating custom message types
- Launch files and parameters

---

## Key Takeaways

✅ **LiDAR** provides precise 3D spatial data; Livox Mid-360 is cost-effective for education

✅ **RGB-D Cameras** (RealSense D435i) combine vision and depth for object recognition and manipulation

✅ **IMUs** (BNO055) provide orientation data essential for balance and navigation

✅ **Force/Torque Sensors** enable delicate manipulation but are expensive

✅ **Sensor Fusion** combines multiple sensors to overcome individual limitations

✅ **ROS 2** is the standard framework for integrating sensors in robotics

---

## Reflection Questions

1. Why might a robot use both LiDAR and cameras instead of just one?
2. What are the advantages of hardware sensor fusion (BNO055) vs. software fusion (MPU6050)?
3. In what scenarios would a solid-state LiDAR (Livox) be preferable to a mechanical spinning LiDAR (Velodyne)?
4. How does the RealSense D435i's integrated IMU improve its performance for robotics?

---

## Further Reading

- **Intel RealSense Documentation**: [intelrealsense.com](https://www.intelrealsense.com)
- **Livox LiDAR Technology**: [livoxtech.com](https://www.livoxtech.com)
- **BNO055 Datasheet**: Bosch Sensortec
- **ROS 2 Humble Documentation**: [docs.ros.org](https://docs.ros.org/en/humble/)

---

## Chapter 1 Summary

Congratulations! You've completed Chapter 1: Introduction to Physical AI. You now understand:
- The foundations of Physical AI and embodied intelligence
- The transition from digital to physical AI and the sim-to-real gap
- The current landscape of humanoid robotics platforms
- The core sensor technologies that enable Physical AI

**Next**: In Chapter 2, we'll dive deep into **ROS 2**, the middleware that connects sensors, actuators, and AI algorithms into a cohesive robotic system.

---

**Previous Section**: [← 1.3 Humanoid Robotics Landscape](./humanoid-landscape.md)  
**Next Chapter**: [Chapter 2: ROS 2 Fundamentals →](../chapter2/index.md)
