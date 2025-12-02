# 2.3 Building ROS 2 Packages

## Learning Objectives

By the end of this section, you will be able to:
- Understand ROS 2 package structure and organization
- Create Python and C++ ROS 2 packages
- Use colcon to build and manage workspaces
- Configure package dependencies and metadata
- Organize code following ROS 2 best practices

---

## Introduction

In ROS 2, a **package** is the fundamental unit of code organization. It's a directory containing nodes, libraries, configuration files, and metadata that together provide specific functionality. Think of packages as modular building blocks—each robot system is composed of multiple packages working together.

This section teaches you how to create, build, and manage ROS 2 packages professionally.

---

## ROS 2 Package Structure

### Anatomy of a Package

A typical ROS 2 Python package looks like this:

```
my_robot_package/
├── package.xml           # Package metadata and dependencies
├── setup.py              # Python package configuration
├── setup.cfg             # Python package setup config
├── resource/             # Package marker files
│   └── my_robot_package
├── my_robot_package/     # Python source code
│   ├── __init__.py
│   ├── my_node.py
│   └── utils.py
└── test/                 # Unit tests
    ├── test_copyright.py
    └── test_flake8.py
```

A C++ package looks like this:

```
my_cpp_package/
├── package.xml           # Package metadata
├── CMakeLists.txt        # Build configuration
├── include/              # Header files
│   └── my_cpp_package/
│       └── my_class.hpp
├── src/                  # Source files
│   ├── my_node.cpp
│   └── my_class.cpp
└── launch/               # Launch files (optional)
    └── my_launch.py
```

---

## Creating a ROS 2 Workspace

### Workspace Structure

A ROS 2 workspace organizes multiple packages:

```
ros2_ws/
├── src/                  # Source space (your packages)
│   ├── package_1/
│   ├── package_2/
│   └── package_3/
├── build/                # Build artifacts (auto-generated)
├── install/              # Installed files (auto-generated)
└── log/                  # Build logs (auto-generated)
```

### Creating a Workspace

```bash
# Create workspace directory
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws

# Build the workspace (even if empty)
colcon build

# Source the workspace
source install/setup.bash
```

**Important**: Always source your workspace before using packages in it!

---

## Creating a Python Package

### Using ros2 pkg create

```bash
cd ~/ros2_ws/src

# Create a Python package
ros2 pkg create --build-type ament_python \
  --node-name my_first_node \
  my_robot_package \
  --dependencies rclpy geometry_msgs sensor_msgs

# This creates:
# - Package structure
# - A sample node (my_first_node.py)
# - package.xml with dependencies
# - setup.py configured
```

### Understanding package.xml

```xml
<?xml version="1.0"?>
<?xml-model href="http://download.ros.org/schema/package_format3.xsd" schematypens="http://www.w3.org/2001/XMLSchema"?>
<package format="3">
  <name>my_robot_package</name>
  <version>0.0.1</version>
  <description>My robot control package</description>
  <maintainer email="you@example.com">Your Name</maintainer>
  <license>Apache-2.0</license>

  <!-- Build tool dependency -->
  <buildtool_depend>ament_python</buildtool_depend>

  <!-- Runtime dependencies -->
  <exec_depend>rclpy</exec_depend>
  <exec_depend>geometry_msgs</exec_depend>
  <exec_depend>sensor_msgs</exec_depend>

  <!-- Test dependencies -->
  <test_depend>ament_copyright</test_depend>
  <test_depend>ament_flake8</test_depend>
  <test_depend>ament_pep257</test_depend>
  <test_depend>python3-pytest</test_depend>

  <export>
    <build_type>ament_python</build_type>
  </export>
</package>
```

### Understanding setup.py

```python
from setuptools import setup

package_name = 'my_robot_package'

setup(
    name=package_name,
    version='0.0.1',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='Your Name',
    maintainer_email='you@example.com',
    description='My robot control package',
    license='Apache-2.0',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            'my_first_node = my_robot_package.my_first_node:main',
            'velocity_controller = my_robot_package.velocity_controller:main',
        ],
    },
)
```

**Key Point**: The `entry_points` section defines executable nodes!

