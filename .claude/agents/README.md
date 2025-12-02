# Claude Agents - Quick Reference

This directory contains specialized Claude agents for the Physical AI & Humanoid Robotics textbook project.

## Available Agents

### 1. **technical_writer.md**
**Purpose**: Write clear, pedagogically sound educational content

**Use When**:
- Writing chapter sections
- Explaining complex concepts
- Creating tutorials and guides
- Writing summaries and takeaways

**Key Features**:
- Progressive complexity
- Learning objectives
- Hands-on exercises
- Reflection questions

---

### 2. **robotics_researcher.md**
**Purpose**: Find and synthesize latest robotics/AI information

**Use When**:
- Researching technologies
- Comparing approaches
- Finding best practices
- Locating documentation

**Key Features**:
- Authoritative sources
- 2023-2025 focus
- Technical comparisons
- Source citations

---

### 3. **robotics_code_gen.md**
**Purpose**: Create production-quality code examples

**Use When**:
- Creating ROS 2 examples
- Writing simulation files
- Generating AI integration code
- Developing test code

**Key Features**:
- PEP 8 / ROS 2 conventions
- Comprehensive comments
- Usage examples
- Error handling

---

### 4. **content_manager.md**
**Purpose**: Coordinate project and manage workflow

**Use When**:
- Planning chapters/sections
- Coordinating sub-agents
- Tracking progress
- Ensuring quality

**Key Features**:
- Task assignment
- Progress tracking
- Quality checklists
- Workflow coordination

---

### 5. **project_navigator.md**
**Purpose**: Navigate project structure and find resources

**Use When**:
- Finding specific files
- Understanding project structure
- Getting task context
- Locating documentation

**Key Features**:
- File path quick reference
- Navigation patterns
- Context provision
- Common Q&A

---

### 6. **domain_expert.md** ⭐ NEW
**Purpose**: Provide course curriculum and domain knowledge

**Use When**:
- Need course module details
- Hardware specifications
- Learning outcome alignment
- Assessment requirements
- Technical stack information

**Key Features**:
- Complete 4-module breakdown
- Hardware requirements
- Weekly curriculum
- Key technologies
- Assessment criteria

---

## Quick Start

### Creating New Content

```markdown
1. Plan: @content_manager
2. Research: @robotics_researcher  
3. Write: @technical_writer
4. Code: @robotics_code_gen
5. Navigate: @project_navigator (for finding files)
```

### Finding Information

```markdown
@project_navigator

Question: Where is [specific information]?
```

### Understanding Workflow

```markdown
@content_manager

Task: Plan creation of Chapter X, Section X.X
```

---

## Agent Comparison

| Need | Agent | File |
|------|-------|------|
| Write content | technical_writer | `technical_writer.md` |
| Research info | robotics_researcher | `robotics_researcher.md` |
| Generate code | robotics_code_gen | `robotics_code_gen.md` |
| Coordinate work | content_manager | `content_manager.md` |
| Find files | project_navigator | `project_navigator.md` |

---

## Integration with Sub-Agents

These Claude agents complement the sub-agent system in `../sub_agents/`:

- **Claude agents** (`.claude/agents/`): Claude-specific, detailed instructions
- **Sub-agents** (`sub_agents/`): Generic multi-agent system with prompt.md + context.md

Both systems work together for optimal content creation.

---

## Project Context

**Book**: Physical AI & Humanoid Robotics - A Comprehensive Guide  
**Progress**: 15% overall (Chapter 1 at 25%)  
**Technology**: Docusaurus, React, ROS 2, Gemini AI  
**Target**: Students, developers, robotics engineers  

---

## More Information

- **Sub-Agent Guide**: `../sub_agents/SKILLS.md`
- **Project Summary**: `../PROJECT_SUMMARY.md`
- **Implementation Plan**: `../brain/.../implementation_plan.md`
- **Task List**: `../brain/.../task.md`

---

**Last Updated**: 2025-12-02
