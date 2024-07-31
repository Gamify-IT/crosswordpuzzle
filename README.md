# Crosswordpuzzle

This is a simple crosswordpuzzle. With given questions and answers it automatically generates a crosswordpuzzle.  

## Development

### Getting started
> Beginning of additions (that work)

Clone the repository  
```sh
git clone https://github.com/Gamify-IT/crosswordpuzzle.git
```

Install the dependencies  
```sh
npm install
```

### Compile and Hot-Reload for Development
If you want to run the frontend with your IDE features, whilst having all dependencies running 
via docker use the following:
Start the frontend with:
```sh
npm run serve
```

To also run the backend and a database use:
```sh
docker compose -f docker-compose-dev.yaml up
```

To remove the containers use:
```sh
docker compose -f docker-compose-dev.yaml down
```

### Build your local changes as a docker container

To build and run your local changes as a docker container use:
```sh
docker compose up --build
```
You can remove the container with:

```sh
docker compose down
```

> End of additions

## User manual

Run the docker container with the following command at port 8000:
```sh
docker run -d -p 8000:80 --name crosswordpuzzle ghcr.io/gamify-it/crosswordpuzzle:latest
```
Now you can access it at [http://localhost:8000](http://localhost:8000).  
To access it externally replace localhost with your IP.  

To monitor the container you can use the following command:
```sh
docker ps -a -f name=crosswordpuzzle
```
To stop the container you can use the following command:
```sh
docker stop crosswordpuzzle
```
To remove the container you can use the following command:
```sh
docker rm crosswordpuzzle
```

### Screenshot

![example auto genderated crosswordpuzzle](https://user-images.githubusercontent.com/44726248/169154288-f37c3e86-d8ad-4e78-b2a3-c2cb6645a2d7.png "crosswordpuzzle")

## Audio sources

1.	Background music
https://pixabay.com/de/music/optimistisch-thorn-151881/

2.	Click
https://pixabay.com/de/sound-effects/interface-button-154180/

3.	Error notification
https://pixabay.com/de/sound-effects/error-126627/

4.	Success notification
https://pixabay.com/de/sound-effects/short-success-sound-glockenspiel-treasure-video-game-6346/


