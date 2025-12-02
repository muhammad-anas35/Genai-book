# 5.3 Whole-Body Control

## Learning Objectives

- Understand hierarchical control for humanoids
- Implement task-space control
- Coordinate locomotion and manipulation
- Use quadratic programming for whole-body optimization

---

## Introduction

**Whole-body control** coordinates all joints to achieve multiple simultaneous tasks:
- Walk while carrying an object
- Maintain balance while reaching
- Avoid obstacles with arms and legs

---

## Hierarchical Task Control

```python
# Task hierarchy (priority order)
tasks = [
    ("balance", priority=1),      # Highest priority
    ("walk_forward", priority=2),
    ("reach_target", priority=3),
    ("look_at_object", priority=4)  # Lowest priority
]

# Solve with null-space projection
def solve_hierarchical_control(tasks):
    q_dot = np.zeros(n_dof)
    P = np.eye(n_dof)  # Null-space projector
    
    for task_name, priority in tasks:
        J = task_jacobian(task_name)
        x_dot_des = task_velocity(task_name)
        
        # Project into null-space of higher-priority tasks
        J_proj = J @ P
        
        # Solve for this task
        q_dot_task = np.linalg.pinv(J_proj) @ (x_dot_des - J @ q_dot)
        q_dot += q_dot_task
        
        # Update null-space projector
        P = P @ (np.eye(n_dof) - np.linalg.pinv(J_proj) @ J_proj)
    
    return q_dot
```

---

## Quadratic Programming (QP)

```python
import cvxpy as cp

# Decision variables
q_ddot = cp.Variable(n_dof)  # Joint accelerations
contact_forces = cp.Variable(n_contacts * 3)

# Objective: minimize control effort
cost = cp.sum_squares(q_ddot)

# Constraints
constraints = [
    # Dynamics: M*q_ddot + C = tau + J^T*f
    M @ q_ddot + C == tau + J.T @ contact_forces,
    
    # Friction cone
    friction_cone(contact_forces),
    
    # Joint limits
    q_ddot_min <= q_ddot, q_ddot <= q_ddot_max,
]

# Solve
prob = cp.Problem(cp.Minimize(cost), constraints)
prob.solve()
```

---

## Locomotion + Manipulation

```python
class WholeBodyController:
    def compute_control(self, state, targets):
        # Task 1: Maintain CoM over support polygon
        com_task = self.com_controller(state.com, targets.com)
        
        # Task 2: Swing foot trajectory
        swing_task = self.swing_controller(state.swing_foot, targets.swing_foot)
        
        # Task 3: Reach with hand
        reach_task = self.reach_controller(state.hand_pos, targets.hand_pos)
        
        # Solve QP with all tasks
        return self.qp_solver([com_task, swing_task, reach_task])
```

---

## Key Takeaways

✅ **Hierarchical control** prioritizes tasks (balance > locomotion > manipulation)  
✅ **Null-space projection** satisfies lower-priority tasks without affecting higher ones  
✅ **QP** optimizes control while respecting constraints  
✅ **Whole-body** enables complex behaviors (walk + reach + look)

---

**Previous Section**: [← 5.2 Manipulation and Grasping](./manipulation-grasping.md)  
**Next Section**: [5.4 Real Robot Deployment →](./real-robot-deployment.md)
