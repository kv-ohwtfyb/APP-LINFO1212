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
    const incidentsCollection = db_.collection("incidents");
    const usersCollection = db_.collection("users");
    const date = new Date();
    let incidents;
    // Loading the incidents
    incidentsCollection.find().toArray((err, doc) => {
        if (err) throw err;
        incidents = doc;
    })

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
                "description": req.query.description || 'Not provided',
                "address": req.query.address || 'Not provided',
                "user": req.query.user || 'Not provided',
                "status": req.query.status || 'Not provided',
                "date": req.query.date
            }
        });
    });

    // When requesting the report page
    app.get('/report', function (req, res) {
        res.render('report.html', {username: req.query.username || "Please login"});
    })

    // When requesting the login page
    app.get('/login', function (req, res) {
        res.render('login.html');
    })

    /**************** Post Requests ****************/

    // When submitting a report
    app.post('/report', function (req, res) {
        if (req.session.username) {                         // If he is logged in

            const newInc = {"description": req.body.description, "user": req.session.username,
                "address": req.body.streetAddress + "," + req.body.postalCode + " " + req.body.region, "image": null,
                "status": "Ongoing", "date": date.toLocaleDateString()};

            incidentsCollection.insertOne(newInc, function (err, reslt) {
                if (err) throw err;
                // Updates the incidents
                incidents.push(newInc);
                res.render('index.html', {incidents: incidents, username: req.session.username});
            })

        } else {                                            // If he hasn't logged in
            res.render('login.html',{"msgLogin":"Please first login"});
        }
    });

    // When login in
    app.post('/login', function (req, res) {
        // db searching
        usersCollection.findOne({username: req.body.username})
        .then(result => {
            if (result && result.password === req.body.password) {
                req.session.username = req.body.username;
                res.render('index.html', {incidents: incidents, username: req.session.username});
            } else {
                res.render("login.html",{"msgLogin":"Password Incorrect or Username not found"});
            }
        })
        .catch(err => {
            console.log(err);
            res.render("login.html",{"msgLogin":"User not found."});
        })
    })

    // When signing up
    app.post('/sign', function (req, res) {
        // Check ups to ensure there's n't someone with the same username
        usersCollection.findOne({username: req.body.signUsername})
        .then(result => {
            if (!result) {                          // Not other user with the same username
                usersCollection.insertOne({
                    username: req.body.signUsername,
                    email: req.body.email, password: req.body.signPassword,
                    name: req.body.signName
                })
                req.session.username = req.body.signUsername;
                res.render('index.html', {
                    username: req.session.username || "Please Login",
                    incidents: incidents
                });
            } else {                                // Another user with the same name
                res.render("login.html",{"msgSignUp":"Another user has the same username. Try a different using another."});
            }
        })
        .catch(error => {
            console.log(error);
        })
    });
});
app.use(express.static('static'));
app.listen(8080);
// https.createServer({
//     key         : fs.readFileSync('./ssl/key.pem','utf-8'),
//     cert        : fs.readFileSync('./ssl/cert.pem','utf-8'),
//     passphrase  : 'ndakwiyamye'
// }, app).listen(8080);