const { restaurantModel } = require('./../general/schemas');
const {  getItemSpecFromReqBody, getGroupSpecFromReqBody } = require('./../general/functions');

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

function updateGroup(app, req, res){
    restaurantModel.findById(req.session.restaurant._id).then((restaurant) => {
        const group = getGroupSpecFromReqBody(req.body);
        restaurant.updateGroup(req.body.name, group)
            .then(() => {
                res.json({ status : true });
            })
            .catch(async (err) => {
                const errorMessage = (err instanceof Object) ? err.message : err;
                res.json({ status : false, msg : errorMessage});
        });
    });
}

function updateCategory(app, req, res){
    restaurantModel.findById(req.session.restaurant._id).then((restaurant) => {
        restaurant.updateCategory("Drinks", { description : "Testing test." })
            .then(() =>{
                res.json({ status : true });
            })
            .catch((err) =>{
                const errorMessage = (err instanceof Object) ? err.message : err;
                res.json({ status : false, msg : errorMessage});
        })
    });
}

exports.updateItem = updateItem;
exports.updateGroup = updateGroup;
exports.updateCategory = updateCategory;