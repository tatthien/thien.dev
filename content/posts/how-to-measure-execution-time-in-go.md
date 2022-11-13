---
title: How to measure execution time in Go?
date: 2022-05-25T09:30:13Z
draft: false
tags: go, en
---

While developing [Giraffe](https://github.com/tatthien/giraffe), I want to measure the execution time of the static files building process.

Here is the example code using `time` package:

```go
start := time.Now()

// build process...

duration := time.Since(start)
fmt.Println("Duration:", duration)
```

or

```go
start := time.Now()

// build process...

end := time.Now()
fmt.Println("Duration:", end.Sub(start))
```

[Demo](https://go.dev/play/p/9pJcyjeNyhy)
