---
title: "4 concepts of functional programming"
date: 2023-03-18T16:23:23.239Z
description: A part of learning functional programming
tags: functional programming
---

<div class="expanded-img">
<img alt="Featured image" src="/img/4-concepts-of-functional-programming/featured.webp" />
</div>

Today I spent my spare time learning about functional programming. Here are 4 concepts of that paradigm.

- Pure functions and idempotent
- Side effects
- Function composition
- Shared state and immutable data

Let's go through each concept to know what it is!

## Pure functions and idempotent

The name of the concept is straightforward. A pure function always returns the same output if you give it the same input.

For example, this is a pure function.

```go
func add(a, b int) int {
  return a + b
}

add(1, 2) // Always returns 3
```

## Side effects

A pure function cannot have any side effects. In order words, your function cannot interact with external environments.

For example, calling an API might be a side effect. Because an API call is an external environment that is not under your control. An API can have several inconsistencies such as timeout or failure.

## Function composition

Combine two pure functions to create a new function. This concept still compiles with the first concept because it gives the same output for the same input. It's helpful when we want to split out logics into smaller pieces, reuse them throughout our application and test each part separately.

For example:

```go
package main

import "fmt"

func add(a int) func(int) int {
	return func(b int) int {
		return a + b
	}
}

func multi(a, b int) int {
	return a * b
}

func multiAndAdd5(a, b int) int {
	add5 := add(5)
	return add5(multi(a, b))
}

func main() {
	fmt.Println(multiAndAdd5(3, 4)) // 17
	fmt.Println(multiAndAdd5(1, 1)) // 6
}
```

[Play](https://go.dev/play/p/mJmdoqK9Owk)

## Shared state and immutable data

In functional programming, functions should not hold any state.
