const { restaurantModel } = require('./../general/schemas');

/**
 * Deletes an Item whose name is equal to the name req.body
 * @param app
 * @param req
 * @param res
 */
function deleteAnItemFromARestaurant(app, req, res){
    restaurantModel.findById(req.session.restaurant._id).then((restaurant) => {
        restaurant.deleteItem({name : req.body.name})
            .then(() => {
                res.json({ status : true })
            })
            .catch((err) => {
                res.json({ status : false, msg : err.message });
            })
    })
}

exports.deleteItem = deleteAnItemFromARestaurant;