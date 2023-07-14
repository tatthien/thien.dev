---
title: Lessons learned from building a weekly planner app
date: 2023-03-21T14:38:48Z
draft: false
tags: vue, supabase, planner, to-do, build in public
---

<div class="mb-4">
<img src="/img/lessons-from-building-weekly-planner-app/featured.webp">
</div>

There are some changes in my work since I have free time to build this project. It's a weekly planner and to-do list app that aims to enhance your productivity and keeps track of all your stuff in a week calendar view.

## Supabase

[Supabase](https://supabase.com) is an open-source Firebase alternative. It provides Postgres database, authentication and authorization, edge functions, and more.

I mainly use Supabase to store data in the database and utilize the authentication, and authorization features to create the full auth flow.

Supabase's [Javascript client library](https://supabase.com/docs/reference/javascript/introduction) is super handy. You can use it to interact with your Postgres database, listen to database, build login and user management functionality.

Here are some examples of using the library. Such as fetching data, or signing in a user.

Fetching tasks:

```js
const { data, error } = await supabase.from('tasks').select()
```

Signing in a user with email and password:

```js
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'you@example.com',
  password: 'example-password',
})
```

One of the features that I like the most is listening to auth events. You can detect when a user signed in, or signed out.

```js
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') console.log('SIGNED_IN')
  if (event === 'SIGNED_OUT') console.log('SIGNED_OUT')
  if (event === 'PASSWORD_RECOVERY') {
    showPasswordResetScreen()
  }
})  
```

## Tailwind JIT

Using Tailwind Just-in-time allows you to generate styles on-demand. What is generating styles on-demand?

By default, Tailwind comes with the default utility classes such as `mt-1`, `flex`, `grid`, `border`, `rounded`. However, if you want to have custom CSS rules? There are 2 ways: define your custom rules in `tailwind.config.js`, the second way is to use `JIT` mode. 

For example:

I want to create a flex div with 400px of width.

```html
<div class="flex w-[400px]">...</div>
```

I want to create a grid with `minmax`

```html
<div class="grid grid-cols-[repeat(6,minmax(200px,1fr))]"></div>
```

## Vue Teleport

`Teleport` is a built-in component that allows use to move a part of component's template into a DOM node.

As you may know, every component will be rendered inside the Vue application. E.g: `<div id="#app></div>`. However, in some cases we want to render our components outside the Vue application.

Consider the following HTML structure.

```html
<div>
  <MyModal />
</div>
```

And the implementation of `<MyModal>`

```js
<script lang="ts" setup>
const open = ref(false)
</script>

<template>
  <button @click="open = true">Open modal</button>
  <div v-if="open" class="modal">
    <p>Modal content</p>
    <button @click="open = false">Close</button>
  </div>
</template>
```

In this case, the modal's button and the modal itself live within the same component, this is what we want, since they are both related to the open / close state of the modal. But that means the modal will be rendered alongside the button, deeply nested in the application's DOM hierarchy. This can create some tricky issues when positioning the modal via CSS.

Let's use `<Teleport>` to fix that issue:


```js
<template>
  <button @click="open = true">Open modal</button>

  <Teleport to="body">
    <div v-if="open">
      <p>Modal content</p>
      <button @click="open = false">Close</button>
    </div>
  </Teleport>
</template>
```

Here, we are telling Vue to move the modal to the `body` tag. You can open the devtool and see the DOM structure will look like:

Using `<Teleport>`:

```bash
body          
| #app        
| | div       
| | | button  
| div.modal   
```

Not using `<Teleport>`:

```bash
body              
| #app            
| | div           
| | | button      
| | | div.modal   
```

## HSL color model

The `hsl` is a short hand of `hue`, `saturation`, and `lightness`.

By using a single color code, I can use `hsl()` to set the background / text color for MyWeek's labels. The tip is to decrease / increase the `lightness` value (Noted: it doesn't always work as expected).

![HSL 1](/img/lessons-from-building-weekly-planner-app/hsl-1.webp)
![HSL 2](/img/lessons-from-building-weekly-planner-app/hsl-2.webp)

The syntax of `hsl`:

```css
hsl(hue saturation lightness)
hsl(hue saturation lightness / alpha)

/* or with comma-separated values */

hsl(hue, saturation, lightness)
hsl(hue, saturation, lightness, alpha)
```

The [HSL w3schools.com's calculator](https://www.w3schools.com/colors/colors_hsl.asp)

![HSL calculator](/img/lessons-from-building-weekly-planner-app/hsl-calculator.webp)

## Vercel Analytics

I discovered [Vercel Analytics](https://vercel.com/analytics) is free and easy to integrate into my projects. Hence, I moved MyWeek from Netlify to Vercel.

![Vercel Analytics](/img/lessons-from-building-weekly-planner-app/vercel-analytics.webp)

## Conclusion

Building tools around your workflows is fun. You can learn a lot of things from it.
