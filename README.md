# Plantventory Server

Link to app: https://plantventory-app.vercel.app/

## About the App

Take care of your plants with ease. Plantventory allows users tobrowse through available plants within the database, where they can find plant type, toxicity, and care details to help them find proper care for plants.

By adding plants to the their own user list, users can easily sift through it to keep 
important plant details in one place.

## Pages

### Landing Page 
![landing_page](/app-screenshots/plantventory-home.png)
This is the introduction located on the main page, explaining what Plantventory does and what it hopes to accomplish. 


### All Plants Page
![allplants_page](/app-screenshots/plantventory-allplants.png)
This page manages the full list of plants in the database, where users can add plants in their user list. It can also filter through the list of plants via search box and filters for plant type and toxicity.

### My Plants Page
![myplants_page](/app-screenshots/plantventory-myplants.png)

The demo user can see their own plant inventory in this page, including information about toxicity, plant type, and care details for each plant.

### Add Plant Page
![addplant_page](/app-screenshots/plantventory-addplant.png)
Users can contribute plants to the database and add to their list if they so wish. It provides options for plant type, toxicity, and area for care details as well.


## Technology Used
- HTML, CSS
- React
- Node
- Express
- PostgreSQL


## API Documentation

### Endpoints

#### /api/plants
- GET: access to all the plants
- POST: allow users post plants to database

#### /api/users/1/plants
- GET: access demo user plants
- POST: post plants from all plants to user plants

#### /api/users/1/plants/:plant_id
- DELETE: allow users to delete plants from user list
