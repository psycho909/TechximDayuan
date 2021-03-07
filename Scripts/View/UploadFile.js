$(document).ready(function () {
    $("#input-gly-1").fileinput({
        theme: "gly",
        language: "zh-TW",
        uploadUrl: "/TechximDayuan/FileConverter/UploadFiles",
        showUpload:true,
        previewFileType : ['.png'],
        hideThumbnailContent: true // hide image, pdf, text or other content in the thumbnail preview
    });
});