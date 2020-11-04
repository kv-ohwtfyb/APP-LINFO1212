const express = require('express');
const consolidate = require('consolidate');
const app = express ();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const session = require('express-session');
const fs = require('fs');
const Server = require('mongodb').Server;
const https = require('https');
const path = require('path');

app.engine('html', consolidate.hogan);
app.set('views', 'templates');

app.use(bodyParser.urlencoded({ extend:true }));
app.use(session({
    secret: "EnCRypTIoNKeY",
    resave: false,
    saveUninitialized: true,
    cookie: {path: '/', httpOnly: true}
}));

// MongoDb connection
MongoClient.connect('mongodb://localhost:27017', {useUnifiedTopology: true}, (err, db) => {
    const db_ = db.db("projectdb");
    const date = new Date();
    // Loading the incidents
    let incidents;
    loadingIncidents(db_)
        .then( r => {
            incidents = r.result;
    });

    /**************** Get Requests ****************/

    // When requesting the home page.
    app.get('/', function (req, res) {
        res.render('index.html', {incidents: incidents, username: req.session.username || "Please login"});
    });

    // When requesting the preview page
    app.get('/preview', function (req, res) {
        res.render('incidentPreview.html', {
            username: req.session.username || "Please login",
            incident: {
                "description": req.query.description || 'Not provided', "address": req.query.address || 'Not provided',
                "user": req.query.user || 'Not provided', "status": req.query.status || 'Not provided',
                "date": req.query.date
            },
            admin: req.session.username === "vany"
        });
    });

    // When requesting the report page
    app.get('/report', function (req, res) {
        res.render('report.html', {username: req.session.username || "Please login"});
    })

    // When requesting the login page
    app.get('/login', function (req, res) {
        res.render('login.html');
    })

    /**************** Post Requests ****************/

    // When submitting a report
    app.post('/report', function (req, res) {
        if (req.session.username) {                         // If he is logged in
            if (reporting(db_, req.body, date, req.session, incidents)) {
                res.render('index.html', {incidents: incidents, username: req.session.username});
            }
        } else {                                            // If he hasn't logged in
            res.render('login.html', {"msgLogin": "Please first login"});
        }
    });

    // When login in
    app.post('/login', function (req, res) {
        // db searching
        loggingIn(db_, req.body).then(r => {
            if (r.status) {                                  //Login passed
                req.session.username = req.body.username;
                res.render('index.html', {incidents: incidents, username: req.session.username});
            } else {                                             //Login failed
                res.render("login.html", {"msgLogin": r.msg, username: req.body.username});
            }
        });
    });

    // When signing up
    app.post('/sign', function (req, res) {
        // Check ups to ensure there's n't someone with the same username
        signingUp(db_, req.body).then(value => {
            if (value) {                                     //signup passed
                req.session.username = req.body.signUsername;
                res.render('index.html', {
                    username: req.session.username || "Please Login",
                    incidents: incidents
                });
            } else {                                         //signup failed
                res.render("login.html", {"msgSignUp": "Another user has the same username. Try a different using another."});
            }});
    });
});
app.use(express.static('static'));
app.listen(8080);
// https.createServer({
//     key         : fs.readFileSync('./ssl/key.pem','utf-8'),
//     cert        : fs.readFileSync('./ssl/cert.pem','utf-8'),
//     passphrase  : 'ndakwiyamye'
// }, app).listen(8080);

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
async function loggingIn(db, body){
    const result = await fetchFromDb(db, "users",{username: body.username}, false, true);
    if (result){
        if (result.password === body.password){
            this.status = true; this.msg = '';
            return this;
        }
        this.status = false; this.msg = "Password incorrect try again"
        return this;
    }
    this.status = false; this.msg = "No username with that name found";
    return this;
}

/*
    When signing somebody up

    db (Object)         : mongodb, db object.
    body(JSON)          : body of the request.
 */
async function signingUp(db, body){
    //Check if there's some on with the same username
    if(await fetchFromDb(db, 'users', body.username)){
        return false;
    }else{
        insertIntoDb(db, 'users',{username: body.signUsername,
            email: body.email, password: body.signPassword, name: body.signName});
        return true;
    }
}

/*
    When signing somebody up

    db (Object)         : mongodb, db object.
    body(JSON)          : body of the request.
 */
function reporting(db, body, date, session, incidents){
    const newInc = {"description": body.description, "user": session.username,
        "address": body.streetAddress + "," + body.postalCode + " " + body.region,
        "image": null, "status": "Ongoing", "date": date.toLocaleDateString()};
    insertIntoDb(db, newInc);
    incidents.push(newInc);
    return true;
}

/*
    Loads up the list of incidents
    db (Object)         : mongodb, db object.
 */
async function loadingIncidents(db){
    this.result = await fetchFromDb(db,"incidents",{},true);
    return this;
}