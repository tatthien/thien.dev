---
title: Vuejs + WordPress + Localization
date: 2017-10-04T09:30:13Z
draft: false
tags: vuejs, wordpress, en
---

Như chúng ta đã biết, WordPress hỗ trợ localization cho Javascript thông qua hàm `wp_localize_script()`. Về cách sử dụng hàm này mình sẽ không đề cập nhiều, vì đã có docs rất rõ ràng.

Quay trở lại việc sử dụng localization cho Vuejs. Thay vì gọi trực tiếp `object_name` từ hàm `wp_localize_script` thì mình sẽ viết một plugin nhỏ cho Vuejs trong đó sẽ viết một hàm tạm gọi là `l10n` (localization) và đưa vào `mixin` để có thể dùng ở bất kì nơi nào trong môi trường Vuejs.

Đầu tiên mình gọi hàm `wp_localize_script` và truyền vào một vài giá trị như sau:

```php
wp_localize_script( 'handler', 'object_name', [
    'l10n' => [
        'intro_title' => __( 'Hello World!', 'text_domain'),
        ...
    ],
] );
```

Tiếp đến phần Vuejs, tạo một file `localization/index.js`. Trong file này mình viết code như sau:

```js
// ibl_global là object_name từ wp_localize_script
const localization = window.ibl_global.l10n 

const L10N = {
  install (Vue, options) {
    Vue.mixin({
      methods: {
        l10n (key) {
          return localization[key]
        }
      }
    })
  }
}

export default L10N
```

Sau đó chỉ cần gọi plugin này ra và sử dụng:

```js
import Vue from 'vue'
import l10n from './localization'
Vue.use(l10n)
```

Sử dụng trong HTML

```html
<h1>{{ l10n('intro_title') }}</h1>
```

Sử dụng trong Vue instance

```js
let text = this.l10n('intro_title')
```

Cách làm này có tác dụng gì so với việc gọi trực tiếp từ `object_name`:

- Trong hàm `l10n` bạn có thể customize thêm trước khi trả về giá trị.
- Gọi hàm thì sẽ gọn gàng sạch sẽ hơn thay vì gọi `object_name.l10n.key`
- Học được viết plugin cho Vuejs
