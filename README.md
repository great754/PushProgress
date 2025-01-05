# PushProgress
Created by Great Abhieyighan
## Description
This was a personal project started in November 2024, and finished in January 2025. I decided to create a workout application that takes the current eating habits of the user into account and produces a personalized workout plan depending on days available and goals. This also uses API's provided by **CalorieNinjas** and **RapidApi** to help get calorie data for foods and activities. 

## Built with
* ![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
* ![JavaScript](https://img.shields.io/badge/JavaScript-092E20?style=for-the-badge&logo=javascript&logoColor=yellow)
* ![HTML](https://img.shields.io/badge/Html-092E20?style=for-the-badge&logo=html&logoColor=red)
* ![CSS](https://img.shields.io/badge/Css-092E20?style=for-the-badge&logo=css&logoColor=white)

## Requirements

Before running the project, ensure you have the following installed on your system:

- Docker
- Docker Compose

## Setup Instructions
The app can be used through the url [www.thepushprogress.com](), but if you want to use 

### 1. Clone the Repository

```bash
git clone https://github.com/great754/PushProgress.git
```

### 2. Create a ```.env``` File
Create a ```.env``` file in the root directory with the following variables:
```
DB_NAME=...
DB_USER=...
DB_PASSWORD=...
```
### 3. Build and Start the Containers
Once the repository is cloned and the .env file is set up, use the following Docker Compose commands to build and run the application:
```
docker-compose up --build
```
This will:

Build the Docker image for the web service (using the Dockerfile).
Pull the MySQL 8.0 image for the database.
Set up the required environment variables for both services.
Start both the web service (Django + Gunicorn) and the MySQL database.

### 4. Access the Application
Once the containers are up and running, you can access the application at
```
http://localhost:8000
```
