const { restaurantModel } = require('./../general/schemas');
const {  getItemSpecFromReqBody } = require('./../general/functions');

/**
 * Updates an Item in the restaurant
 * @param app
 * @param req
 * @param res
 */
function updateItem(app, req, res){
    restaurantModel.findById(req.session.restaurant._id).then((restaurant) => {
        const itemSpec = getItemSpecFromReqBody(req.body);
        restaurant.updateItem({name : itemSpec.name}, itemSpec)
            .then(() => {
                if (req.body.categories.length > 0 ) {
                        const categories = req.body.categories.split("|").slice(0,-1);
                        if (categories){
                            categories.forEach((name) =>{
                                restaurant.addItemToCategory(name, itemSpec.name);
                            })
                        }
                    }
                res.json({ status : true });
            })
            .catch((error) => {
                res.json({
                    status : false, msg : error.message
                        });
            })
    })
}

exports.updateItem = updateItem;