# 4.3 Synthetic Data Generation

## Learning Objectives

- Generate synthetic training data for perception
- Use domain randomization for sim-to-real transfer
- Create labeled datasets (bounding boxes, segmentation)
- Leverage Isaac Sim Replicator for data generation

---

## Introduction

**Synthetic data** is computer-generated training data that mimics real-world scenarios. Isaac Sim excels at generating:
- **RGB images** with perfect labels
- **Depth maps** and **semantic segmentation**
- **3D bounding boxes** for object detection
- **Diverse scenarios** via domain randomization

---

## Why Synthetic Data?

| Real Data | Synthetic Data |
|-----------|----------------|
| Expensive to collect | **Free** |
| Hard to label | **Auto-labeled** |
| Limited diversity | **Infinite variations** |
| Privacy concerns | **No privacy issues** |

---

## Isaac Replicator

```python
import omni.replicator.core as rep

# Create camera
camera = rep.create.camera(position=(2, 0, 1))

# Randomize lighting
with rep.trigger.on_frame():
    rep.randomizer.light(
        intensity=(500, 2000),
        temperature=(3000, 6500)
    )

# Randomize object poses
with rep.trigger.on_frame():
    rep.randomizer.scatter_2d(
        objects=rep.get.prims(path_pattern="/World/Objects/*"),
        surface="/World/Ground"
    )

# Generate 1000 images
rep.orchestrator.run(num_frames=1000)
```

---

## Domain Randomization

```python
# Randomize textures
rep.randomizer.materials(
    prims=rep.get.prims(path_pattern="/World/Robot/*"),
    project_uvw=True
)

# Randomize colors
rep.randomizer.color(
    prims=rep.get.prims(path_pattern="/World/*"),
    colors=rep.distribution.uniform((0, 0, 0), (1, 1, 1))
)

# Randomize physics
rep.physics.randomize_mass(
    prims=rep.get.prims(path_pattern="/World/Objects/*"),
    min_mass=0.5,
    max_mass=2.0
)
```

---

## Exporting Labeled Data

```python
# RGB + Depth + Segmentation
writer = rep.WriterRegistry.get("BasicWriter")
writer.initialize(
    output_dir="./output",
    rgb=True,
    depth=True,
    semantic_segmentation=True,
    bounding_box_2d_tight=True
)

rep.orchestrator.run()
```

**Output**:
```
output/
├── rgb_0000.png
├── depth_0000.npy
├── semantic_0000.png
└── bbox_0000.json
```

---

## Key Takeaways

✅ **Synthetic data** is free, auto-labeled, and infinitely diverse  
✅ **Domain randomization** improves sim-to-real transfer  
✅ **Isaac Replicator** automates data generation  
✅ **Perfect labels** for segmentation, detection, depth

---

**Previous Section**: [← 4.2 Isaac Gym for RL](./isaac-gym-rl.md)  
**Next Section**: [4.4 Isaac ROS 2 Bridge →](./isaac-ros2-bridge.md)
