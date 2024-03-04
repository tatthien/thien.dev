---
title: Manage multiple SSH keys on one machine
date: 2022-05-10T23:18:00Z
draft: false
tags: en
---

Today I got a problem when adding SSH key to my new Gitlab account. I was trying to add a new key, but I got an error `Fingerprint has already been taken`. Gitlab doesn't allow you to add the same key for multiple accounts.

After a few searching, I found the solution quite simple. 

Firstly, you need to generate a new ssh key and save it in a different file name. E.g `~/.ssh/id_rsa_company` (Suppose you're using RSA).

Then, edit `~/.ssh/config` and add the following configuration:

```bash
# Company account
Host gitlab.company
  HostName gitlab.com
  PreferredAuthentications publickey
  IdentityFile ~/.ssh/id_rsa_company

# Personal account
Host gitlab.personal
  HostName gitlab.com
  PreferredAuthentications publickey
  IdentityFile ~/.ssh/id_rsa_personal
```

Now, this is the important thing that you should keep in mind whenever cloning a repository.

For example, let's clone the repository named `demo`. The usual repository URL will be something like: 

```bash
git@gitlab.com:username/demo.git
```

However, you've already configured the host name for gitlab.com, so you should modify the above repository URL as:

```bash
git@gitlab.company:username/demo.git
```

Similarly, you have to modify the clone URL of the repository in the personal account depending on the alias provided in the configuration file.
