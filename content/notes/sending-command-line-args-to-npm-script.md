---
title: Sending command line args to npm script
date: 2022-05-09T19:20:00Z
draft: false
tags: javascript, npm, en
---

Today I learned how to pass arguments to the npm scripts. My current scripts look like this:

```json
"scripts": {
  "build": "node ./build.js"
}
```

I can simply run `node ./build.js` by running `npm run build` to build my code. However, I would like to be able to run something like `node ./build.js --watch` which means I want to pass argument(s) to my npm script.

I've tried `npm build --watch` but the script is end up with just `node ./build.js`. 

After googling. I find that I need to use `--` separator to separate the params passed to `npm` command itself and the params passed to my script.

The syntax is as follows:

```bash
npm run <command> -- [-- <args>]
```

Here's how I pass arguments to my script.

```bash
npm run build -- --watch // invokes `node ./build.js --watch`
```

If your params do not start with `-` or `--`, then having an explicit `--` is not needed. For examples:

```bash
npm run build api // invokes `node ./build.js api`
npm run build -- api // also invokes `node ./build.js api`
```

However, it's better to use the separator anyway for clarify.
