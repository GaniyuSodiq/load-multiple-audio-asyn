let audioContext;

const startCtxBtn = document.querySelector(".start")

// GETTING THE AUDIOCONTEXT AFTER THE USER INTERACTION - SO NO MORE SUPRISES
startCtxBtn.addEventListener("click", ()=>{
    audioContext = new AudioContext()
})