# 🚀 How to Use Sub-Agents - Chapter 2 Execution

**Status**: Ready to Begin  
**Date**: December 3, 2025  
**Chapter**: 2 - ROS 2 Fundamentals  

---

## The Big Picture

You now have **two choices**:

### Option A: Quick Summary
- Read this document for copy-paste ready prompts
- Assign tasks directly to sub-agents
- Start immediately

### Option B: Deep Dive
- Read `CHAPTER2_WORKFLOW.md` for comprehensive details
- Review `SUB_AGENT_GUIDE.md` for task specifications
- Plan multi-week execution

Both options lead to the same goal: **Chapter 2 complete by December 17**.

---

## Getting Started: First Task Assignment

### ✅ STEP 1: Start with Research (Right Now)

Copy and paste this EXACTLY to begin:

```
@sub_agents/robotics_researcher/prompt.md
@sub_agents/robotics_researcher/context.md

TASK: Research ROS 2 Architecture and DDS Middleware

Focus Areas:
- ROS 2 Humble architecture (layers and components)
- DDS (Data Distribution Service) middleware
- Quality of Service (QoS) policies in ROS 2
- Computational graph concepts
- How ROS 2 differs from ROS 1

Depth Required: Comprehensive, technical but accessible

Output Format:
1. Summary (2-3 paragraphs)
2. Key Findings (bullet points)
3. Technical Details (implementation guidance)
4. Code Examples (links to official examples)
5. Sources (numbered list with URLs)

Deadline: December 5, 2025
Purpose: Inform Chapter 2, Section 2.1 writing

Context: This is for an interactive textbook on Physical AI & Humanoid Robotics. 
The content will teach students how ROS 2 enables robot control and AI integration.
```

**⏱️ Expected Response Time**: 5-10 minutes

---

## Parallel Execution: Week 1

While research is being done, **ALSO** start code generation:

```
@sub_agents/robotics_code_gen/prompt.md
@sub_agents/robotics_code_gen/context.md

TASK: Create ROS 2 Publisher/Subscriber Example

Framework: ROS 2 Humble, Python 3.10+
Use Case: Sensor data publishing and consumption

Required Files:
1. publisher_node.py - Publishes simulated sensor data
2. subscriber_node.py - Receives and processes data
3. package.xml - Package metadata
4. setup.py - Python package setup
5. README.md - Setup and execution instructions

Code Quality:
- Detailed inline comments explaining every line
- Error handling for common issues
- Both nodes must be runnable independently
- Include docstrings and type hints

Expected Output:
- Complete, tested, working code
- Clear documentation
- Suggestions for extensions/variations

Deadline: December 6, 2025
Purpose: Provide working code examples for Section 2.2 writing
```

---

## Sequential Task Execution: Week 1-2

### Week 1 Priority Order

1. **Dec 5**: Research - ROS 2 Architecture
   ```
   @sub_agents/robotics_researcher/prompt.md
   [Use research prompt above]
   ```

2. **Dec 6**: Parallel - Research Communication + Code Pub/Sub
   ```
   @sub_agents/robotics_researcher/prompt.md
   [Modify above prompt to focus on: Topics, Services, Actions]
   
   ALSO:
   @sub_agents/robotics_code_gen/prompt.md
   [Use code prompt above]
   ```

3. **Dec 7**: Start Writing + More Code
   ```
   @sub_agents/technical_writer/prompt.md
   
   SECTION: 2.1 - ROS 2 Architecture and Core Concepts
   
   Input: Use research output from Dec 5 task
   
   Write Content (3,000-4,000 words):
   - Explain ROS 2 ecosystem and motivation
   - Deep dive into DDS middleware
   - Quality of Service policies with examples
   - Computational graph concepts
   - ROS 1 vs ROS 2 comparison
   - Real-world application to humanoid robotics
   
   Include:
   - Diagram/ASCII representation of computational graph
   - Comparison table
   - Key takeaways section
   - Reflection questions (3-4)
   - Links to further reading
   
   Deadline: December 7, 2025
   ```

4. **Dec 8-9**: Complete writing and reviews
   - Additional writing tasks
   - Code generation completion
   - Begin review phase

### Week 2 Priority Order

5. **Dec 10**: Begin Advanced Code
6. **Dec 12-14**: Complete all writing
7. **Dec 15**: Final reviews
8. **Dec 16-17**: Integration and quality assurance

---

## Task Assignment Template

Use this template for ANY sub-agent task:

