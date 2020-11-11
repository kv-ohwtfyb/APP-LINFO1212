use projectdb
db.incidents.insert([
    {"description" : "The public bin is overfilled.", "user" : "vany", "address" : "The street Name,1283 Province", "date" : "11/11/2020"}
{ "description" : "There's a riot I can't sleep", "user" : "anotherUser", "address" : "This streeet,2324 That Province", "date" : "11/11/2020"}])
db.incidents.createIndex({ description : "text", address: "text", date: "text", user: "text"})
db.users.insert([
    {"username" : "loveisgood", "admin" : "1", "email" : "mushipatrick99@gmail.com", "password" : "$2b$10$EiV9OoQljGrt8o3qsstmbetXeb4mbCYvpFmS46SkMwbKGTBIOR/p."},
    { "username" : "vany", "admin" : "1", "email" : "ingenzivany@gmail.com", "password" : "$2b$10$yd3fD0CPeCSII7q1f1cnT.ClcDy4r22kgrNkLEPq4gbp6O0U4R3SC"},
    { "username" : "raissa", "admin": "1", "email" : "hirwa@gmail.com", "password" : "$2b$10$Mi3bIXhh8HjeP5NKCTthI.Y7Vglijl/i4q9DsXJYyDhiZeo9Zigli"},
])
db.users.createIndex({ username : "text"})