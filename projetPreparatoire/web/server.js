const express = require('express');
const consolidate = require('consolidate');
const app = express ();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const session = require('express-session');
const fs = require('fs');
const Server = require('mongodb').Server;
const https = require('https');
const bcrypt = require('bcrypt');
const limiter = require('express-rate-limit');
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"]; // Accepted Image Types
const IncidentSchema = require('./static/js/incidentModel');

app.engine('html', consolidate.hogan);
app.set('views', 'templates');

app.use(bodyParser.urlencoded({ extended :true, limit: '50mb' }));

app.use(session({
    secret: "EnCRypTIoNKeY",
    resave: false,
    saveUninitialized: true,
    cookie: {path: '/', httpOnly: true, limit: 30 * 60 * 1000}
}));

// MongoDb connection
MongoClient.connect('mongodb://localhost:27017', {useUnifiedTopology: true}, (err, db) => {
    if (err) throw err;
    console.log(new Date().toLocaleTimeString() + " Connected to the database")
    const db_ = db.db("projectdb");
    const date = new Date();
    // Loading the incidents
    let incidents;

    loadingIncidents(db_)
        .then(r => {
            incidents = r.result;});

    /**************** Get Requests ****************/

    // When requesting the home page.
    app.get('/', function (req , res) {
        res.render('index.html', {
            incidents: incidents,
            username: req.session.username || "Please login", loggedIn :(req.session.username != null)})
    });


    // When requesting the preview page
    app.get('/preview', function (req, res) {
        fetchFromDb(db_, 'incidents', {description : req.query.description, address: req.query.address,
            user:req.query.user, date:req.query.date},false, true)
            .then(inc => {
                setImageSrc(inc);
                res.render('incidentPreview.html', {
                    username: req.session.username || "Please login",
                    incident: inc,  loggedIn :(req.session.username != null),
                    admin: req.session.admin
                });
            })
            .catch(err => { console.error(err); })
    });

    // When requesting the report page
    app.get('/report', function (req, res) {
        if (req.session.username){
            res.render('report.html', {username: req.session.username || "Please login"});
        }else {
            res.render('login.html');
        }
    })

    // When requesting the login page
    app.get('/login', loginRequestLimit, function (req, res) {
        res.render('login.html');
    })

    // When getting search request
    app.get('/search', function (req, res) {
        userSearching(db_, "incidents", req.query.search)
            .then(r => {
                if (r) {
                    res.render('index.html', {
                        username: req.session.username,
                        incidents: r, loggedIn :(req.session.username != null),
                        search: req.query.search
                    });
                } else {
                    res.status(204);
                }
            })
            .catch(err => {
                throw err;
            })
    });

    /**************** Post Requests ****************/

    // When submitting a report
    app.post('/report', function (req, res) {
        if (req.session.username) {                         // If he is logged in
            reporting(db_, req.body, date, req.session, incidents)
                .then(promise => {
                    if (promise.status) { res.redirect('/'); }
                    else { ( res.send("Sorry an error was detected when inserting an incident")); }
                })
                .catch( err => { res.send(424)})
        }else {                                            // If he hasn't logged in
                res.render('login.html', {"msgLogin": "Please first login"});
            }
    });

    // When login in
    app.post('/login', loginLimit, function (req, res) {
        // db searching
        loggingIn(db_, req.body, req.session).then(r => {
            if (r.status) {                                  //Login passed
               res.redirect('/');
            } else {                                         //Login failed
                res.render("login.html", {"msgLogin": r.msg, username: req.body.username});
            }
        });
    });

    //When logging out
    app.get('/logout',function(req,res){
        if(req.session.username){
            req.session.destroy(function (err) {
                if (err) throw err;
                res.redirect('/');
            });
        }
    });

    // When signing up
    app.post('/sign', signInLimit, function (req, res) {
        // Check ups to ensure there's n't someone with the same username
        signingUp(db_, req.body).then(value => {
            if (value) {                                     //signup passed
                req.session.username = req.body.signUsername;
                res.redirect('/');
            } else {                                         //signup failed
                res.render("login.html", {"msgSignUp": "Another user has the same username. Try a different using another."});
            }
        });
    });


    /**************** delete Requests ****************/

    // Deleting an incident
    app.delete('/deleteIncident', function (req, res) {
        if (req.session.admin) {
            deleteDocument(db_, 'incidents', req.body)
                .then(r => {
                    if (r.status) {
                        loadingIncidents(db_).then(r => {
                            incidents = r.result;
                        });
                    }
                    res.json({'success': r.status});
                 });
        } else {
            res.json({'success': false});
        }
    })
});

app.use(express.static('static'));
/*
    Variable that checks number of times you are requesting the page
*/
https.createServer({
    key         : fs.readFileSync('./ssl/key.pem'),
    cert        : fs.readFileSync('./ssl/cert.pem'),
    passphrase  : 'ndakwiyamye'
}, app).listen(8080, function () {
    console.log( new Date().toLocaleTimeString() + " Server running on port 8080.");
});
/*
    Variables that check how many times you trying to log in or you request the 'log in' page
*/
const loginLimit = limiter( {
    max: 5, //Max 5 essays
    windowMs: 5 * 60 * 1000,  // 5 minutes
    message : "You entered the wrong username or password so many times, Please try again later"
});

