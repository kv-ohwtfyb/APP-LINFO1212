# Projet finale
This folder contains the final project for the LINFO1212 Course.
Here are special links :
- Link to our [XD UI design](https://xd.adobe.com/view/55df3040-04f0-4185-98be-db1e66c10891-008c/).
- Link to our [tasks timeline](https://docs.google.com/document/d/1ffFzls8U0NDZME7glb_DqhvGBNL_LUBWAEz5BC5bzjw/edit?usp=sharing).
- Link to our presentation slides [Slides](https://www.icloud.com/keynote/0qzADc2W9uOAxx8WAyCxxhYxg#LINFO1212_-_GiQ)

## 1. Abstract
This application is a web application that allows UCLouvain students to order food in all the restaurants on the Louvain-La-neuve Campus, and have their orders delivered to University Halls in which they selected. 

## 2. File structure
The file structure is like follow.
```
| db
|--- giq
| private
|--- ssl
|--- js
|---|--- customer
|---|--- seller
|---|--- general
|---|--- apis
| static
|--- css
|--- js
|--- images
| templates
|--- customer
|--- seller
| dbCommand.txt
| app.js
| server.js
```

 ## 5. Additional Information
 * In `server.js`, we only import the app and connect the server to our database.
 * We used *Mongoose* to give structure to and connect our server with our database. [Mongoose Documentation](https://mongoosejs.com/docs/index.html) (-----)
 * To secure sensitive information,to prevent from brute-force attack and protect passwords, we used *bcrypt* and *express-rate-limit* modules.
 * To secure our database, we created a user's security creditials which without it, the user can't get access to our database. (**Is it necessary?**)
 
 ## 6. How To run our web
 
It's important to install all the requirements before running the server

1. If it is your first time running our server, You will *need to import our database*, for a better experience. To do so:
	* Run your mongodb in a terminal : `mongod --dbpath <pathOfWhereYourDbIs>`.
	* Go in 'db' folder of our project. There is a folder named 'giq'.
	* Copy the path of 'giq'. 
	* Open a new terminal in the 'ProjetFinale' folder.
	* Run this command : `mongorestore --db giq --drop <pathYouCopied>`. 
		It should look like this : `mongorestore --db giq --drop pathWhereYouPutOurProject/projetFinale/db/giq`.
	* If everything is okay, run also this command: `mongo < dbCommand.txt`.
	* then Skip point 2 below and go directly to point 3.

2. If it isn't your first time, please, run your mongodb in a terminal : `mongod --dbpath <pathOfWhereYourDbIs>` .
3. Run our file server.js in the terminal: `node server.js` or `npm start` **(Please make sure to be in the 'ProjetFinale' folder)**
4. Open a web browser and then type 'https://localhost:8080/'
5. If you get a Privacy error, go to Advance => Proceed to localhost (unsafe) (Don't worry, No hackers will come for our website).
