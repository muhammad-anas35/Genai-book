---
title: "Chapter 12: ROS 2 Architecture"
sidebar_label: "Chapter 12: ROS 2 Architecture"
---


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="language">
<TabItem value="en" label="English">

# Chapter 12: ROS 2 Architecture

## Learning Objectives

By the end of this section, you will be able to:
- Understand the ROS 2 architecture and its key components
- Explain the role of DDS middleware in ROS 2
- Compare ROS 2 with ROS 1 and understand the improvements
- Describe the ROS 2 graph and node discovery mechanism
- Configure Quality of Service (QoS) policies for reliable communication

---

## Introduction

**ROS 2 (Robot Operating System 2)** is not an operating system in the traditional sense—it's a middleware framework that provides libraries, tools, and conventions for building complex robot software. Think of it as the "nervous system" that connects sensors, actuators, and intelligence in a robot.

This section introduces the architecture of ROS 2, focusing on the fundamental design decisions that make it suitable for production robotics, from research labs to commercial humanoid robots.

---

## Why ROS 2?

### The Evolution from ROS 1

ROS 1 (released in 2007) revolutionized robotics research but had limitations for production systems:

| Limitation | ROS 1 | ROS 2 |
|------------|-------|-------|
| **Single Point of Failure** | roscore (master) required | Distributed discovery (no master) |
| **Real-Time Support** | Limited | Built-in DDS with real-time capabilities |
| **Multi-Robot** | Difficult | Native support via DDS |
| **Security** | None | DDS Security (SROS2) |
| **Platform Support** | Linux-focused | Linux, Windows, macOS, RTOS |
| **Communication** | Custom TCPROS/UDPROS | Industry-standard DDS |

**Key Insight**: ROS 2 was designed from the ground up for **production robotics**, not just research.

---

## ROS 2 Architecture Overview

### The ROS 2 Graph

At its core, ROS 2 is a **graph of nodes** that communicate via **topics**, **services**, and **actions**.

```
┌─────────────┐         Topic: /cmd_vel          ┌─────────────┐
│   Planner   │────────────────────────────────▶│   Motor     │
│    Node     │                                  │  Controller │
└─────────────┘                                  └─────────────┘
       │                                                 │
       │ Service: /get_plan                             │
       │                                                 │
       ▼                                                 ▼
┌─────────────┐         Topic: /odom            ┌─────────────┐
│  Localization│◀────────────────────────────────│   Sensors   │
│    Node     │                                  │    Node     │
└─────────────┘                                  └─────────────┘
```

**Components**:
- **Nodes**: Independent processes that perform computation
- **Topics**: Asynchronous, many-to-many data streams
- **Services**: Synchronous, request-reply interactions
- **Actions**: Long-running tasks with feedback and cancellation

---

## DDS: The Middleware Layer

### What is DDS?

**DDS (Data Distribution Service)** is an industry-standard middleware for real-time, distributed systems. ROS 2 uses DDS as its communication layer, replacing the custom protocols of ROS 1.

**Why DDS?**
- **Proven Technology**: Used in aerospace, defense, and automotive industries
- **Real-Time**: Deterministic communication with QoS guarantees
- **Scalable**: Supports thousands of nodes across networks
- **Interoperable**: Multiple vendor implementations (Fast DDS, Cyclone DDS, RTI Connext)

### DDS Vendors in ROS 2 Humble

ROS 2 Humble supports multiple DDS implementations:

| DDS Vendor | Default? | License | Best For |
|------------|----------|---------|----------|
| **Fast DDS** (eProsima) | ✅ Yes | Apache 2.0 | General use, education |
| **Cyclone DDS** (Eclipse) | No | EPL 2.0 | Performance, embedded |
| **RTI Connext DDS** | No | Commercial | Industrial, safety-critical |
| **GurumDDS** | No | Commercial | Automotive |

**For this course**: We use **Fast DDS** (the default).

### How DDS Works

1. **Discovery**: Nodes automatically discover each other on the network (no master required)
2. **Matching**: Publishers and subscribers with matching topics/types connect
3. **Data Exchange**: Messages flow directly between nodes (peer-to-peer)
4. **QoS Enforcement**: DDS ensures reliability, latency, and bandwidth requirements

