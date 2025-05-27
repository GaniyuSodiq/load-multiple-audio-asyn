let audioContext;
let samples;

const startCtxBtn = document.querySelector(".start")
const setupSamplesBtn = document.querySelector(".setup-samples")
const playSampleBtn = document.querySelector(".play-sample")

// GETTING THE AUDIOCONTEXT AFTER THE USER INTERACTION - SO NO MORE SUPRISES FROM THE BROWSER

const samplePaths = ["audios/now-paint-orange.mp3", "audios/now-paint-purple.mp3", "audios/this-is-white.mp3", "audios/this-is-yellow.mp3"]

startCtxBtn.addEventListener("click", () => {
    audioContext = new AudioContext()
    console.log("Audio Context started")
})


// BCS THE SETUPSAMPLES IS ASYNC FUNC, IT IS GOING TO RETURN A PROMISE 
// SO WE NEED TO USE .then
// THE PROMISE WILL CONTAIN A RESPONSE 
// THIS RESPONSE IS THE OUTCOME OF THE SETUPSAMPLES ASYNC FUNCTION - 
// in this case audioBuffers[]
// AND WHEN WE GET THE RESPONSE, WE WANT TO RUN A FUNCTION
// AND BCS WE WANT A GLOBAL ACCESS TO THIS RESPONSE -audioBuffers
// WE ARE GOING TO SET IT TO A VARIABLE WE DECLARED GLOBALLY- let samples
// the samples will comtain all the audio buffers
// NOW WE CAN PLAY THE AUDIO
// BUT WE NEED A WAY TO FIRE THE AUDIO FROM HERE -so we set up an eventlistener button click

setupSamplesBtn.addEventListener("click", ()=>{
    setupSamples(samplePaths).then((response) => {
        samples = response;
        console.log(samples)
        playSampleBtn.addEventListener("click", () => {
            const playing = playSample(samples[2], 0)
            console.log(playing)
            setTimeout(()=>{
                playing.stop()
            }, 3000)
        })
    })
})


// IN ORDER TO PLAY ANYTHING, WE NEED THE AUDIO FILE(S)
// YOU CAN LOAD FILES INDIVIDUALLY OR HAVE AN ARRAY OF FILES
//
// IN THIS TUTORIAL, WE WILL USE BUILT IN FETCH API TO GET OUR FILES - USE D API ON A FUNCTION

// bcs fetch() api might take sm time we need to (a)wait for it - 
// but await doesnt come on its own, 
// it hase to be in async (more likely asyn fuctn y the functn has async). 
// the response of the fetch() api is stored in the const response
// the we turn the response into an array buffer - this requires sm await time too
// then we make an audio buffer from the array buffer - this allows us to play the audio
// lastly, we return the audioBuffer
// https://web.dev/articles/webaudio-intro - for more understanding 

async function getFile(filePath) { // the actual audio file path
    const response = await fetch(filePath); // fetch download the file gradually bt js cant wait dos async is used - the response is coded 0s and 1s (binary)
    const arrayBuffer = await response.arrayBuffer(); // turn into arrayBuffer
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer); //decoded  
    return audioBuffer; // we are getting the decoded array buffer of each audio ie buffered audio from our server/where the file is located
}


// The synchronization process

// The setupSample function loops through the samplePaths array
// - picks each element of the array
// - run it through the getFile array which return the audio (audiobuffer)
// - stores each audio (audiobuffere) into audioBuffers array
// - and return the audiobuffers array

async function setupSamples(paths) {
    console.log("setting up sample");
    const audioBuffers = [];

    for (const path of paths) {
        const sample = await getFile(path); // bcs the getfile is async func, we need to await wherever it is used n await reside in asyn func
        audioBuffers.push(sample);
    }
    console.log("setting up done");
    return audioBuffers;
}


//  WE NEED A WAY TO PLAY THE SAMPLE

// audioBuffer is simply an audio from the audioBuffers array
// we need to have a source for the audio - 
// the source can have diferent nodes too - b4 we connect it to the destination
// we return the sample source because we want more control of the audio
// we want to manipulate more like pause, play etc

function playSample(audioBuffer, time){
    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.connect(audioContext.destination);
    sampleSource.start(time);
    return sampleSource
}