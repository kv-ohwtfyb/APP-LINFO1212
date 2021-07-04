$(document).ready(function () {
    $("label").html("Drag & Drop or Click to load your restaurant's display image.");
    $("#MyForm").submit((event)=>{
        $("#frontImage").appendTo("#MyForm");
    })
})
