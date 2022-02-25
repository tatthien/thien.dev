---
title: Một vài ghi chú khi build static site generator?
date: 2022-01-18T22:25:00.698Z
tags: golang, devlog
draft: false
---

Những ngày đầu năm 2022, khi ngồi viết bài recap, mình nghĩ sao không bắt đầu năm 2022 bằng việc build một thứ gì đó hay ho cho mình.

Static site generator (SSG) không phải còn xa lạ nữa. Đã có rất nhiều SSG tốt hơn nhiều nhưng mình vẫn muốn tự build một cái riêng với mục đích chính là để nắm vững Golang hơn.

Bên dưới đây là một vài điều mà mình đã học được.

### Sort

Khi muốn hiển thị danh sách post, tag được sắp xếp theo một thứ tự nào đó, ví dụ theo ngày tháng, tên mình đã tìm hiểu `sort.Sort` trong Golang.

Hàm `Sort` nhận vào data là một `Interface` gồm có 3 methods: `Len`, `Less` và `Swap`. 

Vì vậy để sort được một list dữ liệu, mình cần tạo ra một type có 3 method tương ứng.

```go
type TagsByName []Tag

func (tags TagsByName) Len() int {
	return len(tags)
}

func (tags TagsByName) Less(i, j int) bool {
	return tags[i].Name < tags[j].Name
}

func (tags TagsByName) Swap(i, j int) {
	tags[i], tags[j] = tags[j], tags[i]
}
```

Và sử dụng như sau:

```go
sortedTags := engine.Tags
sort.Sort(model.TagsByName(sortedTags))
```

### Lắng nghe file change

Chúng ta không muốn mỗi lần thay đổi content, html, css thì phải build lại bằng cách chạy lại lệnh build. Thay vào đó mình muốn lắng nghe file change, trigger khi có thay đổi và chạy lại hàm build tự động.

Để làm được việc này. Mình đã sử dụng [fsnotify](github.com/fsnotify/fsnotify). Có hai việc chính cần làm đó là:

- Quét hết tất cả thư mục mà mình muốn lắng nghe sự thay đổi. `fsnotify` sẽ tự động watch file trong thư mục đó.
- Khi có sự thay đổi, mình sẽ trigger hàm build.

Để quét thư mục và file, mình sẽ dụng `filepath.Walk`

```go
if err := filepath.Walk(".", watchDir); err != nil {
    log.Fatal(err)
}
```

`Walk` sẽ nhận vào một callback, mình sẽ viết hàm callback này để xử lí một vài logic.

```go
func watchDir(path string, info os.FileInfo, err error) error {
	if err != nil {
		return err
	}

    // Mình chỉ watch 2 thư mục là `theme` và `content`
	if info.IsDir() {
		if strings.HasPrefix(path, "theme") || strings.HasPrefix(path, "content") {
			return watcher.Add(path)
		}
	}

	return nil
}
```

```go
go func() {
    for {
        select {
        case event, ok := <-watcher.Events:
            if !ok {
                return
            }
            log.Println("modified file:", event.Name)
            Build() // <-- trigger build
        case err, ok := <-watcher.Errors:
            if !ok {
                return
            }
            log.Println("error:", err)
        }
    }
}()
```

Nhưng vậy mỗi lần có sự thay đổi nội dung file hoặc thêm, xóa file thì SSG sẽ tự động build lại để hiển thị nội dung mới nhất.

### Sử dụng template

Để có thể render data thành cách file html, mình sẽ sử dụng [template](https://golang.org/pkg/text/template/).

Đây là một đoạn code để hiển thị list bài viết ngoài trang chủ.

```html
<ul class="post-list">
    {{ range .Posts }}
    {{ if eq .Type "posts"}}
    <li class="post-item">
        <a href="{{ .Permarlink }}">{{ .Title }}</a>
        <div>
            <span class="post-date">{{ .Date.Format "Jan 02, 2006" }}</span>

            <span class="post-tags">
                {{ join .Tags ", " }}
            </span>
        </div>
    </li>
    {{ end }}
    {{ end }}
</ul>
```

Nếu để ý sẽ thấy có một chỗ mình gọi `{{ join .Tag ", "}}`, nó giống như `Array.prototype.join` trong JavaScript hay `implode` trong PHP.

Tuy nhiên go template không hỗ trợ bạn gọi `join` trong template. Thay vào đó chúng ta phải định nghĩa hàm `join` này thông qua `template.FuncMap`.

```go
funcMap := template.FuncMap{
    "safe_html": func(s string) template.HTML {
        return template.HTML(s)
    },
    "join": func(a []string, sep string) string {
        return strings.Join(a, sep)
    },
    "slugify": util.Slugify,
}
```

Mỗi hàm cần bắt buộc phải return một giá trị hoặc hai giá trị với giá trị thứ hai là một error. Bạn có thể xem thêm hàm `Slugify` đơn giản mình đã viết ở [đây](https://github.com/tatthien/giraffe/blob/master/util/general.go#L9).

Cách gọi hàm và truyền param trong go template cũng khá thú vị. Ví dụ bạn thấy hàm `join` nhận vào 2 arg là một mảng string và một chuỗi separator. Thì trong template sẽ gọi như sau:

```html
{{ function arg1 arg2 arg3 }}
{{ join .Tags ", "}}
```