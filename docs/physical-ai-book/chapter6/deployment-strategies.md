# 6.3 Deployment Strategies

## Learning Objectives

- Deploy VLA models on edge devices
- Optimize inference for real-time control
- Implement model quantization and pruning
- Monitor deployed models in production

---

## Introduction

Deploying VLAs on robots requires:
- **Low latency**: &lt;100ms for reactive control
- **Efficiency**: Run on limited compute (Jetson, edge TPU)
- **Reliability**: Handle failures gracefully

---

## Model Optimization

### Quantization

```python
import torch

# Load full-precision model
model = RT2ForConditionalGeneration.from_pretrained("google/rt-2-base")

# Quantize to INT8
quantized_model = torch.quantization.quantize_dynamic(
    model,
    {torch.nn.Linear},
    dtype=torch.qint8
)

# Save quantized model
torch.save(quantized_model.state_dict(), "rt2_int8.pth")

# Inference speedup: 2-4x, model size: 4x smaller
```

### Pruning

```python
import torch.nn.utils.prune as prune

# Prune 30% of weights
for module in model.modules():
    if isinstance(module, torch.nn.Linear):
        prune.l1_unstructured(module, name='weight', amount=0.3)

# Make pruning permanent
for module in model.modules():
    if isinstance(module, torch.nn.Linear):
        prune.remove(module, 'weight')
```

---

## Edge Deployment

### NVIDIA Jetson

```python
# Convert to TensorRT
import tensorrt as trt

# Build TensorRT engine
with trt.Builder(TRT_LOGGER) as builder:
    network = builder.create_network()
    # ... build network from ONNX ...
    engine = builder.build_cuda_engine(network)

# Inference
with engine.create_execution_context() as context:
    # Allocate buffers
    inputs, outputs, bindings = allocate_buffers(engine)
    
    # Run inference
    context.execute_v2(bindings=bindings)
```

### Google Coral TPU

```python
from pycoral.utils import edgetpu
from pycoral.adapters import common

# Load TPU model
interpreter = edgetpu.make_interpreter("model_edgetpu.tflite")
interpreter.allocate_tensors()

# Inference
common.set_input(interpreter, input_data)
interpreter.invoke()
output = common.output_tensor(interpreter, 0)
```

---

## Real-Time Control Loop

```python
class RealtimeVLAController(Node):
    def __init__(self):
        super().__init__('vla_controller')
        self.model = load_optimized_model()
        self.control_rate = 10  # Hz
        
    def control_loop(self):
        rate = self.create_rate(self.control_rate)
        
        while rclpy.ok():
            start_time = time.time()
            
            # Get observation
            obs = self.get_observation()
            
            # Inference
            with torch.no_grad():
                action = self.model(obs)
            
            # Send command
            self.robot.execute(action)
            
            # Check latency
            latency = time.time() - start_time
            if latency > 0.1:  # 100ms
                self.get_logger().warn(f"High latency: {latency*1000:.1f}ms")
            
            rate.sleep()
```

---

## Monitoring and Logging

```python
class ModelMonitor:
    def __init__(self):
        self.metrics = {
            'inference_time': [],
            'success_rate': [],
            'failure_modes': {},
        }
    
    def log_inference(self, obs, action, result):
        # Log inference time
        self.metrics['inference_time'].append(result.latency)
        
        # Log success/failure
        if result.success:
            self.metrics['success_rate'].append(1.0)
        else:
            self.metrics['success_rate'].append(0.0)
            
            # Track failure mode
            mode = result.failure_mode
            self.metrics['failure_modes'][mode] = \
                self.metrics['failure_modes'].get(mode, 0) + 1
    
    def publish_diagnostics(self):
        avg_latency = np.mean(self.metrics['inference_time'])
        success_rate = np.mean(self.metrics['success_rate'])
        
        self.get_logger().info(
            f"Latency: {avg_latency*1000:.1f}ms, "
            f"Success: {success_rate*100:.1f}%"
        )
```

---

## Fallback Strategies

```python
class RobustVLAController:
    def predict_with_fallback(self, obs):
        try:
            # Try VLA model
            action = self.vla_model(obs)
            
            # Validate action
            if self.is_valid_action(action):
                return action
            else:
                raise ValueError("Invalid action")
                
        except Exception as e:
            self.get_logger().warn(f"VLA failed: {e}, using fallback")
            
            # Fallback to scripted policy
            return self.scripted_policy(obs)
```

---

## Key Takeaways

✅ **Quantization** reduces model size and speeds up inference  
✅ **Edge deployment** enables on-robot inference  
✅ **Real-time control** requires &lt;100ms latency  
✅ **Monitoring** tracks performance in production  
✅ **Fallbacks** ensure safety when models fail

---

## Course Summary

Congratulations! You've completed **Physical AI & Humanoid Robotics**. You now understand:

**Chapter 1**: Physical AI foundations, sensors, humanoid landscape  
**Chapter 2**: ROS 2 architecture, nodes, packages, launch files  
**Chapter 3**: Gazebo simulation, URDF, ROS 2 integration  
**Chapter 4**: NVIDIA Isaac Sim, Isaac Gym, synthetic data  
**Chapter 5**: Locomotion, manipulation, whole-body control, deployment  
**Chapter 6**: VLAs, multimodal integration, deployment strategies

**Next Steps**:
- Build your own humanoid robot project
- Contribute to open-source robotics
- Join the Physical AI community
- Continue learning with advanced courses

**Thank you for learning with us!** 🤖

---

**Previous Section**: [← 6.2 Multimodal Integration](./multimodal-integration.md)  
**End of Textbook** 🎓
