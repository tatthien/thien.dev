---
title: How to ensure a type implements an interface in Go?
date: 2022-09-22T15:23:13Z
draft: false
tags: go
---

```go
package main

type Shape interface {
	Area() int
}

type Rectangle struct {
	Width int
	Height int
}

func main() {}
```

To ensure that `Rectangle` type implements the `Shape` interface, we check it at compile time.

```go
package main

type Shape interface {
	Area() int
}

type Rectangle struct {
	Width int
	Height int
}

var _ Shape = (*Rectangle)(nil)

func main() {}
```

Compiling the code above gives us the following error:

```
cannot use (*Rectangle)(nil) (value of type *Rectangle) as type Shape in variable declaration:
	*Rectangle does not implement Shape (missing Area method)
```

Implementing the interface gets rid of the compilerrr error

```go
package main

type Shape interface {
	Area() int
}

type Rectangle struct {
	Width  int
	Height int
}

func (r *Rectangle) Area() int {
	return r.Width * r.Height
}

var _ Shape = (*Rectangle)(nil)

func main() {}
```
