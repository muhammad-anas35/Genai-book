---
---

# Part 2: "ROS 2 Fundamentals"

**Chapter Objective: "** *This chapter provides a comprehensive introduction to the Robot Operating System 2 (ROS 2), the middleware that forms the backbone of modern robotics. You will learn about the core concepts of ROS 2, including nodes, topics, services, and actions, and gain hands-on experience in building and managing ROS 2 packages.*"
---


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="language">
<TabItem value="en" label="English">

## Chapter 1: The Robotic Nervous System: An Introduction to ROS 2

This section introduces ROS 2 as the nervous system of a robot, enabling communication and coordination between different hardware and software components.

### Why ROS 2?

*   **Understanding the Need for a Middleware:** Explore the challenges of building complex robotic systems from scratch and the role of a middleware in simplifying development.
*   **The Evolution from ROS 1 to ROS 2:** Learn about the key improvements and architectural changes in ROS 2, including its enhanced security, real-time capabilities, and support for multi-robot systems.

### The ROS 2 Graph

*   **Nodes:** Understand how ROS 2 applications are composed of individual processes called nodes.
*   **Topics:** Learn how nodes communicate with each other by publishing and subscribing to messages on topics.
*   **Services:** Discover how to use services for request-response communication between nodes.
*   **Actions:** Explore the use of actions for long-running, feedback-driven tasks.

---

## Chapter 2: Building with ROS 2: Hands-On Development

This section provides practical, hands-on experience in building ROS 2 applications.

### Setting up Your ROS 2 Environment

*   **Installation and Configuration:** Step-by-step guide to installing ROS 2 on your system and configuring your workspace.
*   **Basic ROS 2 Commands:** Learn how to use essential command-line tools like `ros2 run`, `ros2 topic`, and `ros2 service`.

### Creating Your First ROS 2 Package

*   **Package Structure:** Understand the standard structure of a ROS 2 package.
*   **Building a Simple Publisher and Subscriber:** Write your first ROS 2 nodes in Python to publish and subscribe to a topic.

### Launching Your ROS 2 Application

*   **Launch Files:** Learn how to use launch files to start multiple nodes with a single command.
*   **Parameter Management:** Discover how to use parameters to configure your nodes at runtime.

---

## Chapter 3: Bridging the Gap: ROS 2 and Python Agents

This section explores how to integrate ROS 2 with Python-based AI agents, enabling intelligent decision-making in your robotic systems.

### Introduction to `rclpy`

*   **The ROS 2 Python Client Library:** Learn the fundamentals of `rclpy`, the official Python client library for ROS 2.
*   **Creating ROS 2 Nodes in Python:** Dive deeper into the `rclpy` API for creating nodes, publishers, subscribers, services, and actions.

### Integrating AI with ROS 2

*   **Connecting Your Agent to the ROS 2 Graph:** Learn how to create a ROS 2 node that wraps your AI agent, allowing it to subscribe to sensor data and publish commands.
*   **Example: A Simple Obstacle-Avoiding Agent:** Build a simple Python agent that uses simulated sensor data to navigate a robot around obstacles.

---

## Chapter 4: Describing Your Robot: The Unified Robot Description Format (URDF)

This section introduces URDF, the standard XML format for describing the physical properties of a robot.

### The Importance of a Robot Model

*   **Why We Need a Robot Description:** Understand the role of a robot model in simulation, visualization, and control.
*   **Introduction to URDF:** Learn the basic syntax and structure of a URDF file.

### Building Your First URDF

*   **Links and Joints:** Learn how to define the links (the rigid parts of the robot) and joints (the connections between links) of your robot.
*   **Visual and Collision Properties:** Discover how to specify the visual appearance and collision geometry of your robot.

### Visualizing Your Robot with RViz2

*   **Introduction to RViz2:** Learn how to use RViz2, the 3D visualization tool for ROS 2, to display your URDF model.
*   **Displaying Sensor Data:** Discover how to visualize sensor data, such as LiDAR scans and camera images, in RViz2.

</TabItem>
<TabItem value="ur" label="Urdu">

# Part 2: باب 2: ROS 2 کے بنیادی اصول (Fundamentals)

**باب کا مقصد:** *یہ باب Robot Operating System 2 (ROS 2) کا ایک جامع تعارف فراہم کرتا ہے، جو وہ مڈل ویئر (Middleware) ہے جو جدید روبوٹکس کی ریڑھ کی ہڈی کی حیثیت رکھتا ہے۔ آپ ROS 2 کے بنیادی تصورات بشمول نوڈز، ٹاپکس، سروسز اور ایکشنز کے بارے میں سیکھیں گے، اور ROS 2 پیکجز بنانے اور ان کے انتظام کا عملی تجربہ حاصل کریں گے۔*

---

## Chapter 1: روبوٹک اعصابی نظام: ROS 2 کا تعارف

یہ سیکشن ROS 2 کو روبوٹ کے اعصابی نظام کے طور پر متعارف کرواتا ہے، جو مختلف ہارڈ ویئر اور سافٹ ویئر اجزاء کے درمیان مواصلات (Communication) اور ہم آہنگی کو ممکن بناتا ہے۔

