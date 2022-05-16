---
title: Delete a folder recursively from a specified path
date: 2022-05-16T10:04:00Z
draft: false
---

I need to delete all node_modules (other) folder recursively from a specified path using the command line interface. Here's what I use.

```bash
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
```
