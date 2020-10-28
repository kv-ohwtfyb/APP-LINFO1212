const express = require('express');
     consolidate = require('consolidate');
     app = express ();
     bodyParser = require('body-parser');
     MongoClient = require('mongodb').MongoClient;
     //connectionString = "mongodb+srv://admin:admin@projetpreparatoire.66hzo.mongodb.net/projectdb?retryWrites=true&w=majority"
     Server = require('mongodb').Server;

app.engine('html', consolidate.hogan);
app.use(bodyParser.urlencoded({ extend:true }));
app.set('views', 'templates');

// MongoDb connection
MongoClient.connect('mongodb://localhost:27017',{ useUnifiedTopology: true } ,  (err, db) => {
    const db_ = db.db("projectdb");
    const incidentsCollection = db_.collection("incidents");

    /**************** Get Requests ****************/

    // When requesting the home page.
    app.get('/', function (req, res) {
        // Loading the incidents
        incidentsCollection.find().toArray((err, doc) => {
            if (err) throw err;
            res.render('index.html', {"incidents":doc, username: req.query.username || "Please login"});
        });
    });

    // When requesting the preview page
    app.get('/preview', function (req, res) {
        res.render('incidentPreview.html', {
            username: req.query.username || "Please login",
            incident: {
                "description":  req.query.description || 'Not provided',
                "address":      req.query.address     || 'Not provided',
                "person":       req.query.person      || 'Not provided',
                "status":       req.query.status      || 'Not provided',
                "date":         req.query.date
            }
        });
    });

    // When requesting the report page
    app.get('/report', function (req,res) {
        res.render('report.html', {username: req.query.username || "Please login"});
    })

    /**************** Post Requests ****************/

    // When submitting a report
    app.post('/report', function (req, res) {
        console.log(req.body);

        res.render('index.html', {username: req.query.username || "Please login"});

        // incidentsCollection.insertOne(req.body)
        //     .then(result => {console.log(result);
        //                     res.redirect('/');})
        //     .catch(err   =>{
        //         res.render("errorPage.html",{error: err});
        //                 });

    });
});

app.use(express.static('static'));
app.listen(8080);