---

## Creating a C++ Package

### Using ros2 pkg create

```bash
cd ~/ros2_ws/src

# Create a C++ package
ros2 pkg create --build-type ament_cmake \
  --node-name my_cpp_node \
  my_cpp_package \
  --dependencies rclcpp geometry_msgs sensor_msgs
```

### Understanding CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.8)
project(my_cpp_package)

# Compiler settings
if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
  add_compile_options(-Wall -Wextra -Wpedantic)
endif()

# Find dependencies
find_package(ament_cmake REQUIRED)
find_package(rclcpp REQUIRED)
find_package(geometry_msgs REQUIRED)
find_package(sensor_msgs REQUIRED)

# Add executable
add_executable(my_cpp_node src/my_cpp_node.cpp)
ament_target_dependencies(my_cpp_node
  rclcpp
  geometry_msgs
  sensor_msgs
)

# Install targets
install(TARGETS
  my_cpp_node
  DESTINATION lib/${PROJECT_NAME}
)

# Install launch files (if any)
install(DIRECTORY
  launch
  DESTINATION share/${PROJECT_NAME}/
)

ament_package()
```

---

## Building with colcon

### Basic Build Commands

```bash
# Build all packages in workspace
cd ~/ros2_ws
colcon build

# Build specific package
colcon build --packages-select my_robot_package

# Build with symbolic links (Python only, for development)
colcon build --symlink-install

# Build with verbose output
colcon build --event-handlers console_direct+

# Clean build
rm -rf build install log
colcon build
```

### Build Options

| Option | Description |
|--------|-------------|
| `--packages-select PKG` | Build only specified package |
| `--packages-up-to PKG` | Build package and its dependencies |
| `--symlink-install` | Use symlinks (no rebuild for Python changes) |
| `--cmake-args` | Pass arguments to CMake |
| `--parallel-workers N` | Use N parallel jobs |

### Example: Development Workflow

```bash
# 1. Create package
cd ~/ros2_ws/src
ros2 pkg create --build-type ament_python my_pkg --dependencies rclpy

# 2. Write code
cd my_pkg/my_pkg
# Edit your_node.py

# 3. Add entry point in setup.py
# 'your_node = my_pkg.your_node:main'

# 4. Build with symlinks (for development)
cd ~/ros2_ws
colcon build --packages-select my_pkg --symlink-install

# 5. Source workspace
source install/setup.bash

# 6. Run node
ros2 run my_pkg your_node

# 7. Make changes to Python code
# No rebuild needed with --symlink-install!
# Just re-run: ros2 run my_pkg your_node
```

---

## Package Dependencies

### Types of Dependencies

1. **buildtool_depend**: Tools needed to build (e.g., `ament_python`, `ament_cmake`)
2. **build_depend**: Packages needed at build time (C++ headers)
3. **exec_depend**: Packages needed at runtime
4. **depend**: Both build and exec dependency (shorthand)
5. **test_depend**: Packages needed for testing

### Example: Complete Dependencies

```xml
<package format="3">
  <name>humanoid_controller</name>
  
  <!-- Build tool -->
  <buildtool_depend>ament_cmake</buildtool_depend>
  
  <!-- Core ROS 2 -->
  <depend>rclcpp</depend>
  
  <!-- Messages -->
  <depend>geometry_msgs</depend>
  <depend>sensor_msgs</depend>
  <depend>std_msgs</depend>
  
  <!-- Custom messages (if you have them) -->
  <build_depend>rosidl_default_generators</build_depend>
  <exec_depend>rosidl_default_runtime</exec_depend>
  
  <!-- Testing -->
  <test_depend>ament_lint_auto</test_depend>
  <test_depend>ament_lint_common</test_depend>
