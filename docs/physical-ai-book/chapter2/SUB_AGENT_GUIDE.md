# Sub-Agent Coordination Guide - Chapter 2 Creation

**Project**: Physical AI & Humanoid Robotics Interactive Textbook  
**Chapter**: 2 - ROS 2 Fundamentals  
**Status**: Ready for Sub-Agent Assignment  
**Date**: December 3, 2025  

---

## Quick Start: How to Use Sub-Agents

### For Robotics Researcher (Research Phase)

Use this prompt to begin research tasks:

```
@sub_agents/robotics_researcher/prompt.md
@sub_agents/robotics_researcher/context.md

TASK: [Choose one below]

1. RESEARCH: ROS 2 Humble Architecture and DDS Middleware
   Focus: ROS 2 architecture layers, DDS fundamentals, QoS policies
   Output: Summary + Key Findings + Technical Details + Code Examples + Sources
   Context: Will inform section 2.1 (Architecture and Core Concepts)
   Deadline: Dec 5, 2025

2. RESEARCH: ROS 2 Communication Patterns
   Focus: Topics (pub/sub), Services, Actions, when to use each
   Output: Summary + Key Findings + Technical Details + Code Examples + Sources
   Context: Will inform section 2.2 (Nodes and Communication)
   Deadline: Dec 6, 2025

3. RESEARCH: ROS 2 Packages and Ament Build System
   Focus: Package structure, package.xml, setup.py, colcon/ament
   Output: Summary + Key Findings + Technical Details + Code Examples + Sources
   Context: Will inform section 2.3 (Building Packages)
   Deadline: Dec 7, 2025

4. RESEARCH: ROS 2 Launch Files and Parameters
   Focus: Python Launch API, parameter servers, node composition
   Output: Summary + Key Findings + Technical Details + Code Examples + Sources
   Context: Will inform section 2.4 (Launch Files and Parameters)
   Deadline: Dec 8, 2025
```

---

### For Technical Writer (Writing Phase)

Use this prompt after research is complete:

```
@sub_agents/technical_writer/prompt.md
@sub_agents/technical_writer/context.md

TASK: Write Section [2.1 | 2.2 | 2.3 | 2.4]

SECTION: [Choose one]

1. WRITE: 2.1 - ROS 2 Architecture and Core Concepts
   Length: 3,000-4,000 words
   Input: See research output from robotics_researcher (ROS 2 Architecture and DDS)
   Requirements:
   - Explain DDS middleware for student learners
   - Create computational graph diagram (ASCII or reference format)
   - Include ROS 1 vs ROS 2 comparison table
   - Explain QoS with practical examples
   - Include hands-on reflection questions
   - Learning objectives: [See CHAPTER2_WORKFLOW.md]
   Deadline: Dec 7, 2025

2. WRITE: 2.2 - Nodes and Communication Patterns
   Length: 3,500-4,000 words
   Input: See research output from robotics_researcher (Communication Patterns)
   Requirements:
   - Create decision matrix for when to use each pattern
   - Include explanations of pub/sub, services, actions
   - Reference code examples (from robotics_code_gen)
   - Real-world humanoid robot examples
   - Build on concepts from section 2.1
   - Learning objectives: [See CHAPTER2_WORKFLOW.md]
   Deadline: Dec 9, 2025

3. WRITE: 2.3 - Building ROS 2 Packages
   Length: 2,500-3,000 words
   Input: See research output from robotics_researcher (Packages and Ament)
   Requirements:
   - Step-by-step package creation guide
   - Explain package.xml and setup.py
   - Best practices for organization
   - Reference code examples (from robotics_code_gen)
   - Include hands-on exercises
   - Learning objectives: [See CHAPTER2_WORKFLOW.md]
   Deadline: Dec 12, 2025

4. WRITE: 2.4 - Launch Files and Parameters
   Length: 2,500-3,000 words
   Input: See research output from robotics_researcher (Launch Files)
   Requirements:
   - Explain Python Launch API
   - Show real-world launch file patterns
   - Parameter management and configuration
   - Node composition examples
   - Reference code examples (from robotics_code_gen)
   - Learning objectives: [See CHAPTER2_WORKFLOW.md]
   Deadline: Dec 14, 2025

CONTEXT FROM CHAPTER 1:
- Use consistent terminology and style
- Reference Chapter 1 concepts where appropriate
- Maintain focus on Physical AI and humanoid robotics applications
```

---

### For Robotics Code Generator (Code Phase)

Use this prompt to generate code examples:

