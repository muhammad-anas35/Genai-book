# 6.1 Vision-Language-Action (VLA) Foundations

## Learning Objectives

- Understand Vision-Language-Action models
- Explore foundation models for robotics (RT-2, PaLM-E, π0)
- Implement VLA inference for robot control
- Fine-tune VLAs for custom tasks

---

## Introduction

**Vision-Language-Action (VLA) models** are foundation models that:
- **See**: Process visual input (cameras)
- **Understand**: Interpret natural language commands
- **Act**: Generate robot actions

Examples: **RT-2** (Google), **PaLM-E** (Google), **π0** (Physical Intelligence)

---

## VLA Architecture

```
┌─────────────┐
│   Camera    │ ──▶ Vision Encoder (ViT)
└─────────────┘              │
                             ▼
┌─────────────┐        ┌──────────┐
│  "Pick up   │ ──▶    │   LLM    │ ──▶ Action Tokens
│  the cup"   │        │ (7B-540B)│
└─────────────┘        └──────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Action Decoder │
                    └────────────────┘
                             │
                             ▼
                    [x, y, z, gripper]
```

---

## RT-2 Example

```python
from transformers import RT2ForConditionalGeneration, AutoProcessor

# Load RT-2 model
model = RT2ForConditionalGeneration.from_pretrained("google/rt-2-base")
processor = AutoProcessor.from_pretrained("google/rt-2-base")

# Get observation
image = camera.get_rgb()
text = "pick up the red block"

# Inference
inputs = processor(text=text, images=image, return_tensors="pt")
outputs = model.generate(**inputs)

# Decode action
action = processor.decode(outputs[0])
# action = {"x": 0.5, "y": 0.3, "z": 0.2, "gripper": 1.0}
```

---

## π0 (Pi-Zero)

Physical Intelligence's **π0** is a generalist robot policy:
- Trained on **10,000+ hours** of robot data
- Handles **diverse tasks** (folding, assembly, cleaning)
- **Zero-shot** generalization to new objects

```python
# π0 API (hypothetical)
from pi_zero import Pi0Policy

policy = Pi0Policy.from_pretrained("pi0-1.5b")

# Natural language command
action = policy.predict(
    image=camera.get_rgb(),
    instruction="fold the shirt",
    robot_state=robot.get_state()
)

robot.execute(action)
```

---

## Fine-Tuning VLAs

```python
from transformers import Trainer, TrainingArguments

# Prepare dataset
dataset = load_robot_dataset("custom_tasks")

# Training arguments
training_args = TrainingArguments(
    output_dir="./rt2_finetuned",
    num_train_epochs=10,
    per_device_train_batch_size=8,
    learning_rate=1e-5,
)

# Fine-tune
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
)

trainer.train()
```

---

## Key Takeaways

✅ **VLAs** combine vision, language, and action in one model  
✅ **Foundation models** (RT-2, π0) enable zero-shot robot control  
✅ **Fine-tuning** adapts VLAs to custom tasks  
✅ **Natural language** makes robots accessible to non-experts

---

**Previous Chapter**: [← Chapter 5: Humanoid Development](../chapter5/real-robot-deployment.md)  
**Next Section**: [6.2 Multimodal Integration →](./multimodal-integration.md)