---

## Quality of Service (QoS)

QoS policies define **how** data is transmitted, allowing fine-grained control over reliability, latency, and resource usage.

### Key QoS Policies

#### **Reliability**
- **Reliable**: Guarantees message delivery (TCP-like)
  - Use for: Commands, critical data
- **Best Effort**: No delivery guarantee (UDP-like)
  - Use for: Sensor streams where latest data matters

#### **Durability**
- **Transient Local**: Late-joining subscribers receive last message
  - Use for: Configuration, map data
- **Volatile**: Only live data (default)
  - Use for: Real-time sensor streams

#### **History**
- **Keep Last (N)**: Store last N messages
- **Keep All**: Store all messages (until resource limits)

#### **Deadline**
- Maximum time between messages
- Triggers callback if violated

### QoS Profiles

ROS 2 provides preset profiles:

```python
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy

# Chapter 12: Sensor data (best effort, volatile)
sensor_qos = QoSProfile(
    reliability=ReliabilityPolicy.BEST_EFFORT,
    durability=DurabilityPolicy.VOLATILE,
    depth=10
)

# Chapter 12: System state (reliable, transient local)
system_qos = QoSProfile(
    reliability=ReliabilityPolicy.RELIABLE,
    durability=DurabilityPolicy.TRANSIENT_LOCAL,
    depth=10
)
```

---

## ROS 2 vs ROS 1: Key Differences

### Architecture

**ROS 1**:
```
All Nodes ──▶ roscore (Master) ◀── All Nodes
              Single Point of Failure
```

**ROS 2**:
```
Node A ◀──▶ DDS Discovery ◀──▶ Node B
Node C ◀──▶ DDS Discovery ◀──▶ Node D
        Distributed, No Master
```

### Communication

| Feature | ROS 1 | ROS 2 |
|---------|-------|-------|
| **Protocol** | Custom TCPROS/UDPROS | DDS (RTPS) |
| **Discovery** | Centralized (roscore) | Distributed (DDS) |
| **Real-Time** | No | Yes (with DDS) |
| **QoS** | Limited | Extensive |
| **Security** | None | DDS Security |

### Lifecycle Management

ROS 2 introduces **managed nodes** with explicit lifecycle states:

```
┌──────────┐
│Unconfigured│
└─────┬──────┘
      │ configure()
      ▼
┌──────────┐
│ Inactive │
└─────┬──────┘
      │ activate()
      ▼
┌──────────┐
│  Active  │
└─────┬──────┘
      │ deactivate()
      ▼
┌──────────┐
│ Inactive │
└──────────┘
```

This allows deterministic startup/shutdown, crucial for safety-critical systems.

---

## ROS 2 Distributions

ROS 2 follows a **time-based release schedule** with LTS (Long-Term Support) versions:

| Distribution | Release Date | Support Until | Python | Ubuntu |
|--------------|--------------|---------------|--------|--------|
| **Humble Hawksbill** | May 2022 | May 2027 | 3.10 | 22.04 |
| Jazzy Jalisco | May 2024 | May 2026 | 3.12 | 24.04 |
| Kilted Kaiju | May 2025 | TBD | 3.12+ | 24.04 |

**For this course**: We use **ROS 2 Humble** (LTS).

---

## Key Takeaways

✅ **ROS 2** is a middleware framework for building robot software, not an OS

