const { restaurantModel, itemSchema } = require('./schemas');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const limmitter  = require('express-rate-limit');


/**
 * Limit pages requests
 */
function limittingPages(numOfLoading, returnMessage) {
    return limmitter({
        windowMs : 1 * 60 * 60 * 1000, //For 1 hour
        max : numOfLoading, //number of times the user can request(or go on) the same page.
        message : returnMessage
    });
}




/**
    Saves the encoded image to a model. The schema must have an image key that takes a
    nested document structured as follow :

    @param model (mongoose Model)  : Any schema that has an image field like following :
                                        image : {
                                                    data : Buffer,
                                                    type : <ImageType> (String)
                                                }
    @param imgEncoded (Object)     : encoded image by filepond from the web app.
 */
function savingImage(model, imgEncoded) {
    if (imgEncoded == null) return;
    const img = JSON.parse(imgEncoded);
    if (img != null && ["image/jpeg", "image/png", "images/gif", "image/jpg"].includes(img.type)) {
        model.image = new Buffer.from(img.data, "base64");
        model.imageType = img.type;
    }
}

/**
    Sets the virtual imgSrc which will be used in html as the src of the image.
    @param obj (Object) : An object that will be containing the imgSrc
 */
function setImageSrc(obj){
    if (obj.image){
        obj["imgSrc"] = `data:${obj.imageType};charset=utf-8;base64,${obj.image.toString('base64')}`;
    }else { obj["imgSrc"] = "";}
}


/*
    Return a the text in lowerCase and remove all the blank spaces.
    text (String ) : the text to format.
 */
function formatText(text) {
    return formatRemoveWhiteSpaces(text).toLowerCase();
}


/**
 * Returns a tring with all white spaces removed.
 * @param string
 * @return {string}
 */
function formatRemoveWhiteSpaces(string) {
    return string.trim().replace(/\s/g, "");
}

/**
 * Checks if a hashed string content is equal to a string
 * @param hashedString
 * @param string
 * @return Promise<Boolean>
 */
async function compareHashStringToARegularString(string, hashedString){
    return await bcrypt.compare(string, hashedString).then((result) => {
        return result;
    });
}

/**
 * Returns the 1st element in the array that when passed to the predicate the, predicate result
 * is true.
 * @param array []
 * @param predicate Promise<Boolean>
 * @return Object
 */
async function findInAnArrayWithASyncPredicate(array, predicate){
    for (let i = 0; i < array.length; i++) {
        if (await predicate(array[i])){
            return array[i]
        }
    }
    return null;
}

function itemAddOrUpdateBodyParser(reqBody){
    const toReturn = Object.assign({},reqBody);
    toReturn.soldAlone = toReturn.soldAlone === 'on';
    if (reqBody.image) { savingImage(toReturn, reqBody.image);}
    else                { delete toReturn.image; }
    if (reqBody.groups.trim().length > 0 ) toReturn.groups = toReturn.groups.split("|").slice(0,-1);
    else toReturn.groups = [];
    delete toReturn.categories;
    return toReturn
}

function groupAddOrUpdateBodyParser(reqBody){
    const toReturn = Object.assign({}, reqBody);
    toReturn.minSelection = parseInt(toReturn.minSelection);
    toReturn.maxSelection = parseInt(toReturn.maxSelection);
    toReturn.items = JSON.parse(toReturn.items);
    toReturn.items = toReturn.items.map((item) =>{
        item = JSON.parse(item);
        item.charge = (item.charge !== null) ? parseFloat(item.charge) : 0;
        return item;
    })
    return toReturn;
}

exports.loginLimitter = limittingPages;
exports.savingImageToModel = savingImage;
exports.setVirtualImageSrc = setImageSrc;
exports.formatText = formatText;
exports.formatRemoveWhiteSpaces = formatRemoveWhiteSpaces;
exports.hashComparing = compareHashStringToARegularString;
exports.findWithPromise = findInAnArrayWithASyncPredicate;
exports.getItemSpecFromReqBody = itemAddOrUpdateBodyParser;
exports.getGroupSpecFromReqBody = groupAddOrUpdateBodyParser;