### ROS 2 کیوں؟

*   **مڈل ویئر کی ضرورت کو سمجھنا:** شروع سے پیچیدہ روبوٹک سسٹم بنانے کے چیلنجز اور ڈویلپمنٹ کو آسان بنانے میں مڈل ویئر کے کردار کا جائزہ لیں۔
*   **ROS 1 سے ROS 2 تک کا سفر:** ROS 2 میں ہونے والی اہم بہتریوں اور آرکیٹیکچر کی تبدیلیوں کے بارے میں سیکھیں، بشمول اس کی بہتر سیکیورٹی، ریئل ٹائم صلاحیتیں، اور ملٹی روبوٹ سسٹمز کے لیے سپورٹ۔

### ROS 2 گراف (The ROS 2 Graph)

*   **نوڈز (Nodes):** سمجھیں کہ کس طرح ROS 2 ایپلی کیشنز انفرادی پراسیسز پر مشتمل ہوتی ہیں جنہیں نوڈس کہا جاتا ہے۔
*   **ٹاپکس (Topics):** سیکھیں کہ کس طرح نوڈس ٹاپکس پر پیغامات (Messages) پبلش اور سبسکرائب کر کے ایک دوسرے کے ساتھ بات چیت کرتے ہیں۔
*   **سروسز (Services):** نوڈس کے درمیان درخواست-جواب (Request-Response) مواصلات کے لیے سروسز کا استعمال دریافت کریں۔
*   **ایکشنز (Actions):** طویل عرصے تک چلنے والے اور فیڈ بیک پر مبنی کاموں کے لیے ایکشنز کا استعمال دیکھیں۔

---

## Chapter 2: ROS 2 کے ساتھ بنانا: عملی ڈویلپمنٹ

یہ سیکشن ROS 2 ایپلی کیشنز بنانے کا عملی تجربہ فراہم کرتا ہے۔

### اپنا ROS 2 ماحول ترتیب دینا

*   **انسٹالیشن اور کنفیگریشن:** اپنے سسٹم پر ROS 2 انسٹال کرنے اور اپنے ورک اسپیس کو ترتیب دینے کے لیے مرحلہ وار گائیڈ۔
*   **بنیادی ROS 2 کمانڈز:** `ros2 run` ، `ros2 topic` اور `ros2 service` جیسے ضروری کمانڈ لائن ٹولز کا استعمال سیکھیں۔

### اپنا پہلا ROS 2 پیکج بنانا

*   **پیکج کی ساخت:** ROS 2 پیکج کی معیاری ساخت کو سمجھیں۔
*   **ایک سادہ پبلشر اور سبسکرائبر بنانا:** ٹاپک پر پبلش اور سبسکرائب کرنے کے لیے Python میں اپنے پہلے ROS 2 نوڈس لکھیں۔

### اپنی ROS 2 ایپلی کیشن کو چلانا (Launching)

*   **لانچ فائلز (Launch Files):** سیکھیں کہ ایک ہی کمانڈ کے ساتھ متعدد نوڈس شروع کرنے کے لیے لانچ فائلز کا استعمال کیسے کیا جاتا ہے۔
*   **پیرامیٹر مینجمنٹ:** رن ٹائم پر اپنے نوڈس کو کنفیگر کرنے کے لیے پیرامیٹرز کا استعمال دریافت کریں۔

---

## Chapter 3: خلیج کو ختم کرنا: ROS 2 اور Python ایجنٹس

یہ سیکشن دریافت کرتا ہے کہ ROS 2 کو Python پر مبنی AI ایجنٹس کے ساتھ کیسے جوڑا جائے، جس سے آپ کے روبوٹک سسٹم میں ذہین فیصلہ سازی ممکن ہوتی ہے۔

### rclpy کا تعارف

*   **ROS 2 Python کلائنٹ لائبریری:** `rclpy` کی بنیادی باتیں سیکھیں، جو ROS 2 کے لیے آفیشل Python کلائنٹ لائبریری ہے۔
*   **Python میں ROS 2 نوڈس بنانا:** نوڈس، پبلشرز، سبسکرائبرز، سروسز اور ایکشنز بنانے کے لیے `rclpy` API کی گہرائی میں جائیں۔

---

## Chapter 4: اپنے روبوٹ کی وضاحت: URDF

یہ سیکشن URDF (Unified Robot Description Format) کو متعارف کرواتا ہے، جو روبوٹ کی طبعی خصوصیات کو بیان کرنے کا معیاری XML فارمیٹ ہے۔

*   **روابط (Links) اور جوڑ (Joints):** سیکھیں کہ کس طرح اپنے روبوٹ کے لنکس (روبوٹ کے سخت حصے) اور جوائنٹس (لنکس کے درمیان کنکشن) کی وضاحت کی جاتی ہے۔
*   **RViz2 کے ساتھ اپنے روبوٹ کا مشاہدہ:** اپنے URDF ماڈل اور سینسر ڈیٹا کو دکھانے کے لیے 3D ویژولائزیشن ٹول RViz2 کا استعمال سیکھیں۔

</TabItem>
<TabItem value="personalize" label="Personalize">

Personalization features coming soon...

</TabItem>
</Tabs>
