---
title: "Neovim Plugin: Which Key"
date: 2024-03-04T19:22:11.239Z
description: WhichKey is a lua plugin for Neovim 0.5 that displays a popup with possible key bindings of the command you started typing.
tags: vim
---

Vim/Neovim is a keyboard-driven IDE, which means you can code efficiently without needing to switch between your keyboard and your mouse. This is where key bindings beecome invaluable, significantly enhancing productivity.

However, remembering the vast array of defaault and custom key bindings can be challenging. This is where [WhichKey](https://github.com/folke/which-key.nvim) steps in, offering a visual guide to all possible key bindings for the command your started typing.

Let's install `WhichKey` into your Neovim. I prefer using [lazy.nvim](https://github.com/folke/lazy.nvim) as my NeoVim's package manager, but feel free to use your your preffered package manager.

```lua
{
    "folke/which-key.nvim",
    event = "VeryLazy",
    init = function()
        vim.o.timeout = true
        vim.o.timeoutlen = 300
    end,
    opts = {
        -- your configuration comes here
        -- or leave it empty to use the default settings
        -- refer to the configuration section below
    }
}
```

You can start using `WhichKey` with the default configuration (full configuration can be found [here](https://github.com/folke/which-key.nvim?tab=readme-ov-file#%EF%B8%8F-configuration)). Simply press your first key, and if there are any associated key bindings, `WhichKey` will display a popup listing them, prefixed by your initial key.

For instance, if I press `g`, `WhichKey` will show a list of key bindings starting with `g`, as the screenshot below:

![Figure 1](/img/neovim-plugin-which-key-figure-1.png)
