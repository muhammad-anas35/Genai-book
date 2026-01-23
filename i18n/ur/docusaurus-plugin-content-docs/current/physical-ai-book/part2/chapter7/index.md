---
title: "Chapter 7: لانچ فائلز اور پیرامیٹرز (Launch Files and Parameters)"
sidebar_label: "Chapter 7: لانچ فائلز اور پیرامیٹرز (Launch Files and Parameters)"
---

# Chapter 7: لانچ فائلز اور پیرامیٹرز (Launch Files and Parameters)

## سیکھنے کے مقاصد (Learning Objectives)

اس سیکشن کے اختتام تک، آپ اس قابل ہو جائیں گے کہ:
- بیک وقت متعدد نوڈس شروع کرنے کے لیے لانچ فائلز بنا سکیں
- YAML فائلز کا استعمال کرتے ہوئے نوڈ پیرامیٹرز کو کنفیگر کر سکیں
- لچکدار کنفیگریشن کے لیے لانچ فائلز میں آرگیومنٹس (Arguments) پاس کر سکیں
- پیچیدہ روبوٹ سسٹمز کو لانچ فائل کمپوزیشن کے ساتھ منظم کر سکیں

---

## تعارف (Introduction)

ایک ہیومنائیڈ روبوٹ شروع کرنے کا تصور کریں: آپ کو کیمرہ ڈرائیور، IMU نوڈ، موٹر کنٹرولرز، لوکلائزیشن، نیویگیشن، اور AI ماڈیولز — ممکنہ طور پر درجنوں نوڈس لانچ کرنے کی ضرورت ہے۔ ہر نوڈ کے لیے دستی طور پر `ros2 run` استعمال کرنا تھکا دینے والا اور غلطیوں کا باعث ہو سکتا ہے۔

**لانچ فائلز (Launch Files)** اس مسئلے کو حل کرتی ہیں، جس سے آپ صرف ایک کمانڈ کے ساتھ متعدد نوڈس شروع کر سکتے ہیں، پیرامیٹرز سیٹ کر سکتے ہیں، اور اپنے پورے روبوٹ سسٹم کو کنفیگر کر سکتے ہے۔

---

## لانچ فائلز کیوں؟

### مسئلہ (The Problem)

دستی طور پر شروع کرنا (Manual startup):
```bash
ros2 run camera_driver camera_node &
ros2 run imu_driver imu_node &
ros2 run motor_controller left_leg &
# Chapter 7: ... اور مزید 20 نوڈس
```

### حل (The Solution)

صرف ایک کمانڈ:
```bash
ros2 launch my_robot robot.launch.py
```

---

## اپنی پہلی لانچ فائل بنانا

ایک بنیادی لانچ فائل `simple_launch.py` کی ساخت:

```python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='turtlesim',
            executable='turtlesim_node',
            name='sim'
        ),
        Node(
            package='turtlesim',
            executable='turtle_teleop_key',
            name='teleop',
            output='screen'
        )
    ])
```

---

## پیرامیٹرز اور YAML فائلز

نوڈس کو کنفیگر کرنے کے لیے پیرامیٹرز کا استعمال کیا جاتا ہے۔ انہیں براہ راست لانچ فائل میں یا علیحدہ YAML فائل سے لوڈ کیا جا سکتا ہے۔

**YAML فائل کی مثال (config/params.yaml)**:
```yaml
controller:
  ros__parameters:
    max_velocity: 1.0
    control_frequency: 50.0
```

---

## لانچ آرگیومنٹس (Launch Arguments)

آرگیومنٹس لانچ فائل کو لچکدار بناتے ہیں۔ مثلاً آپ یہ طے کر سکتے ہیں کہ روبوٹ سیمولیشن میں چل رہا ہے یا حقیقی ہارڈ ویئر پر۔

```bash
# Chapter 7: آرگیومنٹس کے ساتھ لانچ کرنا
ros2 launch my_robot robot.launch.py use_sim:=true
```

---

## بہترین روایات (Best Practices)

✅ **کیا کریں**:
- کاموں کو تقسیم کریں (مثلاً `sensors.launch.py`, `control.launch.py`)۔
- پیرامیٹرز کے لیے ہمیشہ YAML فائلز کا استعمال کریں۔
- آرگیومنٹس کے ساتھ وضاحت (Description) شامل کریں تاکہ دوسرے اسے سمجھ سکیں۔

❌ **کیا نہ کریں**:
- تمام نوڈس ایک ہی بڑی لانچ فائل میں نہ ڈالیں۔
- ہارڈ کوڈڈ پاتھس (Hardcoded paths) کے استعمال سے بچیں۔

---

## کلیدی نکات (Key Takeaways)

✅ **لانچ فائلز** ایک ہی کمانڈ سے پورے سسٹم کو شروع کرتی ہیں

✅ **پیرامیٹرز** نوڈس کی سیٹنگز (جیسے رفتار کی حد) کو کنٹرول کرتے ہیں

✅ **آرگیومنٹس** لانچ فائلز کو دوبارہ استعمال کے قابل بناتے ہیں

✅ **کمپوزیشن** ایک لانچ فائل کو دوسری میں شامل کرنے کی اجازت دیتی ہے

---

**گزشتہ سیکشن**: [← 2.3 ROS 2 پیکجز بنانا](../chapter5/index.md)  
**اگلا باب**: [باب 3: Gazebo کے ساتھ روبوٹ سیمولیشن →](../../part3/index.md)