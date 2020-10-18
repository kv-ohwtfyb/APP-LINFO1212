window.onscroll = function () {headerChecker()} //Checks for the header display

/*
* This function checks if the header on the index page has to be
* displayed depending on the position of the scroll
* */
function headerChecker(){
  if (window.scrollY > 100){
    document.getElementById("headerOnHomePage").classList.add("seen");
  }else {
    document.getElementById("headerOnHomePage").classList.remove("seen");
  }
}

/*
* The function checks the inputs of the login form of the authentication
* page.*/
function loginFormChecker(){
  const username = document.forms["login"]["username"].value;
  const password = document.forms["login"]["password"].value;

  if (username === ""){
    alert("Please fill in your username. Thank you")
    return false;
  }

  if (password === ""){
    alert("Please fill in your password. Thank you")
    return false;
  }
}

/*
* Gets the position of the user*/
function getPosition(){

  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(successPosition, null,{enableHighAccuracy:true} )
  }else {
    console.warn("This browser doesn't support geolocation")
  }
}

/*
* If getting the position was successful we are going to display a map at the
* position. or show the coordinates*/
function successPosition(position) {
  showPositionOnAMap(position.coords.latitude, position.coords.longitude)
}

/*
* Loads up a map showing a marker at the position given in the
* parameters*/
function showPositionOnAMap(lat,log){
  mapboxgl.accessToken = 'pk.eyJ1IjoidmFyeW5jYW1sbyIsImEiOiJja2ZpYWd5cGswdDQ1MnFudjhocHA1bTVzIn0.-keMO_74HFJ2INvkbMqNpA';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [lat, log],
    zoom: 8
  });

  const marker = new mapboxgl.Marker()
      .setLngLat([lat,log])
      .addTo(map);
}

function previewImage(event){
  if(event.target.files.length > 0){
    const src = URL.createObjectURL(event.target.files[0]);
    const preview = document.getElementById("theImagePreviewer");
    preview.src = src;
    preview.style.display = "block";
  }
}