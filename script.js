
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/facejs/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/facejs/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/facejs/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/facejs/models')

]).then(startup);

function startup(){
navigator.mediaDevices.getUserMedia({

    video:{
        width:720,
        height:520
    },
})
.then(stream => {
    video.srcObject = stream;
})
.catch(console.error);

}

video.addEventListener('play',function(){

    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
 
    setInterval( async function(){
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks().withFaceExpressions().withAgeAndGender();
        const resizedDetections = faceapi.resizeResults(detections,displaySize)
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
        faceapi.draw.drawDetections(canvas,resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas,resizedDetections)
         const minProbability = 0.05
        faceapi.draw.drawFaceExpressions(canvas,resizedDetections,minProbability)
       //console.log(detections);
    },10);
    

});