- create app.js
- npm init -y
- npm i express
- test with "node app.js"

# Create Image
- create image with ""
- docker build -t express-ts .

# Create Docker Container (Standalone)
- docker run -p 8000:3000 express-ts



# Create Docker Swarm as Cluster
- docker swarm init
- docker service create --replicas 3 --name cmswarm --publish 8000:3000 express-ts

Help:
docker images
docker rmi <image_id>
docker ps 
docker rm <container_id>
docker service ls
docker service rm <service_id>


