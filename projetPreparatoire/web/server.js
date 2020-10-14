const express = require('express');
const consolidate = require('consolidate');
const app = express ();

app.engine ('html', consolidate.hogan)
app.set('views', 'templates');

app.get('/', function(req,res) {
  res.render('index.html', {username:"Please login",
                                          incident:{"description":"There's some hoes in this house",
                                                    "address":"Bld Hoes 96, 9999 New York",
                                                    "person":"Raïssa Hirwa Mihigo",
                                                    "date":Date.now()}});
});

app.use(express.static('static'));
app.listen(8080);

