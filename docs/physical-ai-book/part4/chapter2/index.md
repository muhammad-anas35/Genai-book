---
title: "Chapter 2: Isaac ROS 2 Bridge"
sidebar_label: "Chapter 2: Isaac ROS 2 Bridge"
---

# Chapter 2: Isaac ROS 2 Bridge

## Learning Objectives

- Integrate Isaac Sim with ROS 2 workflows
- Bridge topics between Isaac Sim and ROS 2
- Control simulated robots from ROS 2 nodes
- Use Isaac ROS packages for perception

---

## Introduction

The **Isaac ROS 2 Bridge** connects Isaac Sim with ROS 2, enabling:
- Testing ROS 2 algorithms in Isaac Sim
- Deploying sim-trained models to real robots
- Using Isaac ROS perception packages

---

## Enabling the Bridge

```python
from omni.isaac.core.utils.extensions import enable_extension

# Chapter 2: Enable ROS 2 bridge extension
enable_extension("omni.isaac.ros2_bridge")
```

---

## Publishing Joint States

```python
import omni.graph.core as og

# Chapter 2: Create ROS 2 publisher node
keys = og.Controller.Keys
(graph, nodes, _, _) = og.Controller.edit(
    {"graph_path": "/ActionGraph", "evaluator_name": "execution"},
    {
        keys.CREATE_NODES: [
            ("OnPlaybackTick", "omni.graph.action.OnPlaybackTick"),
            ("PublishJointState", "omni.isaac.ros2_bridge.ROS2PublishJointState"),
        ],
        keys.CONNECT: [
            ("OnPlaybackTick.outputs:tick", "PublishJointState.inputs:execIn"),
        ],
        keys.SET_VALUES: [
            ("PublishJointState.inputs:topicName", "/joint_states"),
            ("PublishJointState.inputs:targetPrim", "/World/Robot"),
        ],
    },
)
```

---

## Subscribing to Commands

```python
# Chapter 2: Subscribe to /cmd_vel
(graph, nodes, _, _) = og.Controller.edit(
    {"graph_path": "/ActionGraph"},
    {
        keys.CREATE_NODES: [
            ("SubscribeTwist", "omni.isaac.ros2_bridge.ROS2SubscribeTwist"),
            ("DiffController", "omni.isaac.wheeled_robots.DifferentialController"),
        ],
        keys.CONNECT: [
            ("SubscribeTwist.outputs:linearVelocity", "DiffController.inputs:linearVelocity"),
            ("SubscribeTwist.outputs:angularVelocity", "DiffController.inputs:angularVelocity"),
        ],
        keys.SET_VALUES: [
            ("SubscribeTwist.inputs:topicName", "/cmd_vel"),
        ],
    },
)
```

---

## Isaac ROS Packages

NVIDIA provides optimized ROS 2 packages:

| Package | Purpose |
|---------|---------|
| **isaac_ros_visual_slam** | GPU-accelerated SLAM |
| **isaac_ros_image_segmentation** | Real-time segmentation |
| **isaac_ros_object_detection** | YOLO, DOPE |
| **isaac_ros_depth_estimation** | Stereo depth |

### Example: Visual SLAM

```bash
# Chapter 2: Install Isaac ROS
sudo apt install ros-humble-isaac-ros-visual-slam

# Chapter 2: Launch with Isaac Sim camera
ros2 launch isaac_ros_visual_slam isaac_ros_visual_slam.launch.py
```

---

## Complete Integration Example

```python
from isaacsim import SimulationApp
simulation_app = SimulationApp({"headless": False})

from omni.isaac.core import World
from omni.isaac.core.utils.extensions import enable_extension

# Chapter 2: Enable ROS 2
enable_extension("omni.isaac.ros2_bridge")

# Chapter 2: Create world with robot
world = World()
world.scene.add_default_ground_plane()

# Chapter 2: Add robot (URDF or USD)
from omni.isaac.core.utils.stage import add_reference_to_stage
add_reference_to_stage(
    usd_path="/path/to/robot.usd",
    prim_path="/World/Robot"
)

# Chapter 2: Setup ROS 2 publishers/subscribers
# Chapter 2: (Action Graph as shown above)

# Chapter 2: Run simulation
world.reset()
while simulation_app.is_running():
    world.step(render=True)

simulation_app.close()
```

---

## Key Takeaways

✅ **ROS 2 Bridge** connects Isaac Sim to ROS 2 ecosystem  
✅ **Action Graphs** configure topic publishers/subscribers  
✅ **Isaac ROS** provides GPU-accelerated perception  
✅ **Sim-to-real** workflow: train in Isaac, deploy on robot

---

**Previous Section**: [← 4.3 Synthetic Data Generation](../chapter4/index.md)  
**Next Chapter**: [Chapter 5: Humanoid Robot Development →](../../part5/index.md)