// variables for stream
let camera_stream = null;
let media_recorder = null;
var streaming = false;
let blobs_recorded = [];

// variables for download links
let download_photo = document.querySelector("#download-photo");
let download_video = document.querySelector("#download-video");

//variable for all browsers testing
let browsersMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia || navigator.mediaDevices.msGetUserMedia;

// function open camera to take pickture
function webcamPhoto(widthVid, heightVid) {
    try {
        browsersMedia;
    } catch (e) {
        window.alert('Your browser does not support WebVideo, try Google Chrome');
    }
    if (browsersMedia) {
        navigator.mediaDevices.getUserMedia({
                video: {
                    width: widthVid,
                    height: heightVid
                },
                audio: false
            }).then(function(camera_stream) {
                window.localStream = camera_stream;
                video.srcObject = camera_stream;
                video.play();
            })
            .catch(function(err) {
                console.log("An error occurred: " + err);
            });
    }
}

// function take pickture
function takepicture(widthVid, heightVid) {
    var context = canvas.getContext('2d');
    if (widthVid && heightVid) {
        canvas.width = widthVid;
        canvas.height = heightVid;
        context.drawImage(video, 0, 0, widthVid, heightVid);

        var dataph1 = canvas.toDataURL('image/jpeg');
        download_photo.href = dataph1;
        photo.setAttribute('src', dataph1);
        hidImg = dataph1;
    }
}

// function open camera to record video
function webcamVideo(widthVid, heightVid) {
    try {
        browsersMedia;
    } catch (e) {
        window.alert('Your browser does not support WebVideo, try Google Chrome');
    }
    if (browsersMedia) {
        camera_stream = navigator.mediaDevices.getUserMedia({
                video: {
                    width: widthVid,
                    height: heightVid
                },
                audio: true
            }).then(function(camera_stream) {
                window.localStream = camera_stream;
                video.srcObject = camera_stream;
                video.muted = true; //mute because the microphone has distortion issues
                video.play();
            })
            .catch(function(err) {
                console.log("An error occurred: " + err);
            });
    }
}

// function start recording video
function startRec() {
    // set MediaRecorder from video
    media_recorder = new MediaRecorder(video.srcObject);

    // event : new recorded video blob available 
    media_recorder.addEventListener('dataavailable', function(e) {
        blobs_recorded.push(e.data);
    });

    // event : recording stopped & all blobs sent
    media_recorder.addEventListener('stop', function() {
        let recordedBlob = new Blob(blobs_recorded, {
            mimeType: "video/mp4"
        });

        // reader for encode base64
        var reader = new FileReader()
        reader.readAsDataURL(recordedBlob)
        reader.onload = () => {
            console.log('file to base64 result:' + reader.result)
            hidn = reader.result;
        }
        reader.onerror = function(error) {
            console.log('Error: ', error)
        }

        // create local object URL from the recorded video blobs
        let video_local = URL.createObjectURL(recordedBlob);
        recording.src = video_local;
        download_video.href = video_local;
    });

    // start recording with each recorded blob having 10 second video
    media_recorder.start();
    if (media_recorder == null) {
        alert("Video is empty");
    } else {
        setTimeout(function() {
            media_recorder.stop();
            vidOff();
            alert("Video is stop");

        }, 6000);
    }
}


// function close camera off picture stream
function imgOff() {
    localStream.getVideoTracks()[0].stop();
}

// function close camera off video stream
function vidOff() {
    window.localStream.getVideoTracks()[0].stop();
    window.localStream.getAudioTracks()[0].stop();
}