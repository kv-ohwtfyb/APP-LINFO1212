/**
    Saves the encoded image to a model.
    @param model (mongoose Model)  : Any schema that has an image field like following :
                                        image : {
                                                data : Binary ,
                                                type : String
                                             }
    @param imgEncoded (String)     : encoded image by filepond from the web app
 */
function savingImage(model, imgEncoded) {
  if (imgEncoded == null) return;
  const img = JSON.parse(imgEncoded);
  if (img != null && ["image/jpeg", "image/png", "images/gif"].includes(img.type)) {
    model.image = {
                    data : new Buffer.from(img.data, "base64"),
                    type : img.type
                }
  }
}

/**
    Sets the virtual imgSrc which will be used in html as the src of the image.
    @param obj (Object) : An object that will be containing the imgSrc
 */
function setImageSrc(obj){
    if (obj.image != null){
        obj["imgSrc"] = `data:${obj.image.type};charset=utf-8;base64,${obj.image.data.toString('base64')}`;
    }else { obj["imgSrc"] = "" }
}