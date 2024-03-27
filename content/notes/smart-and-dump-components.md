---
title: Smart component và Dump component
date: 2024-03-27T22:25:00.698Z
tags: react, javascript, typescript, programming
draft: false
featuredImage: /img/smart-and-dump-components/featured-image.webp
---

Trong React, component là một thành phần quan trọng không thể thiếu, nó giúp cho việc cấu trúc code không bị lặp lại, tính tái sử dụng cao.

Vừa qua mình biết tới khái niệm Smart và Dump component. Bài viết này ghi chú lại định nghĩa và trường hợp nào mình sử dụng một trong hai loại đó.

## Smart component

Smart component dịch ra tiếng Việt có thể hiểu là component "thông minh", nghe không hay lắm. Nhưng cũng phần nào cho chúng ta thấy component này sẽ giữ nhiều nhiệm vụ về mặt business logic, quản lí dữ liệu.

Một số nhiệm vụ chính và đặc tính của smart component:

- Chịu trách nhiệm về mặt business logic, quản lí state, kết nối với API để fetch dữ liệu.
- Smart component sẽ sử dụng nhiều hooks, và thư viện vì nó thường phải giải quyết nhiều logic.
- Thông thường smart component sẽ truyền dữ liệu xuống cho dump component vì tính chất quản lí state của mình.
- Component loại này thường sẽ ít được style vì nó tập trung nhiều vào tính năng, thay cho vì hiển thị UI.

Một ví dụ về smart component.

```typescript
import React, { useState, useEffect } from "react";
import axios from "axios";
import { HeadingSection } from "./HeadingSection";
import { DetailsSection } from "./DetailsSection";

export function Section() {
    const [user, setUser] = useState();
    useEffect(() => {
        axios.get("/api/user").then((response) => {
            setUser(response.data)
        });
    }, []);

    return (
      <>
        <HeadingSection title={`${user.name}`} description="User information" />
        <DetailsSection user={user} />
      </>
    )
}
```

Nhiệm vụ của component `Section` sẽ fetch data từ external API và truyền xuống các (dump) component có nhiệm vụ render UI.

## Dumb components:

Ngược lại với smart là dump. Từ dump có thể hiểu ở khía cạnh component này không nắm state hay logic. Nhiệm vụ chính của nó là hiển thị UI.

Một số đặc điểm của dump component:

- Tập trung vào UI
- Không có business logic
- Phải được tái sử dụng (reusable)
- Data của của dump component nhận được từ props, nó cũng có state nhưng state để control mặt UI. Ví dụ show/hide element.

Ví dụ đơn giản về dump component.

```typescript
interface HeadingSectionProps {
    title: string,
    description: string
}

export function HeadingSection({title, description}: HeadingSectionProps) {
    return (
        <div>
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    )
}
```

## Kết luận

Khi chúng ta phân biệt được hai loại component này sẽ giúp code gọn gàng hơn, tránh được việc một component phải handle vừa logic vừa style. Khi code cũng hãy prefer viết dump component càng nhiều càng tốt.

Happy coding!
