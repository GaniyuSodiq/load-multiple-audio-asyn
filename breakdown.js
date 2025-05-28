let audioContext;
let samples;
let count = 0;

const startCtxBtn = document.querySelector(".start")
const setupSamplesBtn = document.querySelector(".setup-samples")
const playSampleBtn = document.querySelector(".play-sample")
const playNextBtn = document.querySelector(".play-next")
const stopPlayBtn = document.querySelector(".stop-play")

startCtxBtn.addEventListener("click", () => {
    audioContext = new AudioContext()
    console.log("Audio Context started")
})

const samplePaths = ["audios/now-paint-orange.mp3", "audios/now-paint-purple.mp3", "audios/this-is-white.mp3", "audios/this-is-yellow.mp3"]

setupSamplesBtn.addEventListener("click", () => {
    setupSamples(samplePaths).then((response) => {
        samples = response;
        console.log(samples)
        playSampleBtn.addEventListener("click", () => {
            const playing = playSample(samples[count], 0, 0.1)
            console.log(playing)
            // setTimeout(()=>{
            //     playing.stop()
            // }, 3000)
        })
    })
})

async function setupSamples(paths) {
    console.log("Getting the audios from server into buffer");
    const audioBuffers = [];

    for (const path of paths) {
        const sample = await getFile(path);
        audioBuffers.push(sample);
    }
    console.log("All audios gotten into buffer")

    return audioBuffers;
}

async function getFile(filePath) {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
}


function playSample(audioBuffer, time, volume) {
    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    sampleSource.connect(gainNode).connect(audioContext.destination);
    sampleSource.start(time);
    return sampleSource
}


playNextBtn.addEventListener("click", () => {
    const playing = playSample(samples[count], 0, 0.0)
    count++
    playSample(samples[count], 0, 0.7)
    console.log(playing)
})

stopPlayBtn.addEventListener("click", () => {
    stopSample(samples[count])
    console.log(playing)
})


function stopSample(audioBuffer) {
    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
    const gainNode = audioContext.createGain();
    sampleSource.connect(gainNode).connect(audioContext.destination);
    sampleSource.stop();
    return sampleSource
}