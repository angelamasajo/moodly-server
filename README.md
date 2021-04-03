# Moodly App

Link to app: https://moodly.vercel.app

## About the App

Moodly is a mood tracker, where the user can track their moods regularly and make a journal entry based on their mood. Users can then look back at their journal entries by filtering which journal entries they want to see by mood speficied to help them navigate any strong emotions, regardless of whether they are positive or negative.



## Pages

### Landing Page 
![landing_page](/app-screenshots/plantventory-home.png)
This is the introduction located on the main page, explaining what Moodly does and what it hopes to accomplish. 


### All Plants Page
![allplants_page](/app-screenshots/plantventory-allplants.png)
This page manages the full list of Moodly entries that the user has added. The entries can be sorted by mood to help users navigate similar emotions.


### Add Plant Page
![addplant_page](/app-screenshots/plantventory-addplant.png)
Users can add new Moodly entries on this page, including title, mood, and description/journal entry.


## Technology Used
- HTML, CSS
- React
- Node
- Express
- PostgreSQL


## API Documentation

### Endpoints

#### /api/entries
- GET: access to all the user entries
- POST: allow users post entries

#### /api/entries/:entry_id
- GET: access separate plants
- DELETE: users can delete entries