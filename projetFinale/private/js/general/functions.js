const { restaurantModel, itemSchema } = require('./schemas');
const mongoose = require('mongoose');

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
    model.imageType = img.type
  }
}

/**
    Sets the virtual imgSrc which will be used in html as the src of the image.
    @param obj (Object) : An object that will be containing the imgSrc
 */
function setImageSrc(obj){
    if (obj.image != null){
        obj["imgSrc"] = `data:${obj.imageType};charset=utf-8;base64,${obj.image.toString('base64')}`;
    }else { obj["imgSrc"] = "" }
}

exports.savingImageToModel = savingImage;
exports.setVirtualImageSrc = setImageSrc;