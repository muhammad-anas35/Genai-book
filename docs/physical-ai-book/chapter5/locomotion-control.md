# 5.1 Locomotion Control

## Learning Objectives

- Understand bipedal walking dynamics
- Implement Zero Moment Point (ZMP) control
- Use Model Predictive Control (MPC) for locomotion
- Train RL-based walking policies
- Deploy locomotion controllers on real humanoids

---

## Introduction

**Locomotion** is the ability to move through an environment. For humanoid robots, bipedal walking is one of the most challenging control problems due to:
- **Underactuation**: Fewer actuators than degrees of freedom
- **Contact dynamics**: Complex foot-ground interactions
- **Balance**: Maintaining stability while moving

---

## Zero Moment Point (ZMP)

**ZMP** is a point on the ground where the net moment from contact forces is zero. For stable walking:
- ZMP must stay **inside the support polygon** (foot contact area)

```python
def compute_zmp(com_pos, com_acc, gravity=9.81):
    """
    Compute ZMP from center of mass (CoM) state
    """
    zmp_x = com_pos[0] - (com_pos[2] / gravity) * com_acc[0]
    zmp_y = com_pos[1] - (com_pos[2] / gravity) * com_acc[1]
    return [zmp_x, zmp_y]

# Check stability
def is_stable(zmp, support_polygon):
    return point_in_polygon(zmp, support_polygon)
```

---

## Model Predictive Control (MPC)

MPC plans future trajectories by solving an optimization problem:

```python
import casadi as ca

# Define optimization problem
opti = ca.Opti()

# Decision variables (foot positions over horizon)
N = 20  # Horizon steps
foot_pos = opti.variable(N, 3)

# Objective: minimize CoM tracking error
com_ref = [0, 0, 0.9]  # Desired CoM height
cost = ca.sumsqr(com_pos - com_ref)

# Constraints: ZMP stability
for k in range(N):
    zmp = compute_zmp(com_pos[k], com_acc[k])
    opti.subject_to(zmp_in_support(zmp, foot_pos[k]))

# Solve
opti.minimize(cost)
sol = opti.solve()
```

---

## RL-Based Locomotion

Train walking policies with Isaac Gym:

```python
class HumanoidWalkEnv:
    def compute_reward(self):
        # Forward velocity reward
        vel_reward = self.base_lin_vel[0]
        
        # Upright orientation reward
        up_reward = torch.sum(self.base_quat[:, 2])
        
        # Energy penalty
        energy_penalty = -0.01 * torch.sum(self.dof_vel ** 2)
        
        return vel_reward + up_reward + energy_penalty
```

**Training**:
- 2048 parallel environments
- PPO algorithm
- 10M timesteps (~2 hours on RTX 4090)

---

## Deployment Example

```python
# Load trained policy
policy = torch.load("humanoid_walk.pth")

# ROS 2 node for real robot
class LocomotionController(Node):
    def __init__(self):
        super().__init__('locomotion_controller')
        self.joint_pub = self.create_publisher(
            JointTrajectory, '/joint_commands', 10
        )
        
    def control_loop(self, obs):
        with torch.no_grad():
            actions = policy(obs)
        
        # Send to robot
        msg = JointTrajectory()
        msg.points = [JointTrajectoryPoint(positions=actions.tolist())]
        self.joint_pub.publish(msg)
```

---

## Key Takeaways

✅ **ZMP** ensures stability by keeping balance point in support polygon  
✅ **MPC** plans optimal trajectories with constraints  
✅ **RL** learns robust policies from simulation  
✅ **Sim-to-real** transfer requires domain randomization

---

**Previous Chapter**: [← Chapter 4: NVIDIA Isaac](../chapter4/isaac-ros2-bridge.md)  
**Next Section**: [5.2 Manipulation and Grasping →](./manipulation-grasping.md)
