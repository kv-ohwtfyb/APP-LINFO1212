$(document).ready(function () {
    const order_view = $(".order-view");
    $(".table-of-orders .order").on('click', function (event){
        clearOrderView();
        getOrderDetails(event);
        order_view.css("width", "420px");
    });

    $(".order-view .close").on('click', function () {
        clearOrderView();
        order_view.css("width", "0px");
    });

    $(".table-of-orders .doneBtn").on('click', (event)=> {
        const id = $(event.target).closest('tr').find('.id').text();
        doneRequest(id);
    })

    $(".table-of-orders .cancelBtn").on('click', (event)=> {
        const id = $(event.target).closest('tr').find('.id').text();
        cancelRequest(id);
    })
})

function getOrderDetails(event){
    const id = $(event.target).closest('tr').find('.id').text();
    $.ajax('/getOrderDetails',
        {
                    method : 'GET',
                    data : { orderId : id },
                    success : handleDetailsAPIRequest
                }
        )
}

function handleDetailsAPIRequest(response) {
    if (response.status) loadTheOrderView(response.data);
    else alert(response.msg)
}

function loadTheOrderView(data){

    const template = $('.order-view');
    template.find("p").text(`Order ${data._id}`);
    const list = `<ul></ul>`
    template.append(list);
    let totalItems = 0;
    console.log(data)
    data.restaurants.items.forEach((item) => {
        totalItems+= item.quantity;
        let itemHTML = `<li>
            <h3 class="text-align-left">${item.quantity} | ${item.name}</h3>
            <hr class="bg-color-black">
        `
        let itemGroupSetsHTML = "<ul>";
        item.groupSets.forEach((group) => {
            group.selected.forEach((selectedItem) => {
                itemGroupSetsHTML += `
                    <li>
                        ${group.name} | ${selectedItem}
                    </li>
                    `
            })
        })
        itemGroupSetsHTML+="</ul>";
        itemHTML += "</li>";
        $('.order-view ul').append(itemHTML);
    })

    let bottomDiv = `<div class="bottom-of-container">`;
        bottomDiv+=
            `
                <div class="total bg-color-black"><p>${totalItems}</p><p>Total</p><p>${data.restaurants.total}€</p></div>
            `
    template.append(bottomDiv);
}

function clearOrderView(){
    $('.order-view .bottom-of-container').remove();
    $('.order-view ul').remove();
}

function doneRequest(id) {
    $.ajax('/confirmOrder',
{
            method: 'POST',
            data: { orderId: id },
            success : handleDoneOrderRequest
        }
    )
}

function cancelRequest(id) {
    $.ajax('/cancelOrder',
{
            method: 'POST',
            data: { orderId: id },
            success : handleDoneOrderRequest
        }
    )
}

function handleDoneOrderRequest(response) {
    if (response) window.open(window.location.href, '_parent');
    else alert(response.msg);
}