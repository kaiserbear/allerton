// Preview Image For Image Upload

const upload = document.getElementsByClassName("image-upload");

if (upload.length) {
    var i;

    for (i = 0; i < upload.length; i++) {
        var eachUpload = upload[i];
        var input = eachUpload.getElementsByClassName('form-control')[0];
        var progress = eachUpload.getElementsByClassName('custom-progress')[0];
        getImageUpload(eachUpload, input, progress);
    }
}


function getImageUpload(eachUpload, input, progress) {
    if (input) {
        input.onchange = () => {
            var files = input.files;
            var file = files[0];
            if (file == null) {
                return alert('No file selected.');
                previewImage.style.display = "none";
            }
            getSignedRequest(eachUpload, file, progress);
        };
    }
}

function getSignedRequest(eachUpload, file, progress) {
    var fileName = file.name.replace(/[/\\?%*:|"<>^ ]/g, '-');
    var dir = location.pathname.split('/')[1];
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/' + dir + '/sign-s3?file-name=' + fileName + '&file-type=' + file.type );
    // xhr.open('GET', dir + `sign-s3?file-name=${fileName}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                uploadFile(eachUpload, file, response.signedRequest, response.url, progress);
            } else {
                alert('Could not get signed URL.');
            }
        }
    };
    xhr.send();
}

function uploadFile(eachUpload, file, signedRequest, url, progress) {

    // AJAX
    var xhr = new XMLHttpRequest();

    xhr.open('PUT', signedRequest);

    xhr.upload.onprogress = function(e) {
        progress.style.display = "block";
        if (e.lengthComputable) {
            progress.max = e.total;
            progress.value = e.loaded;
        }
    }
    xhr.upload.onloadstart = function(e) {
        progress.value = 0;
    }
    xhr.upload.onloadend = function(e) {
        progress.value = e.loaded;
    }
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var previewImage = eachUpload.getElementsByClassName("preview-image");
                progress.style.display = "none";
                if (previewImage[0]) {
                	previewImage[0].src = url;
                }
                else {
                    var newPreviewImage = document.createElement("IMG");
                    newPreviewImage.className = "preview-image";
                    progress.style.display = "none";
                	newPreviewImage.src = url;
                	eachUpload.appendChild(newPreviewImage);
                }
            }
            else {
                console.log('Could not upload file.');
            }
        }
    };
    xhr.send(file);
}

// Text Editor

froalaEditorStandardButtons = [
          'bold'
        , 'italic'
        , 'underline'
        , 'strikeThrough'
        , 'quote'
        , 'insertLink'
        , 'clearFormatting'
        , '-'
        , 'paragraphFormat'
        , 'formatOL'
        , 'formatUL'
        , 'align'
        , 'indent'
        , 'outdent',
        'insertHR', 'selectAll', 'clearFormatting', '|',  'html', '|', 'undo', 'redo'
    ]

// Initiate Froala Editor
$(function() {
    if ($('.froala').length) {
        $('.froala').froalaEditor({
            toolbarButtons: froalaEditorStandardButtons,
            quickInsertTags: [''],
            key: '7E4C3B3E3cA5A4B3F2E4C2B2E3C1A2vxC-11hh1lucapA-13abA1tvtC-21ss=='
        });
    }
});