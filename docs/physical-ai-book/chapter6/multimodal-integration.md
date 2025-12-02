# 6.2 Multimodal Integration

## Learning Objectives

- Integrate vision, language, and proprioception
- Implement sensor fusion for VLAs
- Handle temporal information (video, history)
- Build multimodal observation spaces

---

## Introduction

**Multimodal integration** combines multiple sensor modalities:
- **Vision**: RGB, depth, segmentation
- **Language**: Commands, descriptions, feedback
- **Proprioception**: Joint positions, velocities, forces
- **Audio**: Speech, environmental sounds

---

## Multimodal Observation Space

```python
class MultimodalObservation:
    def __init__(self):
        self.rgb = None          # (H, W, 3)
        self.depth = None        # (H, W, 1)
        self.language = None     # String
        self.joint_pos = None    # (n_joints,)
        self.joint_vel = None    # (n_joints,)
        self.gripper_force = None  # Scalar
        
    def to_tensor(self):
        # Encode vision
        vision_features = vision_encoder(self.rgb, self.depth)
        
        # Encode language
        lang_features = language_encoder(self.language)
        
        # Concatenate all modalities
        obs = torch.cat([
            vision_features,
            lang_features,
            self.joint_pos,
            self.joint_vel,
            self.gripper_force
        ])
        
        return obs
```

---

## Temporal Integration

```python
class TemporalVLA:
    def __init__(self, history_length=10):
        self.history = deque(maxlen=history_length)
        
    def predict(self, current_obs):
        # Add to history
        self.history.append(current_obs)
        
        # Stack history
        obs_sequence = torch.stack(list(self.history))
        
        # Temporal encoding (LSTM or Transformer)
        temporal_features = self.temporal_encoder(obs_sequence)
        
        # Predict action
        action = self.policy(temporal_features)
        
        return action
```

---

## Sensor Fusion

```python
class SensorFusion:
    def fuse_depth_sources(self, stereo_depth, lidar_depth):
        """
        Fuse stereo camera depth with LiDAR depth
        """
        # Kalman filter fusion
        fused_depth = self.kalman_filter.update(
            measurement_1=stereo_depth,
            measurement_2=lidar_depth,
            covariance_1=stereo_cov,
            covariance_2=lidar_cov
        )
        
        return fused_depth
```

---

## Audio Integration

```python
from transformers import WhisperProcessor, WhisperForConditionalGeneration

# Speech-to-text
processor = WhisperProcessor.from_pretrained("openai/whisper-base")
model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-base")

# Process audio
audio = microphone.get_audio()
inputs = processor(audio, return_tensors="pt", sampling_rate=16000)
predicted_ids = model.generate(inputs.input_features)

# Decode to text
transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]

# Use as language input
action = vla_model.predict(
    image=camera.get_rgb(),
    instruction=transcription,
    robot_state=robot.get_state()
)
```

---

## Key Takeaways

✅ **Multimodal** observations improve robustness  
✅ **Temporal** information captures dynamics  
✅ **Sensor fusion** combines complementary modalities  
✅ **Audio** enables voice control

---

**Previous Section**: [← 6.1 VLA Foundations](./vla-foundations.md)  
**Next Section**: [6.3 Deployment Strategies →](./deployment-strategies.md)
