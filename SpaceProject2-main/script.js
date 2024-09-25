//This script is for the sound effects of the buttons and the background music


function closeOverlay() {
document.getElementById('overlay').style.display = 'none';
console.log('overlay closed');
}
    let isRadioOn = false;
    var audio = document.getElementById('background-sound');
    audio.play();
    audio.volume = 0.05;
    const hoverSound = document.getElementById('hoverSound');
    const clickSound = document.getElementById('clickSound');
    const buttons = document.querySelectorAll('button, .Planet, .planet');
    const radioButton = document.getElementById('radio-button');
    
    radioSound.loop = true;
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            hoverSound.currentTime = 0; // Rewind to the start
            hoverSound.volume = 0.03;
            hoverSound.play(); 
        });
        button.addEventListener('click', () => {
            clickSound.currentTime = 0; // Rewind to the start
            clickSound.volume = 0.5;
            clickSound.play();
        });
    });
    document.addEventListener('DOMContentLoaded', () => {
        radioButton.addEventListener('click', () => {
            if(!isRadioOn){
                radioButton.classList.add('open')
                //radioSound.currentTime = 0; // Rewind to the start
                radioSound.volume = 0.5;
                radioSound.play();
                isRadioOn = true;
            } 
            else{
                radioButton.classList.remove('open')
                radioSound.pause();
                isRadioOn = false;
            } 
    });
    });
