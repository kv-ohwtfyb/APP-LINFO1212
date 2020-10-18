const express = require('express');
const consolidate = require('consolidate');
const app = express ();

app.engine ('html', consolidate.hogan)
app.set('views', 'templates');

app.get('/', function(req,res) {
    res.render('index.html', {username: req.query.username || "Please login",
                                          incident:{"description":"There's some hoes in this house",
                                                    "address":"Bld Hoes 96, 9999 New York",
                                                    "person":"Raïssa Hirwa Mihigo",
                                                    "status":"En cours",
                                                    "date":Date.now()}});
});

app.get('/preview', function (req, res) {
    res.render('incidentPreview.html', {username: req.query.username || "Please login",
                                          incident:{"description":req.query.description || 'Not provided',
                                                    "address":req.query.address || 'Not provided',
                                                    "person":req.query.person || 'Not provided',
                                                    "status":req.query.status || 'Not provided',
                                                    "date":req.query.date}} || 'Not provided');

})

app.use(express.static('static'));
app.listen(8080);
