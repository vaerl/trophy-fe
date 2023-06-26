# build the frontend - this needs the .env-file
docker build . -t trophy-fe

# run the frontend
docker run --name trophy-fe -p 4999:3000 -d trophy-fe