let audioContext;

const startCtxBtn = document.querySelector(".start")

// GETTING THE AUDIOCONTEXT AFTER THE USER INTERACTION - SO NO MORE SUPRISES FROM THE BROWSER

startCtxBtn.addEventListener("click", ()=>{
    audioContext = new AudioContext()
    console.log("Audio Context started")
})

// IN ORDER TO PLAY ANYTHING, WE NEED THE AUDIO FILE(S)
// YOU CAN LOAD FILES INDIVIDUALLY OR HAVE AN ARRAY OF FILES
//
// IN THIS TUTORIAL, WE WILL USE BUILT IN FETCH API TO GET OUR FILES - USE D API ONA FUNCTION

// bcs fetch() api might take sm time we need to (a)wait for it - 
// but await doesnt come on its own, 
// it hase to be in async (more likely asyn fuctn y the functn has async). 
// the response of the fetch() api is stored in the const response
// the we turn the response into an array buffer - this requires sm await time too
// then we make an audio buffer from the array buffer - this allows us to play the audio
// lastly, we return the audioBuffer
async function getFile(filePath){
   const response = await fetch(filePath);
   const arrayBuffer = await response.arrayBuffer();
   const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
   return audioBuffer;
}

async function setupSample(paths) {
    console.log("setting up sample");
    const audioBuffers = [];

    for (const path of paths) {
        const sample = await getFile(path);
        audioBuffers.push(sample);
    }
    console.log("setting up done");
    return audioBuffers;
}