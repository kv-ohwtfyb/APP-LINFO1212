/*
* Previews an image of the when uploading an image on the report page.
* That way the user can see the image he is going to upload.
 */

document.addEventListener('DOMContentLoaded', ()=>{
    FilePond.registerPlugin(FilePondPluginFileEncode,
                            FilePondPluginImagePreview,
                            FilePondPluginImageResize);
    FilePond.setOptions({
      stylePanelAspectRatio: 1,
      imageResizeTargetHeight: 200,
      imageResizeTargetWidth: 200,
    });
    FilePond.parse(document.body)
});