# 5.2 Manipulation and Grasping

## Learning Objectives

- Understand inverse kinematics for manipulation
- Implement grasp planning algorithms
- Use force/torque feedback for stable grasps
- Train RL policies for dexterous manipulation

---

## Introduction

**Manipulation** is the ability to interact with objects. For humanoid robots, this involves:
- **Reaching**: Moving the arm to a target pose
- **Grasping**: Securely holding objects
- **Manipulation**: Moving grasped objects

---

## Inverse Kinematics (IK)

IK computes joint angles to achieve a desired end-effector pose:

```python
from scipy.optimize import minimize

def inverse_kinematics(target_pos, target_orient, initial_guess):
    """
    Solve IK using numerical optimization
    """
    def cost_function(joint_angles):
        # Forward kinematics
        ee_pos, ee_orient = forward_kinematics(joint_angles)
        
        # Position error
        pos_error = np.linalg.norm(ee_pos - target_pos)
        
        # Orientation error
        orient_error = orientation_distance(ee_orient, target_orient)
        
        return pos_error + orient_error
    
    result = minimize(cost_function, initial_guess, method='SLSQP')
    return result.x
```

---

## Grasp Planning

```python
# Parallel jaw gripper
def compute_grasp_pose(object_mesh):
    # Find antipodal grasp points
    points = sample_surface_points(object_mesh, n=1000)
    
    best_grasp = None
    best_score = -np.inf
    
    for p1 in points:
        for p2 in points:
            if is_antipodal(p1, p2, object_mesh):
                score = grasp_quality(p1, p2, object_mesh)
                if score > best_score:
                    best_score = score
                    best_grasp = (p1, p2)
    
    return best_grasp
```

---

## Force Control

```python
class ForceController(Node):
    def __init__(self):
        super().__init__('force_controller')
        self.ft_sub = self.create_subscription(
            WrenchStamped, '/ft_sensor', self.ft_callback, 10
        )
        self.target_force = 5.0  # Newtons
        
    def ft_callback(self, msg):
        current_force = msg.wrench.force.z
        
        # PI controller
        error = self.target_force - current_force
        control = self.kp * error + self.ki * self.integral
        
        # Adjust gripper position
        self.gripper_pub.publish(Float64(data=control))
```

---

## RL for Dexterous Manipulation

```python
class ManipulationEnv:
    def compute_reward(self):
        # Object-to-goal distance
        dist_reward = -torch.norm(self.object_pos - self.goal_pos, dim=-1)
        
        # Grasp stability
        grasp_reward = self.is_grasped.float() * 10.0
        
        # Success bonus
        success_reward = self.success.float() * 100.0
        
        return dist_reward + grasp_reward + success_reward
```

---

## Key Takeaways

✅ **IK** computes joint angles for desired end-effector poses  
✅ **Grasp planning** finds stable contact points  
✅ **Force control** maintains desired contact forces  
✅ **RL** learns dexterous manipulation policies

---

**Previous Section**: [← 5.1 Locomotion Control](./locomotion-control.md)  
**Next Section**: [5.3 Whole-Body Control →](./whole-body-control.md)