✅ **DDS** provides industry-standard, real-time communication (replacing ROS 1's custom protocols)

✅ **No Master**: Distributed discovery eliminates single point of failure

✅ **QoS Policies**: Fine-grained control over reliability, latency, and durability

✅ **Production-Ready**: Designed for commercial robots, not just research

✅ **Humble Hawksbill**: LTS version supported until 2027

---

## Reflection Questions

1. Why is the elimination of the roscore master a significant improvement in ROS 2?
2. In what scenarios would you use "Best Effort" reliability vs. "Reliable"?
3. How does DDS enable multi-robot systems more easily than ROS 1?
4. What are the trade-offs between different DDS vendors?

---

## Further Reading

- **ROS 2 Design**: [design.ros2.org](https://design.ros2.org)
- **DDS Specification**: [OMG DDS](https://www.omg.org/spec/DDS/)
- **ROS 2 Humble Documentation**: [docs.ros.org/en/humble](https://docs.ros.org/en/humble/)
- **Fast DDS Documentation**: [fast-dds.docs.eprosima.com](https://fast-dds.docs.eprosima.com)

---

**Previous Chapter**: [← Chapter 1: Introduction to Physical AI](../../part1/chapter4/index.md)  
**Next Section**: [2.2 Nodes and Communication →](../chapter9/index.md)

</TabItem>
<TabItem value="ur" label="Urdu">

# Chapter 12: ROS 2 کا آرکیٹیکچر (Architecture)

## سیکھنے کے مقاصد (Learning Objectives)

اس سیکشن کے اختتام تک، آپ اس قابل ہو جائیں گے کہ:
- ROS 2 کے آرکیٹیکچر اور اس کے اہم اجزاء کو سمجھ سکیں
- ROS 2 میں DDS مڈل ویئر کے کردار کی وضاحت کر سکیں
- ROS 2 کا ROS 1 سے موازنہ کر سکیں اور بہتریوں کو سمجھ سکیں
- ROS 2 گراف اور نوڈ ڈسکوری (Node Discovery) کے طریقہ کار کو بیان کر سکیں
- قابل بھروسہ مواصلات کے لیے Quality of Service (QoS) پالیسیز کو کنفیگر کر سکیں

---

## تعارف (Introduction)

**ROS 2 (Robot Operating System 2)** روایتی معنوں میں ایک آپریٹنگ سسٹم نہیں ہے — یہ ایک مڈل ویئر فریم ورک (Middleware Framework) ہے جو پیچیدہ روبوٹ سافٹ ویئر بنانے کے لیے لائبریریز، ٹولز اور روایات فراہم کرتا ہے۔ اسے ایک روبوٹ کے "اعصابی نظام" کے طور پر سمجھیں جو سینسرز، ایکچویٹرز اور ذہانت کو آپس میں جوڑتا ہے۔

یہ سیکشن ROS 2 کے آرکیٹیکچر کا تعارف کرواتا ہے، ان بنیادی ڈیزائن فیصلوں پر توجہ مرکوز کرتا ہے جو اسے کمرشل ہیومنائیڈ روبوٹس اور تحقیقی لیبارٹریوں کے لیے موزوں بناتے ہیں۔

---

## ROS 2 کیوں؟

### ROS 1 سے ارتقاء (Evolution)

ROS 1 (جو 2007 میں جاری ہوا) نے روبوٹکس ریسرچ میں انقلاب برپا کر دیا لیکن اس میں پروڈکشن سسٹمز کے لیے کچھ حدود تھیں:

| حد (Limitation) | ROS 1 | ROS 2 |
|------------|-------|-------|
| **Single Point of Failure** | roscore (master) درکار تھا | تقسیم شدہ دریافت (Distributed discovery) |
| **ریئل ٹائم سپورٹ** | محدود تھی | بلٹ ان DDS بشمول ریئل ٹائم صلاحیتیں |
| **ملٹی روبوٹ** | مشکل تھا | DDS کے ذریعے مقامی (Native) سپورٹ |
| **سیکیورٹی** | کوئی نہیں تھی | DDS سیکیورٹی (SROS2) |
| **پلیٹ فارم سپورٹ** | زیادہ تر لینکس | لینکس، ونڈوز، میک، RTOS |
| **مواصلات** | کسٹم TCPROS/UDPROS | انڈسٹری کا معیاری DDS |

**بنیادی بصیرت**: ROS 2 کو شروع ہی سے **پروڈکشن روبوٹکس** کے لیے ڈیزائن کیا گیا تھا، نہ کہ صرف تحقیق کے لیے۔

---

## ROS 2 آرکیٹیکچر کا جائزہ

### ROS 2 گراف (The ROS 2 Graph)

بنیادی طور پر، ROS 2 **نوڈس کا ایک گراف** ہے جو **ٹاپکس (Topics)**، **سروسز (Services)** اور **ایکشنز (Actions)** کے ذریعے ایک دوسرے سے بات چیت کرتے ہیں۔

**اجزاء (Components)**:
- **نوڈس (Nodes)**: آزاد پراسیسز جو کمپیوٹیشن کرتے ہیں
- **ٹاپکس (Topics)**: غیر ہم آہنگ (Asynchronous)، بہت سے بہت (Many-to-many) ڈیٹا اسٹریمز
- **سروسز (Services)**: ہم آہنگ (Synchronous)، درخواست-جواب والے تعاملات
- **ایکشنز (Actions)**: فیڈ بیک اور کینسلشن کے ساتھ طویل عرصے تک چلنے والے کام

---

## DDS: مڈل ویئر لیئر

### DDS کیا ہے؟

**DDS (Data Distribution Service)** ریئل ٹائم اور تقسیم شدہ (Distributed) سسٹمز کے لیے ایک صنعتی معیاری مڈل ویئر ہے۔ ROS 2 اسے اپنی مواصلاتی تہہ (Communication Layer) کے طور پر استعمال کرتا ہے۔

**DDS کیوں؟**
- **آزمودہ ٹیکنالوجی**: ایرواسپیس، دفاع اور آٹوموٹو صنعتوں میں مستعمل
- **ریئل ٹائم**: QoS کی ضمانتوں کے ساتھ حتمی مواصلات
- **وسیع پیمانے پر (Scalable)**: نیٹ ورکس پر ہزاروں نوڈس کی سپورٹ

---

## Quality of Service (QoS)

QoS پالیسیز اس بات کی وضاحت کرتی ہیں کہ ڈیٹا **کیسے** منتقل کیا جاتا ہے، جس سے مواصلات کے بھروسے، تاخیر (Latency) اور وسائل کے استعمال پر کنٹرول ملتا ہے۔

### کلیدی QoS پالیسیز

#### **Reliability (بھروسہ مندی)**
- **Reliable**: پیغام کی ترسیل کی ضمانت دیتا ہے (جیسے TCP)
- **Best Effort**: ترسیل کی کوئی ضمانت نہیں (جیسے UDP) — سینسر اسٹریمز کے لیے بہترین ہے

#### **Durability**
- **Transient Local**: بعد میں آنے والے سبسکرائبرز کو پچھلا پیغام ملتا ہے
- **Volatile**: صرف لائیو ڈیٹا ملتا ہے (ڈیفالٹ)

---

## ROS 2 کے ورژن (Distributions)

ROS 2 ٹائم بیسڈ ریلیز شیڈول کی پیروی کرتا ہے:

| ورژن (Distribution) | ریلیز کی تاریخ | سپورٹ کب تک |
|--------------|--------------|---------------|
| **Humble Hawksbill** | مئی 2022 | مئی 2027 |
| Jazzy Jalisco | مئی 2024 | مئی 2026 |

**اس کورس کے لیے**: ہم **ROS 2 Humble** استعمال کرتے ہیں۔

---

## کلیدی نکات (Key Takeaways)

✅ **ROS 2** روبوٹ سافٹ ویئر بنانے کے لیے ایک مڈل ویئر فریم ورک ہے، نہ کہ OS

✅ **DDS** انڈسٹری کا معیاری، ریئل ٹائم مواصلاتی نظام فراہم کرتا ہے

✅ **کوئی ماسٹر نہیں**: تقسیم شدہ ڈسکوری سنگل پوائنٹ آف فیلیئر کو ختم کرتی ہے

✅ **Humble Hawksbill**: 2027 تک سپورٹ والا LTS ورژن ہے

---

**گزشتہ باب**: [← باب 1: سینسر سسٹمز کا جائزہ](../../part1/chapter4/index.md)  
**اگلا سیکشن**: [2.2 نوڈس اور کمیونیکیشن →](../chapter9/index.md)

</TabItem>
<TabItem value="personalize" label="Personalize">

Personalization features coming soon...

</TabItem>
</Tabs>
