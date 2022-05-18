# crosswordpuzzle

This is a simple crosswordpuzzle. With given questions and answers it automatically generates a crosswordpuzzle.  

## Development

### Getting started

Clone the repository  
```sh
git clone https://github.com/Gamify-IT/crosswordpuzzle.git
```

Install the dependencies  
```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Build

Build the Docker-Container
```sh
docker build -t crosswordpuzzle-dev
```
And run it at port 8000 with
```sh
docker run -d -p 8000:80 --name crosswordpuzzle-dev crosswordpuzzle-dev
```

To monitor, stop and remove the container you can use the following commands:
```sh
docker ps -a -f name=crosswordpuzzle-dev
```
```sh
docker stop crosswordpuzzle-dev
```
```sh
docker rm crosswordpuzzle-dev
```

## User manual

Run the docker container with the following commang at port 8000:
```sh
docker run -d -p 8000:80 --name crosswordpuzzle PACKAGE-LINK
```
Now you can access it at [http://localhost:8000](http://localhost:8000).  
To acces it external replace localhost with your IP.  

To monitor the container you can use the following commands:
```sh
docker ps -a -f name=crosswordpuzzle
```
To stop the container you can use the following commands:
```sh
docker stop crosswordpuzzle
```
To remove the container you can use the following commands:
```sh
docker rm crosswordpuzzle
```

### Screenshot

![example auto genderated crosswordpuzzle](screenshots/screenshot-1.png "auto genderated crosswordpuzzle")