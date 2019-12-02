sudo service mysql stop
sudo fuser -k 3306/tcp
sudo fuser -k 3301/tcp
sudo fuser -k 8080/tcp
sudo docker-compose up
