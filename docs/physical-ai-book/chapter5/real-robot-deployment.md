# 5.4 Real Robot Deployment

## Learning Objectives

- Understand sim-to-real transfer challenges
- Implement safety mechanisms for real robots
- Deploy trained policies on hardware
- Monitor and debug real-world performance

---

## Introduction

Deploying algorithms from simulation to real robots requires:
- **Safety**: Emergency stops, joint limits, collision avoidance
- **Robustness**: Handle sensor noise, delays, model mismatch
- **Monitoring**: Real-time diagnostics and logging

---

## Sim-to-Real Gap

| Challenge | Solution |
|-----------|----------|
| **Model mismatch** | System identification, adaptive control |
| **Sensor noise** | Kalman filtering, sensor fusion |
| **Delays** | Predictive control, buffering |
| **Unmodeled dynamics** | Domain randomization in sim |

---

## Safety Mechanisms

```python
class SafetyMonitor(Node):
    def __init__(self):
        super().__init__('safety_monitor')
        self.emergency_stop = False
        
    def check_safety(self, state):
        # Joint limit check
        if np.any(state.joint_pos < self.joint_min) or \
           np.any(state.joint_pos > self.joint_max):
            self.trigger_emergency_stop("Joint limit violated")
        
        # Velocity limit check
        if np.any(np.abs(state.joint_vel) > self.vel_max):
            self.trigger_emergency_stop("Velocity too high")
        
        # Torque limit check
        if np.any(np.abs(state.joint_torque) > self.torque_max):
            self.trigger_emergency_stop("Torque too high")
        
        # Tilt check (IMU)
        if state.imu_tilt > 30.0:  # degrees
            self.trigger_emergency_stop("Robot tilting")
    
    def trigger_emergency_stop(self, reason):
        self.get_logger().error(f"EMERGENCY STOP: {reason}")
        self.emergency_stop = True
        # Send zero torques to all joints
        self.send_zero_torques()
```

---

## Deployment Workflow

```python
# 1. Load trained policy
policy = torch.load("trained_policy.pth")
policy.eval()

# 2. Initialize robot interface
robot = RobotInterface()
robot.enable_motors()

# 3. Main control loop
rate = robot.create_rate(100)  # 100 Hz
while not rospy.is_shutdown():
    # Get state
    state = robot.get_state()
    
    # Safety check
    if not safety_monitor.check_safety(state):
        break
    
    # Compute action
    with torch.no_grad():
        obs = preprocess_state(state)
        action = policy(obs)
    
    # Apply action
    robot.set_joint_commands(action)
    
    # Log data
    logger.log(state, action)
    
    rate.sleep()
```

---

## Domain Randomization

Train policies robust to real-world variations:

```python
# In simulation
class RandomizedEnv:
    def reset(self):
        # Randomize physics
        self.mass = np.random.uniform(0.8, 1.2) * self.nominal_mass
        self.friction = np.random.uniform(0.5, 1.5)
        
        # Randomize sensors
        self.imu_noise = np.random.uniform(0.01, 0.05)
        self.joint_noise = np.random.uniform(0.001, 0.01)
        
        # Randomize delays
        self.control_delay = np.random.uniform(0.0, 0.02)  # 0-20ms
```

---

## Monitoring and Debugging

```python
class PerformanceMonitor(Node):
    def __init__(self):
        super().__init__('performance_monitor')
        self.metrics = {
            'control_freq': [],
            'tracking_error': [],
            'power_consumption': [],
        }
    
    def log_metrics(self, state, command):
        # Control frequency
        self.metrics['control_freq'].append(1.0 / dt)
        
        # Tracking error
        error = np.linalg.norm(state.joint_pos - command.joint_pos)
        self.metrics['tracking_error'].append(error)
        
        # Power
        power = np.sum(state.joint_torque * state.joint_vel)
        self.metrics['power_consumption'].append(power)
    
    def publish_diagnostics(self):
        msg = DiagnosticArray()
        msg.status.append(DiagnosticStatus(
            name="Control Frequency",
            message=f"{np.mean(self.metrics['control_freq']):.1f} Hz"
        ))
        self.diagnostics_pub.publish(msg)
```

---

## Key Takeaways

✅ **Safety first**: Implement emergency stops and limit checks  
✅ **Domain randomization** bridges sim-to-real gap  
✅ **Monitoring** enables real-time diagnostics  
✅ **Gradual deployment**: Test in safe environments first

---

**Previous Section**: [← 5.3 Whole-Body Control](./whole-body-control.md)  
**Next Chapter**: [Chapter 6: Conversational Robotics →](../chapter6/index.md)
