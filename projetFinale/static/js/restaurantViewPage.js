$(document).ready(function () {

    const dialog = $("#popup_item");
    dialog.hide();
    $(".list-of-items > li").on('click', function () {
        dialog.show();
    });

    $("#close_popup").on('click', function () {
        dialog.hide();
    })

    $("class:has(div)").each(checkBoxLimit(1, document.getElementsByName('form')));

});

function checkBoxLimit(limit, checkBoxGroup ) {
    let checkedCount = 0;
    for (let i = 0; i < checkBoxGroup.length; i++) {
        checkBoxGroup[i].onclick = function() {
            for (let i = 0; i < checkBoxGroup.length; i++) {
                checkedCount += (checkBoxGroup[i].checked) ? 1 : 0;
            }
            if (checkedCount > limit) {
                alert("You can select maximum of " + limit + " checkboxes.");
                this.checked = false;
            }
        }
        checkedCount = 0;
    }
}

