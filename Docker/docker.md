
Docker Image : bundle all of our application code , support binaries and configuration together at once

We then deploy many images on a server ( copies of each other ) , and whenver one goes
down , we just put up a new one. 

Docker : 
- Build image : Consistently package everything your application needs to run
- Ship Image : Easily ship these images to runtimes in the cloud or on your local developer machine
- Run Image : Easily and consistently execute your application

A container is a process that is isolated from the rest of the system, it has its
own filesystem and its own network, it is restricted in cpu/memory usage

- `docker build <path> <other-params>` : build an image from source
  - `-t|--tag` : set `name:tag` , tag is optional (default to `latest`)
  - `--file` : DockerFile location , defaults to the path passed to it

- `docker rmi <image-id>` : remove an images

- `docker images` : list of images on this machine

- `docker run image-name` : runs an image
  - if  we don't name our container , docker will name it for us
  - Make sure that you put all args before putting the name of the image !!!!!


- `docker start container-name`: start a container

- `docker ps` : see containers that are running
  - `-a` : see all available containers and their status

- `docker stop container-name` : stop a container

- `docker rm container-name` : remove the container
  - will not be available in `docker ps -a` now

---

##### Docker run example

- `docker run -p 8080:3000 --name hello -d <image-name>`
  - `-p` : 8080(local) -> 3000(container)
  - `-d` : detached 
  - `--name` : container name (otherwise it will be auto generated

if that didn't work for us we can try this instead `docker run --network host -d --name hello hello-world`

It's also important to change binding inside the application itself from 127.0.0.1 to 0.0.0.0 , so anyone with access to network can access the address

check `https://nickjanetakis.com/blog/docker-tip-54-fixing-connection-reset-by-peer-or-similar-errors`


---

- `docker logs <container-name>` : see logs of the container
  - `-f` : follow container logs, hit `^C` to stop it



---

#### Docker Hub

- `docker tag <name:tag> <newname:tag>`
  - create tag **target image** from **source image**

- `docker login` : login to your docker repo

- `docker push <remote-image-name:local-tag>` : push an image to the repo that has the same name with the local tag

- `docker pull <remote-image:remote-tag>` : pull from DockerHub the image with the specified tag ( it we don't specify, tag will default to latest and will search for it that way)


---

#### Docker compose

- Used to run multiple containers together , here we used our local image and a new remote image for mongodb

```yml
version: "2"

services:
  web:
    build:
      context: . # the path of the build
      dockerfile: Dockerfile # dockerfile name
    container_name: web # the container name to run in , otherwise auto generated
    port:
      - "8080:3000" # expose port 3000 , map it to port 8080

  db:
    image: mongo:3.6.1 # the base image to pull
    container_name: db  # the container name
    volumes: # used to do persistent storage
      - mongodb:/data/db # this is where mongo exposes our files
      - mongodb_config:/data/configdb
    ports:
      - 27017:27017
    command: mongod # run this command at the end
    
volumes: # here we define our volumes, we just specify the names and docker will manage these volumes and their storage
  mongodb:
  mongodb_config:
```

- `docker-compose up` : builds if necessary , runs the image within the specified container name
  - `-d` : run in background

- `docker-compose down` : stops the server(s) 

---

`docker exec <container-name> bash` : open bash inside container