```
@sub_agents/robotics_code_gen/prompt.md
@sub_agents/robotics_code_gen/context.md

TASK: Create [Code Example 1-5]

CODE EXAMPLE: [Choose one or more]

1. CREATE: ROS 2 Publisher/Subscriber Example
   Framework: ROS 2 Humble, Python 3.10+
   Use Case: Sensor data publishing and consumption
   Files Needed:
   - publisher_node.py
   - subscriber_node.py
   - package.xml and setup.py
   - README with setup and execution
   Requirements:
   - Detailed inline comments
   - Error handling
   - Both nodes runnable independently
   Deadline: Dec 6, 2025

2. CREATE: ROS 2 Service Server/Client Example
   Framework: ROS 2 Humble, Python 3.10+
   Use Case: Robot motion command execution
   Files Needed:
   - motion_service.py (server)
   - motion_client.py (client)
   - Custom .srv definition
   - package.xml and setup.py
   - README with examples
   Requirements:
   - Handle requests and responses
   - Error handling for edge cases
   - Status feedback
   Deadline: Dec 7, 2025

3. CREATE: ROS 2 Action Server/Client Example
   Framework: ROS 2 Humble, Python 3.10+
   Use Case: Robot movement to goal with feedback
   Files Needed:
   - movement_action_server.py
   - movement_action_client.py
   - Custom .action definition
   - package.xml and setup.py
   - README with examples
   Requirements:
   - Demonstrate feedback handling
   - Show preemption handling
   - Return results after goal
   Deadline: Dec 8, 2025

4. CREATE: ROS 2 Package Template
   Framework: ROS 2 Humble, Python
   Use Case: Humanoid robot control package template
   Files Needed:
   - Complete package directory structure
   - package.xml (proper metadata)
   - setup.py with entry points
   - Example nodes
   - Test suite
   - README with setup instructions
   Requirements:
   - Follow Python best practices
   - Include docstrings and type hints
   - Show professional structure
   Deadline: Dec 10, 2025

5. CREATE: Launch File Examples
   Framework: ROS 2 Humble, Python Launch API
   Use Case: Multi-node humanoid robot system
   Files Needed:
   - simple_launch.py (basic pattern)
   - complex_launch.py (advanced patterns)
   - Example configuration files (YAML)
   - README with pattern explanations
   Requirements:
   - Demonstrate key patterns
   - Include comments explaining each pattern
   - Show debugging approaches
   Deadline: Dec 11, 2025

CONTEXT:
- All code must be tested and verified
- ROS 2 Humble on Ubuntu 22.04
- Reference Unitree G1 specifications where applicable
- Production-quality comments and documentation
```

---

### For Reviewer (Review Phase)

Use this prompt for quality assurance:

```
@sub_agents/reviewer/prompt.md
@sub_agents/reviewer/context.md

REVIEW TASK: [Review Batch 1 or 2]

BATCH 1: Sections 2.1-2.2 (Due: Dec 10)
Content to Review:
- Written sections 2.1 and 2.2
- Code examples 1-3 (Pub/Sub, Service, Action)
- Learning objective alignment
- Chapter 1 consistency

Verification Checklist:
- [ ] Technical accuracy (verify against ROS 2 Humble docs)
- [ ] Code examples execute without errors
- [ ] Learning objectives met
- [ ] Terminology consistent with Chapter 1
- [ ] Code has proper error handling
- [ ] All references are valid
- [ ] Reflection questions are meaningful

BATCH 2: Sections 2.3-2.4 (Due: Dec 15)
Content to Review:
- Written sections 2.3 and 2.4
- Code examples 4-5 (Package template, Launch files)
- Integration with previous sections
- Cross-references

Verification Checklist:
- [ ] Technical accuracy
- [ ] Best practices reflected
- [ ] Code is production-ready
- [ ] Hands-on exercises are clear
- [ ] Forward references to Chapter 3 are valid
- [ ] Overall flow and coherence
- [ ] Final quality assessment

OUTPUT FORMAT:
- Summary of review findings
- List of issues found (critical vs. minor)
- Suggestions for improvement
- Recommendation: Approve / Revise / Reject
```

---

## Document References

All framework and pattern details can be found here:

**Workflow Planning**:
- [Chapter 2 Workflow Document](./CHAPTER2_WORKFLOW.md) - Complete task breakdown, timeline, dependencies
- [Chapter 1: Foundations](/docs/physical-ai-book/intro/foundations) - For consistency reference

**Code Example Locations** (after generation):
- All code will be placed in chapter2/code_examples/ directory
- Each example will have its own subdirectory with README

**Quality Standards**:
- Learning objectives at top of each section
- ~3,000-3,500 words per major section
- Code examples with complete packages (package.xml, setup.py)
- All code tested on ROS 2 Humble / Ubuntu 22.04
- Professional documentation and comments

---

## Timeline Summary

**Week 1 (Dec 3-9)**
- Research: All 4 topics researched by Dec 8
- Writing: Sections 2.1-2.2 written by Dec 9
- Code: Examples 1-3 completed by Dec 8
- Review: Sections 2.1-2.2 reviewed by Dec 10

**Week 2 (Dec 10-17)**
- Research: Complete (Dec 3-8)
- Writing: Sections 2.3-2.4 written by Dec 14
- Code: Examples 4-5 completed by Dec 11
- Review: Sections 2.3-2.4 reviewed by Dec 15
- Integration: Final assembly Dec 16-17

---

## Success Criteria

✅ All sections written and integrated
✅ 5 production-quality code examples
✅ All learning objectives met
✅ Consistent terminology with Chapter 1
✅ Forward compatible with Chapter 3
✅ Ready for student use

---

## Getting Started

**Next Steps**:
1. Begin with robotics_researcher - Task 1.1 (Architecture Research)
2. Once research is available, begin technical_writer - Task 2.1 (Writing)
3. In parallel, robotics_code_gen can start code examples
4. Reviewer will verify quality as content becomes available

**Questions?**
Refer to CHAPTER2_WORKFLOW.md for detailed task specifications and dependencies.

---

**Project Status**: 
- Chapter 1: ✅ Complete (100%)
- Chapter 2: 🔄 In Progress - Ready for sub-agent assignment
- Overall: **25% → Target 50% by Dec 17**
