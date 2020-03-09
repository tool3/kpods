```bash
                                            _              _      
                                           /\_\           /\ \    
                                          / / /  _       /  \ \   
                                         / / /  /\_\    / /\ \ \  
                                        / / /__/ / /   / / /\ \_\ 
                                       / /\_____/ /   / / /_/ / / 
                                      / /\_______/   / / /__\/ /  
                                     / / /\ \ \     / / /_____/   
                                    / / /  \ \ \   / / /          
                                   / / /    \ \ \ / / /           
                                   \/_/      \_\_\\/_/
                                   
                                            k8s pods cli                   
```
[![Build Status](https://travis-ci.org/tool3/kpods.svg?branch=master)](https://travis-ci.org/tool3/kpods)   [![npm](https://img.shields.io/npm/dm/@tool3/kpods)](https://www.npmjs.com/package/@tool3/kpods)   
kpods is a small, frictionless kubernetes pod management utility that works with kubernetes-dashboard APIs.   
no kubeconfig, minimal setup.

# install
`npm install -g @tool3/kpods`

once installed, it will be available globally as `kp` and `kpods`.

# config
`kp` expects you to have the following environment variables available:   
- `KP_URL` - the k8s dashboard URL.   
- `KP_TOKEN` - authorization bearer token (without Bearer).  
- `KP_ENV` - the default namespace.
  
You can also run with `--url, -u | --env, -e | --token, -t` and provide overrides on demand.

# usage
`kp` or `kp --help` to see available commands and options.

# multi cluster 
given you have multiple clusters and hence multiple k8s dashboards, you can store env variables in files (`.properties` for example) and export them based on the current namespace you are working with, for example:   
#### KP_DEV.properties
```bash
KP_URL="your k8s dashboard url"
KP_ENV="dev" #assuming your namespace in dev cluster is also dev
KP_TOKEN="your bearer token (without Bearer)"
```
#### KP_PROD.properties
```bash
KP_URL="your k8s dashboard url"
KP_ENV="prod" #assuming your namespace in prod cluster is also prod
KP_TOKEN="your bearer token (without Bearer)"
```
#### usage example
using one of the `kp` configs (dev in this example), is as easy as:   
```bash
source KP_DEV.properties
```
or better yet:
```bash
. KP_DEV.properties
```

so essentially keeping 2 terminal tabs each for it's own `kp` config, or update them on the fly!
