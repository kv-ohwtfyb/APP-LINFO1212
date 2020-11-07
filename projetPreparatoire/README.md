# Projet Preparatoire
This file contain a JavaScript v8 web application built with express.

## About
The web application main functionalities is to be able to report, read, (delete) incidents (for admin users). The name given to it is HappyStreet.

## Functionalities
The functionalities available in the web applications are :
  - Viewing incidents.
  - Authentification (Log in / Register).
  - Reporting an incident.
  - Deleting an incident (Admin).
  - Searching incidents based your criteria.
  
## Technologies 

In the making of this project, we used various technologies. Among those are :

#### NodeJS
Since the project had to be written in JavaScript we needed a runtime engine.

#### ExpressJS
This library was used in order to create a running app.

#### Express-session
This technology was used to secure the clients sessions with cookies.

#### Body-Parser
We used this libary to be able to get parse the queries from clients.

#### ConsolidateJS (Mustache Protocol)
This technology was used to create HTML template pages.

#### MongoDB (JS)
Our database is a NON SQL database. We used the mongodbJS library in order to maintain the connection from the server to the database.

#### HTTPS JS and FS
We had to make a secure web app, so we needed to create use a https server for this.

#### BCRYPT JS
We had to hash sensitive informations from clients for extra ptotection so we used this library for that task.

## DataBase Structure

Since we use MongoDb we will be using theri terminology here.
In the application we use a database called "projectdb". 
This databse contain the following collections :

### Collections

#### - incidents 
  Containing all the incidents. 
  {"description":"...", "address":"...", "user":"...", "image": id, "date": integer}.
  This collection has 3 indexes to improve search operations.
  to understand indexes I recommand to visit this page :
  https://beginnersbook.com/2017/09/mongodb-indexing-tutorial-with-example/#:~:text=An%20index%20in%20MongoDB%20is,that%20holds%20only%20few%20fields.
  
  ##### * ( {description : "text", address : "text"} ) 
      This index will be used when the user's input search put is all text meaning he's looking for an incident that fit a certain description.
  
  ##### * ( {date : '...'})        
      This index will be used when the user input is only digits with '.',',' therefore looking for a date.
  
#### - users : 
  Containing users info. 
  {"username":"...", "password":"...", "email":"...", "name":"..."}
  ##### * ( { username : "text"} )
        This index is used when searching for username. 
  
#### - images :
  Containing images info.


## Run App

To run the app :
  - Make sure you have a mongodb server running on port 27017.
  - (For better experience make sure you respect the db structure).
  - You installed all the dependencies.
  - Open "web" folder.
  - Open terminal in the folder and run this command "node server.js".
  - Enjoy.
