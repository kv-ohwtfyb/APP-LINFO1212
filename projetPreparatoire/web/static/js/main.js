$(document).ready(function (){
  // This contains all the Jquery methods

  /*
   * On the report page. This is the report HTML page.
   */
  if ($('#reportForm').length){
    /*
     * This function is called when the report bodyForm is submitted.
     * It's main purpose is to check the inputs before being sent to the server.
     */
    $(this).on('submit',(function () {
      //Checks the description text area.
      if ($("#descriptionInput").val().split(',') < 2 ){
        alert("Please write a comprehensive description (Ex : There's trash on the trash) ! Thank you.");
        return false; }
      // Checks the streetName
      if ($("#streetNameAndNumber").val().split(",") < 2){
        alert("Please enter a valid street name and number if possible please.");
        return false; }
      // Check the postal code
      if ($("#postalCode").val().length < 4){
        alert("Please enter a valid postal code ! Thank you.");
        return false; }
      // Checks the region
      if ($("#regionInput").val().length < 3){
        alert("Please a valid Region Name ! Thank You.");
        return false; }
      return true;
    }));
  }


  // If the report page clicked
  const buttonToReportPage = $('#toReportPage');
  if (buttonToReportPage.length){
    buttonToReportPage.on('click', function () {
      window.open('/report','_parent');});
  };
  //This is for the second report button
  const secondbuttonToReportPage = $('#toReportPage2');
  if (secondbuttonToReportPage.length){
    secondbuttonToReportPage.on('click', function () {
      window.open('/report','_parent');});
  };

  // Checks the header in the home page
  $(window).on('scroll', function () {
    const header = $('#headerOnHomePage');
    if (header.length) {
      if (window.scrollY > 100) {header.css('opacity', 1);}
      else {header.css('opacity', 0);}}
  });

  $('#tableOfIncidents').on('click', '.tableRow',function () {
    const row = $(this).closest("tr");
    const userDate = row.find('.userAndDate').text().slice(1,-2).split("\n");
    const data = {"description":row.find('.description').text(),
                  "address":    row.find('.address').text(),
                  "user":       userDate[0].trim(), "date":userDate[1].trim(),
                  }
    window.open('/preview?'+encodeQuery(data));
  });

  if($('#deleteButton').length) {
    $(this).on('click', function () {
      const data = { description : $('#description').text(), address: $('#address').text(),
         user : $('#user').text().trim(), date:$('#date').text().trim()};
      $.ajax('/deleteIncident',
          {method:'delete', data: data,
                  success: function (response) {
                    if (response.success) {window.open('/','_parent');}
                    else {alert("Couldn't delete the incident");}
                  }});

    })
  }

  const imageHolder = $('#theImagePreviewer')
  imageHolder.css("height", "90vh");

});



/*
* Previews an image of the when uploading an image on the report page.
* That way the user can see the image he is going to upload.
 */
function previewImage(event){
  if(event.target.files.length > 0){
    const src = URL.createObjectURL(event.target.files[0]);
    const preview = document.getElementById("theImagePreviewer");
    preview.src = src;
    preview.style.display = "block";
  }
}

function encodeQuery(data){
    let query = ""
    for (let d in data)
         query += encodeURIComponent(d) + '='
                  + encodeURIComponent(data[d]) + '&'
    return query.slice(0, -1)
}

document.addEventListener('DOMContentLoaded', ()=>{
    FilePond.registerPlugin(FilePondPluginFileEncode,
                            FilePondPluginImagePreview,
                            FilePondPluginImageResize);
    FilePond.setOptions({
      stylePanelAspectRatio: 4/5,
      imageResizeTargetHeight: 125,
      imageResizeTargetWidth: 100,
    });
    FilePond.parse(document.body)
});
