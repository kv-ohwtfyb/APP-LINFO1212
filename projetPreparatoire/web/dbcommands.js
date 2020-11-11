use projectdb;
db.incidents.insertOne({ 
    "description" : "File Created", 
    "user" : "loveisgood", 
    "address" : "45,6000 Chatêlet", 
    "image" : "../designs/Page d’accueil.png", 
    "status" : "Ongoing", 
    "date" : "11/08/2020" })
db.incidents.createIndex({ description : "text", address: "text", date: "text", user: "text"})
db.users.insert([ 
    {"username" : "loveisgood", "admin" : "jonathan", "email" : "mushipatrick99@gmail.com", "password" : "$2b$10$EiV9OoQljGrt8o3qsstmbetXeb4mbCYvpFmS46SkMwbKGTBIOR/p."}, 
    { "username" : "vany", "admin" : "vany", "email" : "ingenzivany@gmail.com", "password" : "$2b$10$yd3fD0CPeCSII7q1f1cnT.ClcDy4r22kgrNkLEPq4gbp6O0U4R3SC"}, 
    { "username" : "raïssa", "admin": "hirwa", "email" : "hirwa@gmail.com", "password" : "$2b$10$Mi3bIXhh8HjeP5NKCTthI.Y7Vglijl/i4q9DsXJYyDhiZeo9Zigli"} 
])
db.users.createIndex({ username : "text"})