---
name: write-commits
description: Generates git commit messages following this repository's conventions. Analyzes staged changes and outputs properly formatted commit messages. Use when user asks to write, generate, or format a commit message.
compatibility: Requires git with staged changes.
allowed-tools: Bash(git:*) Read Grep
---

# Write Commits

Generate commit messages following repository conventions.

## Instructions

### Step 1: Analyze Staged Changes

```bash
git diff --cached --stat
git diff --cached
```

Identify:

- Files changed and their paths
- Nature of changes (new feature, bug fix, refactor, etc.)

### Step 2: Write Commit Message

**Format:**

```text
Subject in imperative mood

- Body bullet in past tense with period (only if subject isn't enough).
- Another change description.
```

**Rules:**

- Subject: imperative mood, capital start, no period, max 72 chars
- Body: only include when subject line alone doesn't adequately describe the changes
- Body bullets: past tense, capital start, period at end
- No attribution (no "Co-Authored-By" or "Generated with")

### Step 3: Output

Provide the commit message ready to use. Only include a body when the subject line alone isn't sufficient to describe the changes.

## Examples

**Simple change:**

```text
Add task details dialog
```

**Change with body (subject alone isn't enough):**

```text
Add task details dialog

- Added OrderDetailsDialog with map preview and navigation.
- Extracted filtering and pagination into reusable hooks.
```

**Bug fix:**

```text
Correct button disabled state styling
```

**Refactor with body (subject alone isn't enough):**

```text
Simplify locale resolution logic

- Replaced manual locale matching with Intl.LocaleMatcher.
- Removed fallback chain in favor of single default.
```

**Configuration update with body (multiple changes):**

```text
Update workspaces and dependencies

- Added shared/repositories/* to workspaces.
- Bumped @biomejs/biome to 2.3.8.
```
