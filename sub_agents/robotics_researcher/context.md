# Context for Robotics Research Agent

## Research Scope

This agent supports research for the "Physical AI & Humanoid Robotics" book, covering:

- **Robot Operating System (ROS 2)**: Architecture, communication patterns, ecosystem
- **Simulation Platforms**: Gazebo, NVIDIA Isaac Sim, Unity Robotics
- **AI/ML for Robotics**: Reinforcement learning, computer vision, NLP integration
- **Humanoid Robotics**: Locomotion, manipulation, whole-body control
- **Sensors and Perception**: LIDAR, cameras, IMUs, sensor fusion
- **Hardware Platforms**: Reference robots, compute platforms, actuators

## Key Research Sources

### Official Documentation
- **ROS 2**: https://docs.ros.org/
- **NVIDIA Isaac**: https://docs.omniverse.nvidia.com/isaacsim/
- **Gazebo**: https://gazebosim.org/docs
- **PyTorch**: https://pytorch.org/docs/
- **TensorFlow**: https://www.tensorflow.org/

### Academic Sources
- **arXiv**: Robotics (cs.RO), AI (cs.AI), Computer Vision (cs.CV)
- **IEEE Xplore**: Robotics and Automation Society publications
- **ACM Digital Library**: Human-Robot Interaction, Autonomous Agents

### Industry Resources
- **Boston Dynamics**: Atlas, Spot documentation and research
- **Agility Robotics**: Digit humanoid robot
- **Tesla**: Optimus development updates
- **Google DeepMind**: Robotics research papers
- **OpenAI**: Robotics and embodied AI research

### Community Resources
- **ROS Discourse**: https://discourse.ros.org/
- **GitHub**: ros2, isaac-sim, gazebo repositories
- **Reddit**: r/robotics, r/ROS, r/MachineLearning
- **Stack Overflow**: ROS, robotics, computer-vision tags

## Research Templates

### Technology Comparison Template

When comparing technologies (e.g., Gazebo vs Isaac Sim):

```markdown
## Comparison: [Technology A] vs [Technology B]

### Overview
- Brief description of each technology
- Primary use cases

### Key Differences

| Feature | Technology A | Technology B |
|---------|-------------|--------------|
| Performance | ... | ... |
| Ease of Use | ... | ... |
| Ecosystem | ... | ... |
| Cost | ... | ... |

### When to Use Each
- **Technology A**: Best for...
- **Technology B**: Best for...

### Integration Considerations
- Compatibility with ROS 2
- GPU requirements
- Learning curve

### Sources
1. [Source 1]
2. [Source 2]
```

### Best Practices Research Template

When researching best practices:

```markdown
## Best Practices: [Topic]

### Industry Standards
- What the leading companies/projects do
- Established patterns and conventions

### Common Approaches
1. **Approach 1**: Description, pros/cons
2. **Approach 2**: Description, pros/cons
3. **Approach 3**: Description, pros/cons

### Recommended Approach
- For beginners: ...
- For production systems: ...
- Trade-offs to consider: ...

### Anti-Patterns to Avoid
- Common mistakes
- Why they're problematic
- How to avoid them

### Code Examples
- Link to reference implementations
- Explanation of key patterns

### Sources
[Numbered list with URLs and dates]
```

## Example Research Output

### Research Request: "Latest ROS 2 navigation stack features"

**Summary**

The ROS 2 Navigation Stack (Nav2) has evolved significantly since its initial release. As of 2024, Nav2 provides a complete autonomous navigation system for mobile robots, including humanoid robots with wheeled bases. The stack includes behavior trees for complex navigation logic, multiple planning algorithms, and extensive plugin support for customization.

Key recent developments include improved dynamic obstacle avoidance, better integration with sensor fusion frameworks, and enhanced support for non-circular robot footprints (critical for humanoid robots).

**Key Findings**

- **Behavior Trees**: Nav2 uses behavior trees (BT.CPP) for flexible navigation logic
- **Plugin Architecture**: Planners, controllers, and recovery behaviors are all plugin-based
- **Costmap 2D**: Sophisticated obstacle representation with multiple layers
- **SLAM Integration**: Works with SLAM Toolbox, Cartographer, and other SLAM solutions
- **Lifecycle Management**: Uses ROS 2 lifecycle nodes for robust state management
- **Multi-robot Support**: Native support for multi-robot coordination

**Technical Details**

- **Supported ROS 2 Versions**: Humble (LTS), Iron, Rolling
- **Planning Algorithms**: NavFn, Smac Planner (hybrid A*, lattice, 2D)
- **Controllers**: DWB, TEB, RPP, MPPI
- **Recovery Behaviors**: Spin, backup, wait
- **Performance**: Real-time capable on modern embedded platforms (Jetson Orin)

**Code Examples**

1. **Official Nav2 Tutorials**: https://navigation.ros.org/tutorials/
2. **Nav2 Simple Commander**: https://github.com/ros-planning/navigation2/tree/main/nav2_simple_commander
3. **Humanoid Navigation Example**: https://github.com/pal-robotics/talos_navigation

**Sources**

1. ROS 2 Navigation Documentation (2024) - https://navigation.ros.org/
2. "Nav2: The Next Generation ROS Navigation Stack" - ROSCon 2023
3. Nav2 GitHub Repository - https://github.com/ros-planning/navigation2
4. "Mobile Robot Navigation with ROS 2" - IEEE RAM 2024
5. Nav2 Discourse Discussions - https://discourse.ros.org/c/nav2/

---

## Research Guidelines

### Version Specificity
Always specify software versions:
- ✅ "ROS 2 Humble Hawksbill (LTS, released May 2022)"
- ❌ "ROS 2"

### Code Verification
Before recommending code:
1. Check if it compiles/runs
2. Verify it's maintained (recent commits)
3. Check for known issues
4. Note any dependencies

### Emerging vs Established
Clearly distinguish:
- **Established**: Widely used, production-ready, stable APIs
- **Emerging**: Cutting-edge, experimental, subject to change
- **Deprecated**: Being phased out, avoid for new projects

### Practical Constraints
Always consider:
- **Compute Requirements**: Can it run on robot hardware?
- **Real-time Performance**: Does it meet control loop timing?
- **Power Consumption**: Critical for mobile/humanoid robots
- **Licensing**: Open source vs proprietary
