# 4.2 Isaac Gym for Reinforcement Learning

## Learning Objectives

- Understand Isaac Gym's tensor-based API for RL
- Create parallel training environments
- Train humanoid locomotion policies
- Use GPU-accelerated RL algorithms
- Integrate with popular RL frameworks (Stable Baselines3, RLlib)

---

## Introduction

**Isaac Gym** is NVIDIA's physics simulation environment optimized for reinforcement learning. Unlike traditional simulators, Isaac Gym provides **direct GPU tensor access** to physics states, enabling:
- Training on **thousands of parallel environments**
- **10-100x faster** than CPU-based RL
- Seamless integration with PyTorch/JAX

---

## Key Features

| Feature | Traditional RL | Isaac Gym |
|---------|---------------|-----------|
| **Environments** | 8-16 (CPU) | **4096+** (GPU) |
| **Physics** | CPU | **GPU (PhysX)** |
| **Data Transfer** | CPU ↔ GPU | **GPU-only** |
| **Training Speed** | 1x | **10-100x** |

---

## Tensor API Example

```python
from isaacgym import gymapi
import torch

# Create gym
gym = gymapi.acquire_gym()

# Create 1024 parallel environments
num_envs = 1024
envs = []
for i in range(num_envs):
    env = gym.create_env(sim, env_lower, env_upper, num_per_row)
    envs.append(env)

# Get states as GPU tensors (no CPU transfer!)
root_states = gym.acquire_actor_root_state_tensor(sim)
dof_states = gym.acquire_dof_state_tensor(sim)

# PyTorch tensors on GPU
root_tensor = gymtorch.wrap_tensor(root_states)
dof_tensor = gymtorch.wrap_tensor(dof_states)

# Apply actions (all envs simultaneously)
gym.set_dof_position_target_tensor(sim, actions_tensor)
```

---

## Humanoid Locomotion Example

```python
class HumanoidEnv:
    def __init__(self, num_envs=1024):
        self.num_envs = num_envs
        self.device = "cuda:0"
        
    def reset(self):
        # Reset all envs in parallel
        return self.obs_buf.clone()
    
    def step(self, actions):
        # Apply actions to all robots
        self.gym.set_dof_position_target_tensor(
            self.sim, 
            gymtorch.unwrap_tensor(actions)
        )
        
        # Step physics (GPU)
        self.gym.simulate(self.sim)
        self.gym.fetch_results(self.sim, True)
        
        # Compute rewards (GPU)
        rewards = self.compute_rewards()
        
        return self.obs_buf, rewards, self.reset_buf, {}
```

---

## Training with PPO

```python
from stable_baselines3 import PPO

env = HumanoidEnv(num_envs=2048)

model = PPO(
    "MlpPolicy",
    env,
    n_steps=16,
    batch_size=32768,
    device="cuda"
)

model.learn(total_timesteps=10_000_000)
```

**Training Time**:
- CPU (16 envs): ~48 hours
- Isaac Gym (2048 envs): **~2 hours** ⚡

---

## Key Takeaways

✅ **Tensor API** eliminates CPU-GPU transfers  
✅ **Massively parallel** (1000+ environments)  
✅ **10-100x faster** RL training  
✅ **PyTorch integration** for easy RL workflows

---

**Previous Section**: [← 4.1 Isaac Sim Architecture](./isaac-sim-architecture.md)  
**Next Section**: [4.3 Synthetic Data Generation →](./synthetic-data.md)