```
@sub_agents/[AGENT_NAME]/prompt.md
@sub_agents/[AGENT_NAME]/context.md

TASK: [Brief description]

Focus: [What to focus on]
Depth: [Surface / Intermediate / Comprehensive]
Deadline: [Date]
Purpose: [Why this matters]

Requirements:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Output Format:
[What you want returned]

Context:
[Background information needed]
```

---

## The 5 Code Examples You'll Get

After assigning code generation tasks, you'll receive:

1. **Publisher/Subscriber** (Dec 6)
   - Sensor data streaming
   - Topic-based communication

2. **Service Server/Client** (Dec 7)
   - Request/response pattern
   - Robot command execution

3. **Action Server/Client** (Dec 8)
   - Long-running tasks
   - Feedback and preemption

4. **Package Template** (Dec 10)
   - Professional structure
   - Best practices

5. **Launch Files** (Dec 11)
   - Multi-node coordination
   - Parameter configuration

---

## Monitoring Progress

### Track Using This Document
- **`CHAPTER2_WORKFLOW.md`**: Master timeline and task tracking
- **`SUB_AGENT_GUIDE.md`**: Detailed specifications
- **`COMPLETION_REPORT.md`**: Overall project status

### Key Milestones

- **Dec 8**: All research complete → Writing can begin
- **Dec 10**: Sections 2.1-2.2 complete → First review cycle
- **Dec 14**: All writing complete → Final reviews
- **Dec 17**: Chapter 2 complete (100%) → Ready for Chapter 3

---

## Troubleshooting

### If Research Output is Missing Details
**Response**: Ask robotics_researcher for clarification
```
@sub_agents/robotics_researcher/prompt.md

Please expand on [topic] from your previous response.
Additional focus needed on: [specific areas]
```

### If Code Doesn't Work
**Response**: Have robotics_code_gen fix it
```
@sub_agents/robotics_code_gen/prompt.md

The [file] code from [date] has issues:
- [Problem 1]
- [Problem 2]

Please provide corrected version with fixes explained.
```

### If Writing Needs Revision
**Response**: Send revision request to technical_writer
```
@sub_agents/technical_writer/prompt.md

The section 2.1 you wrote needs revisions:
- [Issue 1]
- [Issue 2]

Please revise and resubmit by [date].
```

---

## Success Checklist

By December 17, Chapter 2 should have:

- [ ] All 4 sections written (2.1-2.4)
- [ ] 5+ production code examples
- [ ] All code tested and documented
- [ ] Cross-links and navigation working
- [ ] Learning objectives met
- [ ] Quality review completed
- [ ] Ready for student use

---

## Real-World Timeline Example

### Monday, Dec 3 (Today)
- ✅ Planning complete
- **Action**: Send Task 1.1 to robotics_researcher

### Tuesday, Dec 5
- Research output received
- **Action**: Send Task 1.2 research + Task 3.1 code generation

### Wednesday, Dec 6
- More research in + Code examples coming
- **Action**: Send Task 2.1 to technical_writer

### Thursday, Dec 7
- Section 2.1 written + More code examples
- **Action**: Begin Task 2.2 writing

### Friday, Dec 8
- Most writing underway + All code nearly complete
- **Action**: Begin reviewer tasks

### Monday, Dec 10 (Week 2)
- Sections 2.1-2.2 reviewed + More code complete
- **Action**: Final writing push for 2.3-2.4

### Friday, Dec 14
- All 4 sections written + Reviewer completing final checks
- **Action**: Integration and Docusaurus setup

### Monday, Dec 17
- ✅ Chapter 2 Complete (100%)
- **Action**: Begin Chapter 3 planning

---

## One More Thing: Quality Assurance

After each task is complete, verify:

**Code**: 
```
ros2 run [package] [node]  # Does it run?
```

**Writing**:
- Does it meet learning objectives? ✓
- Is it consistent with Chapter 1? ✓
- Are there reflection questions? ✓
- Are there code references? ✓

---

## You're Ready! 

Everything is set up. Now:

1. **Copy the first research prompt** (above)
2. **Paste it to robotics_researcher**
3. **Wait 5-10 minutes**
4. **Review output**
5. **Assign next task**

The system is designed for rapid, coordinated content creation. Each task builds on the previous one.

**Target**: Chapter 2 complete by December 17 ✅

---

## Questions? Reference These:
- **Detailed specs**: See `CHAPTER2_WORKFLOW.md`
- **Full sub-agent guide**: See `SUB_AGENT_GUIDE.md`  
- **Overall project status**: See `COMPLETION_REPORT.md`

**Ready to start? Use the prompts above!** 🚀
