---
title: "Chapter 5: ROS 2 پیکجز بنانا (Building ROS 2 Packages)"
sidebar_label: "Chapter 5: ROS 2 پیکجز بنانا (Building ROS 2 Packages)"
---

# Chapter 5: ROS 2 پیکجز بنانا (Building ROS 2 Packages)

## سیکھنے کے مقاصد (Learning Objectives)

اس سیکشن کے اختتام تک، آپ اس قابل ہو جائیں گے کہ:
- ROS 2 پیکج کی ساخت اور تنظیم کو سمجھ سکیں
- Python اور C++ میں ROS 2 پیکجز بنا سکیں
- ورک اسپیس (Workspace) کے انتظام کے لیے `colcon` کا استعمال کر سکیں
- پیکج کی وابستگیوں (Dependencies) اور میٹا ڈیٹا کو کنفیگر کر سکیں
- بہترین روایات (Best Practices) کے مطابق کوڈ کو منظم کر سکیں

---

## تعارف (Introduction)

ROS 2 میں، ایک **پیکج (Package)** کوڈ کی تنظیم کی بنیادی اکائی ہے۔ یہ ایک ڈائریکٹری ہے جس میں نوڈس، لائبریریز، کنفیگریشن فائلز اور میٹا ڈیٹا شامل ہوتا ہے جو مل کر مخصوص فعالیت (Functionality) فراہم کرتے ہیں۔ پیکجز کو ماڈیولر بلڈنگ بلاکس کے طور پر سمجھیں — ہر روبوٹ سسٹم مل کر کام کرنے والے متعدد پیکجز پر مشتمل ہوتا ہے۔

---

## ROS 2 پیکج کی ساخت (Package Structure)

### ایک پیکج کے اجزاء

ایک عام ROS 2 Python پیکج کی ساخت درج ذیل ہوتی ہے:

```
my_robot_package/
├── package.xml           # پیکج کا میٹا ڈیٹا اور ڈیپینڈنسیز
├── setup.py              # پائتھن پیکج کنفیگریشن
├── my_robot_package/     # پائتھن سورس کوڈ
│   ├── __init__.py
│   └── my_node.py
└── test/                 # یونٹ ٹیسٹ
```

---

## ROS 2 ورک اسپیس بنانا

### ورک اسپیس کی ساخت

ایک ورک اسپیس متعدد پیکجز کو منظم کرتا ہے:

```
ros2_ws/
├── src/                  # سورس اسپیس (آپ کے پیکجز)
├── build/                # آٹو جنریٹڈ فائلز
├── install/              # انسٹال شدہ فائلز
└── log/                  # بلڈ لاگز
```

### ورک اسپیس بنانے کا طریقہ

```bash
# Chapter 5: ورک اسپیس ڈائریکٹری بنائیں
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws

# Chapter 5: ورک اسپیس کو بلڈ کریں
colcon build

# Chapter 5: ورک اسپیس کو سورس کریں (لازمی قدم)
source install/setup.bash
```

---

## پائتھن پیکج بنانا (Creating a Python Package)

### ros2 pkg create کا استعمال

```bash
cd ~/ros2_ws/src

# Chapter 5: پائتھن پیکج بنائیں
ros2 pkg create --build-type ament_python \
  --node-name my_first_node \
  my_robot_package \
  --dependencies rclpy geometry_msgs
```

---

## colcon کے ساتھ بلڈ کرنا

### بنیادی بلڈ کمانڈز

```bash
# Chapter 5: تمام پیکجز کو بلڈ کریں
colcon build

# Chapter 5: کسی مخصوص پیکج کو بلڈ کریں
colcon build --packages-select my_robot_package

# Chapter 5: سم لنک انسٹال (ڈیولپمنٹ کے لیے بہترین)
colcon build --symlink-install
```

**--symlink-install کا فائدہ**: پائتھن کوڈ میں تبدیلی کے بعد آپ کو دوبارہ بلڈ کرنے کی ضرورت نہیں پڑتی، صرف نوڈ دوبارہ چلانا کافی ہوتا ہے۔

---

## بہترین روایات (Best Practices)

✅ **کیا کریں**:
-ہر بڑی فنکشنلٹی کے لیے ایک الگ پیکج بنائیں (مثلاً `navigation`, `perception`)۔
- پیکج کے نام چھوٹے اور واضح رکھیں (جیسے `my_robot_control`)۔
-کوڈ کو منظم رکھنے کے لیے `snake_case` کا استعمال کریں۔

❌ **کیا نہ کریں**:
- تمام کوڈ ایک ہی بڑے پیکج میں نہ ڈالیں۔
- غیر متعلقہ فنکشنلٹی کو مکس نہ کریں۔

---

## کلیدی نکات (Key Takeaways)

✅ **پیکجز** ROS 2 میں کوڈ آرگنائزیشن کی بنیادی اکائی ہیں

✅ **colcon** بلڈ کرنے کا جدید ٹول ہے

✅ **package.xml** میں پیکج کی تمام ڈیپینڈنسیز لکھی جاتی ہیں

✅ **--symlink-install** پائتھن ڈیولپمنٹ کو تیز بناتا ہے

---

**گزشتہ سیکشن**: [← 2.2 نوڈس اور کمیونیکیشن](../chapter9/index.md)  
**اگلا سیکشن**: [2.4 لانچ فائلز اور پیرامیٹرز →](../chapter7/index.md)