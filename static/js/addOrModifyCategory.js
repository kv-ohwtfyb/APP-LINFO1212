$(document).ready(function () {

    const form = $('#form'); form.validate();

    $('#deleteButton').on('click', () => {
        form.validate();
        deleteGroup(form);
    })

    $("#update-category").on('click', () =>{
        form.validate();
        sendPutRequest(form);
    })

})

function sendPutRequest(form){
    $.ajax('/category',
{ method: 'PUT',
         data : form.serializeArray(),
        success : handleAPIResponse,
    })
}

function deleteGroup(form) {
    $.ajax('/category',
{ method: 'DELETE',
         data : form.serializeArray(),
        success : handleAPIResponse,
    })
}

function handleAPIResponse(response) {
    if(response.status){
        window.open('/my_store','_parent')
    } else {
        alert(response.msg);
    }
}