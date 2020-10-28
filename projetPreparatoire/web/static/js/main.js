$(document).ready(function (){
  // This contains all the Jquery methods

  /*
   * On the report page. This is the report HTML page.
   */
  if ($('#reportForm').length) {
    /*
     * This function is called when the report bodyForm is submitted.
     * It's main purpose is to check the inputs before being sent to the server.
     */
    $(".reportForm").on('submit',(function () {
      //Checks the description text area.

      if ($("#descriptionInput").val().length < 10 ){
        alert("Please write a comprehensive description ! Thank you.");
        return false;
      }
      // Checks the streetName
      if ($("#streetNameAndNumber").val().length < 10){
        alert("Please enter a valid street name and number if possible please.");
        return false;
      }
      // Check the postal code
      if ($("#postalCode").val().length < 4){
        alert("Please enter a valid postal code ! Thank you.");
        return false;
      }
      // Checks the region
      if ($("#regionInput").val().length < 3){
        alert("Please a valid Region Name ! Thank You.")
      }
      return true;
    }));
  }
  if ($('.report').length){
    $('.report').on('click', function () {
      window.open('/report?username='+$("#userName").html(),'_parent');
    })
  }
});

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
* The function checks the inputs of the LOGIN and SIGNUP form of the authentication
* page.*/
function loginFormChecker(){
  const message = document.querySelector('.msg');
  const username = document.forms["form"]["username"].value;
  const password = document.forms["form"]["password"].value;
  
  
  if(username == ""){

    alert("Please fill in your username. Thank You")
    return false;

  } 
  if (password === ""){

    message.innerHTML = "Fill in the password, Please.";
    setTimeout(() => message.remove(), 1000);
    return false;
  } 
}

function signFormChecker(){
  const message = document.querySelector('.msg1');
  const username = document.forms["form"]["signUsername"].value;
  const password = document.forms["form"]["signPassword"].value;
  const name = document.forms["form"]["signName"].value;
  let list = {};


  if(username == "" || password === "" || name == "" ){
    alert("Please fill in all fields. Thank You")
    return false;

  } else {
    list[$(username)] = $(password);
    return true;
  }
}

/*
* Previews an image of the when uploading an image on the report page.
* That way the user can see the image he ios going to upload.
 */
function previewImage(event){
  if(event.target.files.length > 0){
    const src = URL.createObjectURL(event.target.files[0]);
    const preview = document.getElementById("theImagePreviewer");
    preview.src = src;
    preview.style.display = "block";
  }
}