---
title: "Select statement in Golang"
date: 2022-12-08T21:30:00Z
draft: false
tags: go, en
---

An example code snippet that shows how `select` works in Golang:

```go
package main

import (
	"log"
	"net/http"
	"time"
)

type result struct {
	url     string
	err     error
	latency time.Duration
}

func main() {
	results := make(chan result)
	list := []string{
		"https://thien.dev",
		"https://12bit.vn",
		"https://12-px.com",
		"https://google.com",
		"https://twitter.com",
	}

	for _, url := range list {
		go ping(url, results)
	}

	stopper := time.After(1 * time.Second)

	for range list {
		select {
		case r := <-results:
			if r.err != nil {
				log.Printf("url: %s %s\n", r.url, r.err.Error())
			} else {
				log.Printf("url: %s %s\n", r.url, r.latency)
			}
		case <-stopper:
			log.Fatal("timeout")
		}
	}
}

func ping(url string, r chan result) {
	start := time.Now()
	resp, err := http.Get(url)
	if err != nil {
		r <- result{url, err, 0}
	} else {
		t := time.Since(start).Round(time.Millisecond)
		r <- result{url, nil, t}
		defer resp.Body.Close()
	}
}
```
