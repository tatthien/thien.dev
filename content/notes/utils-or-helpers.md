---
title: Utils or Helpers
date: 2024-03-19T22:25:00.698Z
tags: programming
draft: false
---

When to use `helpers` and `utils`? Here is my rule of thumb.

`helpers` are specific to a project and are not usually reused across different projects.
`utils`, on the other hand, are used for general purposes and can be reused across multiple projects.

Consider the following example:

- The`validatePassword` function can be a helper. This is because `formatDate` function can be a util function. This is because the criteria for password validation can vary significantly across different projects, often depending on specific business requirements.
- A function like `formatDate` can be a utility. Because it offers functionality to format dates in various ways, making it suitable for different projects.
