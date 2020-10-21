const express = require('express');
     consolidate = require('consolidate');
     app = express ();
     MongoClient = require('mongodb').MongoClient;
     Server = require('mongodb').Server;


app.engine ('html', consolidate.hogan)
app.set('views', 'templates');

// MongoDb connection
MongoClient.connect('mongodb://localhost:27017',{ useUnifiedTopology: true }, (err, db) => {
    const db_ = db.db("projectdb"); //Loading the db

    // When requesting the home page.
    app.get('/', function (req, res) {
        // Loading the incidents
        // Doc is the result.
        db_.collection('incidents').find({}).toArray((err, doc) => {
                if (err) throw err;
                res.render('index.html', {"incidents":doc});
        });
    });

    // The preview page
    app.get('/preview', function (req, res) {
        res.render('incidentPreview.html', {
            username: req.query.username || "Please login",
            incident: {
                "description":  req.query.description || 'Not provided',
                "address":      req.query.address || 'Not provided',
                "person":       req.query.person || 'Not provided',
                "status":       req.query.status || 'Not provided',
                "date":         req.query.date
            }
        });
    });

    //If the user enters other requests
    app.get('*',(req, res) => {
        res.render('errorPage.html',{error:err ||"Sorry ! page not found"});
    })
});
app.use(express.static('static'));
app.listen(8080);
