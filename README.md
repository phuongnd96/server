## BUILD

#### in root dir

```
docker build -t <app name here>
```

> ---

## RUN

#### mapping port 3000 that we expose in Dockerfile

```
docker container run -p 3000:3000 <app name here>
```

## Enter the container

```
    docker exec -ti <container id> /bin/bash
```

## Images listing

```
    docker images
```

## Container listing

```
    docker ps
```
