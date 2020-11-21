# Projet finale
This folder contains the final project for the LINFO1212 Course. 
This is a link to our [XD UI design](https://xd.adobe.com/view/55df3040-04f0-4185-98be-db1e66c10891-008c/).
And here the link to our [tasks timeline](https://docs.google.com/document/d/1ffFzls8U0NDZME7glb_DqhvGBNL_LUBWAEz5BC5bzjw/edit).
## 1. Abstract
This application is a web application that allows UCLouvain students to order food in all the restaurants on the Louvain La neuve Campus, and have their orders delivered to the Halls in which they selected. 

## 2. File structure
The file structure is like follow.
```
| static
|--- css
|--- js
|---|--- frontend
|---|--- backend
|---|---|--- customer
|---|---|--- seller
|---|---|--- apis
|--- images
| templates
|--- customer
|--- seller
| tests
| app.js
| server.js
```

## 3. Style Guide 
Here we are going to define our style guide for the project. These are rules that we used while implementing the web application.

### 3.1 JavaScript
For JavaScript (.js) files here are the rules : 

* Imports 
  * Importing modules we will be using the `<require>` keyword.
  * The name given to the variable containg the import is declared with const and the name starts with a capital Letter.
  ```js
  const Mongoose = Require('mongoose');
  const MongodbServer = Require('mongodb').Server;
  const AppClients = Require('./clients/app');
  ```
* Variables 
  * Unchaging variables, are named all in caps with the const declarations. Ex :
  ```js
  const DB = Mongoose.connect(...);
  ```
  * Changing varibles, are named in small letters but with a dash between two words. 
  ```js
  let orders_array = [{}, {}];
  ```
* Functions 
  * For functions we are going to prioritize promises than callbacks. Meaning when possible we are going to always return promises. 
  * Async / sync functions ? this will depend on the developpers needs.
  * Functions name will started with a small letter but a Capital letter is a must when starting a new word.
  ```js
  async function fetchFromDb(db, spec){
    ...
  }
  ```
 ### 3.2 CSS 
 For the Cascading Style Sheets (.css) files we are going to prioritize classes over ids. So that we can use the ids in for the front end javascript programing.
 
 ### 3.3 HTML
 The html files are mostly going to be `<templates>` that use mustache [mustache](https://github.com/janl/mustache.js).

  