</package>
```

---

## Best Practices

### Package Organization

✅ **Do**:
- One package per major functionality (e.g., `navigation`, `perception`, `control`)
- Keep packages focused and modular
- Use meaningful package names (`my_robot_navigation`, not `pkg1`)
- Include README.md in each package

❌ **Don't**:
- Put everything in one giant package
- Mix unrelated functionality
- Use generic names like `utils` or `common`

### Code Organization

```
my_robot_package/
├── my_robot_package/
│   ├── __init__.py
│   ├── nodes/              # Executable nodes
│   │   ├── __init__.py
│   │   ├── controller.py
│   │   └── planner.py
│   ├── utils/              # Utility functions
│   │   ├── __init__.py
│   │   ├── math_utils.py
│   │   └── transforms.py
│   └── config/             # Configuration classes
│       ├── __init__.py
│       └── robot_config.py
├── launch/                 # Launch files
│   └── robot.launch.py
├── config/                 # YAML config files
│   └── params.yaml
└── test/                   # Tests
    └── test_controller.py
```

### Naming Conventions

- **Packages**: `snake_case` (e.g., `my_robot_navigation`)
- **Nodes**: `snake_case` (e.g., `velocity_controller`)
- **Topics**: `/snake_case` (e.g., `/cmd_vel`, `/robot/odom`)
- **Services**: `/snake_case` (e.g., `/get_plan`, `/reset_odom`)
- **Python files**: `snake_case.py`
- **C++ files**: `snake_case.cpp` / `.hpp`

---

## Example: Complete Package Creation

Let's create a complete package for a simple robot controller:

```bash
# 1. Create workspace
mkdir -p ~/humanoid_ws/src
cd ~/humanoid_ws/src

# 2. Create package
ros2 pkg create --build-type ament_python \
  humanoid_controller \
  --dependencies rclpy geometry_msgs sensor_msgs

# 3. Create node file
cd humanoid_controller/humanoid_controller
cat > balance_controller.py << 'EOF'
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Imu
from geometry_msgs.msg import Twist

class BalanceController(Node):
    def __init__(self):
        super().__init__('balance_controller')
        
        # Subscribe to IMU
        self.imu_sub = self.create_subscription(
            Imu, '/imu/data', self.imu_callback, 10
        )
        
        # Publish velocity commands
        self.cmd_pub = self.create_publisher(Twist, '/cmd_vel', 10)
        
        self.get_logger().info('Balance Controller started')
    
    def imu_callback(self, msg):
        # Simple balance control (placeholder)
        cmd = Twist()
        
        # If tilting forward, move backward
        if msg.linear_acceleration.x > 1.0:
            cmd.linear.x = -0.1
        
        self.cmd_pub.publish(cmd)

def main(args=None):
    rclpy.init(args=args)
    node = BalanceController()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
EOF

# 4. Update setup.py entry points
# Add: 'balance_controller = humanoid_controller.balance_controller:main'

# 5. Build
cd ~/humanoid_ws
colcon build --packages-select humanoid_controller --symlink-install

# 6. Source and run
source install/setup.bash
ros2 run humanoid_controller balance_controller
```

---

## Key Takeaways

✅ **Packages** are the fundamental unit of code organization in ROS 2

✅ **colcon** is the build tool (replaces catkin from ROS 1)

✅ **Workspaces** contain multiple packages in the `src/` directory

✅ **package.xml** defines metadata and dependencies

✅ **setup.py** (Python) or **CMakeLists.txt** (C++) configures the build

✅ **--symlink-install** enables rapid Python development (no rebuild needed)

---

## Reflection Questions

1. Why is it better to have multiple small packages instead of one large package?
2. What's the difference between `build_depend` and `exec_depend`?
3. When should you use `--symlink-install` and when should you avoid it?
4. How would you organize a package that includes both perception and control nodes?

---

## Further Reading

- **ROS 2 Packages**: [docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Creating-Your-First-ROS2-Package.html](https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Creating-Your-First-ROS2-Package.html)
- **colcon Documentation**: [colcon.readthedocs.io](https://colcon.readthedocs.io)
- **ament_cmake**: [docs.ros.org/en/humble/How-To-Guides/Ament-CMake-Documentation.html](https://docs.ros.org/en/humble/How-To-Guides/Ament-CMake-Documentation.html)

---

**Previous Section**: [← 2.2 Nodes and Communication](./nodes-communication.md)  
**Next Section**: [2.4 Launch Files and Parameters →](./launch-parameters.md)