const loginRequestLimit = limiter( {
    max: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: "Too much requests for this page. Please try again later"
})

/*
    Variable that checks accounts created for 1 user.
*/
const signInLimit = limiter({
    max:3, // Max 3 accounts that can be created
    windowMs: 24 * 60 * 60 * 1000, // blocking for 24 hours
    message : "Too much accounts were created with this IP. Please try again tomorrow"
})

/*
    Returns a the result of a quest in the database.

    db (Object)         : mongodb, db object.
    collection (String) : of a collection into the db.
    spec (JSON)         : contains the criteria.
    toArray (Boolean)   : if the result is an array.
    one (Boolean)       : if the function fetch on element.
 */
function fetchFromDb(db, collection, spec = {}, toArray= false, one = false){
    if (one) {
        return db.collection(collection).findOne(spec);
    } else if (toArray) {
        return db.collection(collection).find(spec).toArray();
    } else {
        return db.collection(collection).find(spec);
    }
}

/*
    Insert the body to the db.

    db (Object)         : mongodb, db object
    collection (String) : of a collection into the db
    spec (JSON)         : contains the criteria.
    toArray (Boolean)   : if the result is an array.
 */
function insertIntoDb(db, collection, body){
    db.collection(collection).insertOne(body)
        .then(()=> {})
        .catch((err) =>{ throw err;});
}

/*
    When logging in

    db (Object)         : mongodb, db object.
    body(JSON)          : body of the request.
 */
async function loggingIn(db, body, session){
    const result = await fetchFromDb(db, "users",{username: body.username}, false, true);
    if (result){
        if(await bcrypt.compare(body.password, result.password)){
            this.status = true;
            this.msg = "";
            session.username = result.username;
            session.admin = (result.admin === 1);
            return this;
        }else{
           this.status = false;
           this.msg = "Password incorrect try again";
           return this;
        }
    }else{
        this.status = false;
        this.msg = "No username with that name found";
        return this;
    }
}

/*
    When signing somebody up.

    db (Object)         : mongodb, db object.
    body(JSON)          : body of the request.
 */
async function signingUp(db, body){
    // Check if there's some on with the same username
    const rez = await fetchFromDb(db, 'users', {username: body.signUsername},true);
    const pswd = body.signPassword;
    const saltRounds = 10;

    if(rez.length > 0){
        return false;
    }else{
        await bcrypt.hash(pswd, saltRounds, (err, hash) => {
            if (err) throw err;
            insertIntoDb(db, 'users', {
                username: body.signUsername,
                email: body.email, password: hash, name: body.signName, admin: 0
            });
        });
        return true;
    }
}

/*
    When signing somebody up

    db (Object)         : mongodb, db object.
    body(JSON)          : body of the request.
    date(Date Object)   : to be able to show the time.
    session
    incidents(JSON)     : array fo incidents.
 */
async function reporting(db, body, date, session, incidents){
    try{
        const newInc = new IncidentSchema({
            description : body.description,
            user :session.username,
            address : body.streetAddress + "," + body.postalCode + " " + body.region,
            date: date.toLocaleDateString()
        });
        await savingImage(newInc,body.image);
        await newInc.save();
        setImageSrc(newInc);
        incidents.push(newInc);
        this.status = true;
        return this;
    } catch (err){
        console.error(err);
        this.status = false;
        return this;
    }
}

/*
    Loads up the list of incidents
    db (Object)         : mongodb, db object.
 */
async function loadingIncidents(db){
    this.result = await fetchFromDb(db,"incidents",{},true);
    await this.result.forEach(incident => {
        setImageSrc(incident);
    })
    return this;
}

/*
    Delete an element from the db.

    db (Object)         : mongodb, db object.
    collection (String) : of a collection into the db.
    spec (JSON)         : contains the criteria.
 */
async function deleteDocument(db, collection, spec){
    await db.collection(collection).deleteOne(spec)
        .then( r => {
            this.status = r.deletedCount !== 0;
        }).catch( err => { throw err; })
    return this;
}

/*
    Handles searching requests.

    db (Object)             : mongodb, db object.
    searchString (String)   : a string of the user input.
 */
async function userSearching(db, collection, searchString){
    await db.collection(collection).ensureIndex({ description : "text", address: "text", date: "text", user: "text"});
    this.result = await db.collection(collection).find({ $text: { $search: searchString }},
                                         { score: { $meta: "textScore" }}).sort( { score: { $meta: "textScore" } });
    this.result = await this.result.toArray();
    await this.result.forEach(incident => {
        setImageSrc(incident);
    });
    return this.result
}

/*
    Saves the encoded image to the incident schema
    incident (Schema)       : The schema of an incident.
    imgEncoded (String)     : encoded image by filepond from the web app
 */
function savingImage(incident, imgEncoded) {
  if (imgEncoded == null) return;
  const img = JSON.parse(imgEncoded);
  if (img != null && imageMimeTypes.includes(img.type)) {
    incident.image = new Buffer.from(img.data, "base64");
    incident.imageType = img.type;
  }
}

/*
    Sets the image src which will be used in html for an incident collected from the db.

    incident(JSON)          : The incident
 */
function setImageSrc(incident){
    if (incident.image != null){
        incident["imgSrc"] = `data:${incident.imageType};charset=utf-8;base64,${incident.image.toString('base64')}`;
    }else { incident["imgSrc"] = "" }
}
