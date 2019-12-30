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
# config
`kp` expects you to have the following environment variables available:   
- `KP_URL` - the k8s dashboard URL.   
- `KP_TOKEN` - authorization bearer token.  
- `KP_ENV` - the default env.
  
You can also run with `--url, -u | --env, -e | --token, -t` and provide individual overrides per command.

# usage
run `kp` or `kp --help` to see available commands and options.