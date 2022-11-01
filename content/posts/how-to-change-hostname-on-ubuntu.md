---
title: How to change hostname on Ubuntu?
date: 2022-05-23T18:41:00Z
draft: false
---

We can simply use the `hostnamectl` command to change hostname.

To see the current setting just typing the following command:

```
$ hostnamectl
```

Sample output:

```
   Static hostname: john-laptop
         Icon name: computer-vm
           Chassis: vm
        Machine ID: 290d8c5548414c8795805bbc6a9ec305
           Boot ID: 07b317bb8fe248f9ab3bb6291394c72a
    Virtualization: xen
  Operating System: Ubuntu 20.04 LTS
            Kernel: Linux 5.4.0-1018-aws
      Architecture: x86-64
```


To change hostname from `john-laptop` to `thien-laptop`, use the following command:

```
$ hostnamectl set-hostname thien-laptop
```
