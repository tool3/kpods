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
kpods is a small, frictionless kubernetes pod management utility that works with kubernetes-dashboard APIs.   
no kubeconfig, minimal setup.

# install
`npm install -g @tool3/kpods`

once installed, it will be available globally as `kp` and `kpods`.

# config
`kp` expects you to have the following environment variables available:   
- `KP_URL` - the k8s dashboard URL.   
- `KP_TOKEN` - authorization bearer token.  
- `KP_ENV` - the default namespace.
  
You can also run with `--url, -u | --env, -e | --token, -t` and provide overrides on demand.

# usage
`kp` or `kp --help` to see available commands and options.