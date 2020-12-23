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

/**
 * This function deletes a group in a restaurant
 * @param app
 * @param req
 * @param res
 */

function deleteAGroupFromARestaurant(app, req, res){
    restaurantModel.findById(req.session.restaurant._id).then((restaurant) => {
        restaurant.removeGroup(req.body.name)
            .then(() => {
                res.json({ status : true })
            })
            .catch((err) => {
                res.json({ status : false, msg : err.message });
            })
    })
}

/**This function deletes a category in a restaurant
 *
 * @param app
 * @param req
 * @param res
 */
function deleteACategoryFromRestaurant(app, req, res){
    restaurantModel.findById(req.session.restaurant._id).then((restaurant) => {
        restaurant.removeCategory(req.body.name)
            .then(() => {
                res.json({ status : true })
            })
            .catch((err) => {
                res.json({ status : false, msg : err.message });
            })
    })
}

exports.deleteItem = deleteAnItemFromARestaurant;
exports.deleteGroup = deleteAGroupFromARestaurant;
exports.deleteCategory = deleteACategoryFromRestaurant;