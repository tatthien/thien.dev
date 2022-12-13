---
title: AWS EKS + Kubeconfig
date: 2022-12-13T09:30:13Z
draft: false
tags: k8s, aws, eks
---

## Update kubeconfig

Create kube config file using `aws eks update-kubeconfig`. Make sure to define the variable `KUBECONFIG` that points to your desired kube config location.

```bash
KUBECONFIG=/path/to/config \
aws eks update-kubeconfig --region <region> --name <cluster-name>
```

If you successfully update the config, you will see a output log like this:

```bash
Added new context arn:aws:eks:...:cluster/cluster-name to /path/to/config
```

## Merge config files

```bash
KUBECONFIG=/path/to/config-1:/path/to/config-2 \
kubectl config view --flatten > ~/.kube/config
```

## Switch between clusters

First, we can list the current context with `get-contexts` command

```bash
kubectl config get-contexts
```

This will show you the available clusters that you are connected to.

To switch contexts, run the command `use-context` with one of the available contexts.

```bash
kubectl config use-context <context-name>
```
