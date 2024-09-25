import gameData from './jsons/gameData.json' with{type: 'json'}

import { chosenPlanets, logs, allPlanets, RandomElement } from './globals.js';
let oneDayInMS = 120000; //2 minutes
let o2 = 100
let days = 10
let i = 0;
let speed = 15;
let start = false;
let currentPlanet;
let isOpenLeft = false;
let isOpenRight = false;
let IsSuccessful = (successChance) => (Math.random() * 100 <= successChance); //returns bool if successfull
let isTyping;
let introDone = false;
let cancelCurrentTest = false;
let score = 0;
let correctSubmission = []

let test1Active = false;
let test2Active = false;
let test3Active = false;
let test4Active = false;
////////inventory///////////
let maxProbes = [3, 3, 1] //standard - high - deep
let maxRadar = [5, 2] //lowF - highF
let maxScan = [5, 3, 1] //1hr - 3hr - 6hr
let luckChance = 60
document.getElementById('next').addEventListener('click', async function() {
    let OPstarting = "Let's start with the tests below and see what we have."
    let ASTROstarting = "Awaiting the commands..."
    await delay(1000);
    return new Promise((resolve) => { // Return a promise
        typeWriter(OPstarting, 'OPtext')
        .then(async () => {
            await delay(1000); // Add delay between typeWriter functions
            await typeWriter(ASTROstarting, 'ASTROtext');
            introDone = true;
            resolve();
        });
    });
});
UpdateInventory();
const typingSound = document.getElementById('typingSound');
console.log(chosenPlanets)
function calcScore(){
    for(let i = 0; i < 5; i++){
        if(document.getElementById(`planets${i+1}`).value === chosenPlanets[i].name){
            console.log('correct +1 score')
            correctSubmission[i] = true;
            score++ 
        } 
        console.log(document.getElementById(`planets${i+1}`))
    }
    console.log(score)
    
    if(score > 3){
        document.getElementById('victory-state').innerHTML = 'VICTORY';
    }else if(score === 2){ 
        document.getElementById('victory-state').innerHTML = 'BETTER LUCK NEXT TIME';
    }else if(score < 2){
        document.getElementById('victory-state').innerHTML = 'DEFEAT';
    }
}

function ConfirmMenu(){
    document.getElementById('overlay').style.display = 'flex';
    document.getElementById('confirm').style.display = 'flex';
}
function VictoryMenu(){ 
    calcScore();
    document.getElementById('confirm').style.display = 'none';
    document.getElementById('overlay').style.display = 'flex';
    document.getElementById('victory').classList.add('open');
    document.getElementById('score').innerHTML = score;
    const victoryStat = document.getElementById('victory-stat');
    chosenPlanets.forEach((planet, i) => {
        const planetElement = document.createElement('div');
        planetElement.innerHTML = `Planet${i + 1}: ${planet.name}`;
        if (!correctSubmission[i]) {
            planetElement.style.color = '#c40d0d';
        }
        victoryStat.appendChild(planetElement);
    });
}

document.querySelectorAll('.Planet select').forEach(select => {
    allPlanets.forEach(planet => {
        const option = document.createElement('option');
        option.value = planet; // Assuming planet is a string
        option.textContent = planet; // Use textContent to safely add text
        select.appendChild(option); // Add the option to the select element
    });
    select.addEventListener('change', (e) => {
        select.value = (e.target.value);
        select.defaultValue = allPlanets[0];
        console.log(select.defaultValue);
    });
});

function cluesGenerator(cluesCount) {
    const clues = currentPlanet.clues;
    const generatedClues = [];
    for (let i = 0; i < cluesCount; i++) {
        const randomClue = RandomElement(clues);
        generatedClues.push(randomClue);
        clues.splice(clues.indexOf(randomClue), 1); // Remove the clue to avoid duplicates
    }
    return generatedClues;
}
function test1(sliderInput){
    test1Active = true;
    console.log(`test 1 triggered: ${sliderInput}`)
    let diff = Math.abs(currentPlanet.attributes.Wavelength - sliderInput)
    console.log(diff)
    let cluesCount = 0;
    
    if (diff === 0){
        console.log('Perfect wavelength')
        cluesCount++;
        console.log('cluesCount: ' + cluesCount)
        test1Active = false;
        return (RandomElement(gameData.tests['test1']["success"]) + "\nGases present: " + RandomElement(currentPlanet.attributes["Gases Present"]));
    } else if (diff === 5){
        console.log('Very close')
        test1Active = false;
        return (RandomElement(gameData.tests['test1']["close"]));
    } else if (diff > 5){
        console.log('Way off')
        test1Active = false;
        return (RandomElement(gameData.tests['test1']["failure"]));
    }
}
function test2(chosenProbe) {
    test2Active = true;
    let bestProbe = currentPlanet.attributes.Probe;
    if (maxProbes[0] === 0 && chosenProbe === "Standard"){
        test2Active = false;
        return RandomElement(gameData.tests.test2["out-standard"])
    }
    else if (maxProbes[1] === 0 && chosenProbe === "High"){
        test2Active = false;
        return RandomElement(gameData.tests.test2["out-high"])
    }
    else if (maxProbes[2] === 0 && chosenProbe === "Deep"){
        test2Active = false;
        return RandomElement(gameData.tests.test2["out-deep"])
    }
    else {
        if (chosenProbe === "Deep"){
            if (currentPlanet.attributes.Surface){
                maxProbes[2]--;
                UpdateInventory();
                test2Active = false;
                return RandomElement(gameData.tests.test2["success-deep"]) + "\nTemperature: " + RandomElement(currentPlanet.attributes.temperature) + " °K"
            }
            
            else{
                test1Active = false;
                return RandomElement(gameData.tests.test2["failure-deep"])
            } 
        }
        else if (bestProbe === chosenProbe){
            if (chosenProbe === "Standard"){
                maxProbes[0]--;
                UpdateInventory();
                test2Active = false;
                return RandomElement(gameData.tests.test2["success-standard"]) + "\nTemperature: " + RandomElement(currentPlanet.attributes.temperature) + " °K"
                //display temp
            }
            else if (chosenProbe === "High"){
                maxProbes[1]--;
                UpdateInventory();
                test2Active = false;
                return RandomElement(gameData.tests.test2["success-high"]) + "\nTemperature: " + RandomElement(currentPlanet.attributes.temperature) + " °K"
                //display temp
            }
        }
        else {
            if (chosenProbe === "Standard"){
                test2Active = false;
                return RandomElement(gameData.tests.test2["failure-standard"])
            }
            else if (chosenProbe === "High"){
                test2Active = false;
                return RandomElement(gameData.tests.test2["failure-high"])
            }
        }
    }
}

function test3(freq) {
    test3Active = true;
    console.log(freq + "TEST 3")
    if (maxRadar[0] === 0 && freq === "low"){ //if ran out
        test3Active = false;
        return RandomElement(gameData.tests.test3["failure-LowOut"])
    }
    else if (maxRadar[1] === 0 && freq === "high"){
        test3Active = false;
        return RandomElement(gameData.tests.test3["failure-HighOut"])
    }
    else {
        if (freq === "low"){
            maxRadar[0]--;
            UpdateInventory();
            test3Active = false;
            return (RandomElement(gameData.tests.test3["success-LowF"]), RandomElement(currentPlanet.attributes.Dialogue3))
        }
        else if (freq === "high"){
            let result = RandomElement(gameData.tests.test3["success-HighF"])
            currentPlanet.attributes.Dialogue3.forEach(element => {
                result += element
            });
            maxRadar[1]--;
            UpdateInventory();
            test3Active = false;
            return result
        }
    }
}

function test4(time) {
    test4Active = true;
    if (maxScan[time] == 0){
        if (time == 0){
            test4Active = false;
            return RandomElement(gameData.tests.test4["out-1hr"])
        }
        else if (time == 1){
            test4Active = false;
            return RandomElement(gameData.tests.test4["out-3hr"])
        }
        else if (time == 2){
            test4Active = false;
            return RandomElement(gameData.tests.test4["out-6hr"])
        }
    }
    else{
        luckChance = 90
        if (Math.random() * 100 <= luckChance){
            if (time == 0){
                let r = Math.floor(Math.random() * arr.length)
                maxScan[0]--;
                UpdateInventory();
                test4Active = false;
                return (RandomElement(gameData.tests.test4["success-1hr"]) + "\n" + currentPlanet.attributes.Dialogue4[r])
                //choose 1 random
            }
            else if (time == 1){
                let r = Math.floor(Math.random() * arr.length)
                maxScan[1]--;
                UpdateInventory();
                let result = RandomElement(gameData.tests.test4["success-3hr"]) + "\n" + currentPlanet.attributes.Dialogue4[r]
                let deleted = currentPlanet.attributes.Dialogue4.splice(r,1)
                r = Math.floor(Math.random() * arr.length)
                result += currentPlanet.attributes.Dialogue4[r]
                currentPlanet.attributes.Dialogue4.push(deleted)
                test4Active = false;
                return result
                //choose 2 random
            }
            else if (time == 2){
                maxScan[2]--;
                UpdateInventory();
                test4Active = false;
                return (RandomElement(gameData.tests.test4["success-6hr"]) + "\n" + currentPlanet.attributes.Dialogue4[0] + currentPlanet.attributes.Dialogue4[1] + currentPlanet.attributes.Dialogue4[2])
                //display all
            }
        }
        else {
            test4Active = false;
            return RandomElement(gameData.tests.test4["failure"])
            //display none
        }
    }
}
function UpdateInventory(){
    document.getElementById('sProbeCount').innerHTML = maxProbes[0];
    document.getElementById('hProbeCount').innerHTML = maxProbes[1];
    document.getElementById('dProbeCount').innerHTML = maxProbes[2];
    ///////////////////////////////////////
    document.getElementById('lowRadar').innerHTML = maxRadar[0];
    document.getElementById('highRadar').innerHTML = maxRadar[1];
    ///////////////////////////////////////
    document.getElementById('1hr').innerHTML = maxScan[0];
    document.getElementById('3hr').innerHTML = maxScan[1];
    document.getElementById('6hr').innerHTML = maxScan[2];
}
// export function RandomElement(arr) {
//     return arr[Math.floor(Math.random() * arr.length)]
// } //generates a random element (index) from an array

function Log(){     
    if (!isTyping && introDone) { //if not typing, log the planet
        logs.push(`- [${currentPlanet.id}] ` + document.getElementById('ASTROtext').innerHTML)
        console.log(currentPlanet)
    }
}
function ReadLog(){
    console.log('PLANET DISCOVERY LOGS: \n')
    logs.forEach(log => console.log(log))
    if(isOpenLeft){ //if dialogue is open, close it and display logs
        document.getElementById('mainS').classList.remove('open');
        document.getElementById('log-button').classList.remove('clicked-log');
    }
    else if(!isOpenLeft){ //if dialogue is closed, open it and hide logs
        document.getElementById('mainS').classList.add('open');
        document.getElementById('log-button').classList.add('clicked-log');
        document.getElementsByClassName('Logs')[0].innerHTML = "PLANET DISCOVERY LOGS:<br><br><br>" + logs.join('<br><hr>')
    }
    isOpenLeft = !isOpenLeft
}
function SubmitMenu(){
    if(isOpenRight){ //if menu is open close it
        document.getElementById('inventory').style.display = 'flex';
        document.getElementById('planetSubmit').classList.remove('open');
        document.getElementById('submit-menu').classList.remove('clicked-submit-menu');
    }
    else if(!isOpenRight){ //if menu is closed open it
        document.getElementById('inventory').style.display = 'none';
        document.getElementById('planetSubmit').classList.add('open');
        document.getElementById('submit-menu').classList.add('clicked-submit-menu');
        // document.getElementsByClassName('Logs')[0].innerHTML = "PLANET DISCOVERY LOGS:<br><br><br>" + logs.join('<br><hr>')
    }
    isOpenRight = !isOpenRight
}
function hideResponses(){
    document.getElementsByClassName('responses-container')[0].style.display = 'none';
}
function showResponses(){
    document.getElementsByClassName('responses-container')[0].style.display = 'grid';
}
function showTest(testType){
    document.getElementById(testType).style.display = 'flex';
}
function hideTest(testType){
    document.getElementById(testType).style.display = 'none';
}

export function typeWriter(text, divId) {
    isTyping = true;
    return new Promise((resolve) => { // Return a promise
        let i = 0;
        document.getElementById(divId).innerHTML = ' ';
        function type() {
            if (i < text.length) {
                document.getElementById(divId).innerHTML += text.charAt(i);
                typingSound.volume = 0.1;
                typingSound.play();
                i++;
                setTimeout(type, speed); // Call recursively until finished
            } else {
                typingSound.pause();
                typingSound.currentTime = 0; // Reset audio to the start
                isTyping = false
                resolve(); // Resolve the promise when done typing
            }
        }
        type();
    });
}
function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
function generateText(testType){
    if(!isTyping){
        // const command = RandomElement(gameData.tests[testType].command); // gets a random command from the array of commands
        
        // const didSucceed = IsSuccessful(80) ? 'success' : 'failure'; // determines if test was successful
        // console.log(didSucceed);
        // const result = RandomElement(gameData.tests[testType][didSucceed]); // gets a random response from the array of results
        
        // document.getElementById('OPtext').innerHTML = ' ';
        // document.getElementById('ASTROtext').innerHTML = ' ';

    }
}
function activateTest(testType) {
    if(introDone){
        console.log("BUTTON CLICKED with test type: " + testType);
        hideResponses();
        showTest(testType);
        if (!isTyping) {
            const command = RandomElement(gameData.tests[testType].command); // gets a random command from the array of commands
            
            // First type the OP text, then type the ASTRO text
            typeWriter(command, 'OPtext')
                .then(() => {
                    // Return a new Promise that resolves when the submit button is clicked
                    return new Promise(resolve => {
                        const submitButton = document.getElementById('submit-button'); //TEST1 BUTTON

                        document.getElementById('back-button1').addEventListener('click', () => {cancelCurrentTest = true})
                        document.getElementById('back-button2').addEventListener('click', () => {cancelCurrentTest = true})
                        document.getElementById('back-button3').addEventListener('click', () => {cancelCurrentTest = true})
                        document.getElementById('back-button4').addEventListener('click', () => {cancelCurrentTest = true})
                        console.log(cancelCurrentTest + "cancel current")
                        const handleClick = (event) => {
                            if (cancelCurrentTest) {
                                cancelCurrentTest = false;
                                resolve();
                                return;
                            }
                            if(!isTyping){
                                console.log(event.target.name)
                                const sliderValue = document.getElementById('slider').value;
                                let testResult;
                                if(testType === 'test1'){
                                    testResult = test1(sliderValue);
                                }
                                if(testType === 'test2'){
                                    testResult = test2(event.target.name);
                                }
                                if(testType === 'test3'){
                                    testResult = test3(event.target.name);
                                }
                                if(testType === 'test4'){
                                    testResult = test4(event.target.value);
                                }
                                typeWriter(testResult, 'ASTROtext').then(() => {
                                    resolve();
                            });}
                        };
                        ///TEST 1 BUTTONS///
                        submitButton.addEventListener('click', handleClick);
                        ///TEST 2 BUTTONS///
                        document.getElementById('probe-button1').addEventListener('click', handleClick);
                        document.getElementById('probe-button2').addEventListener('click', handleClick);
                        document.getElementById('probe-button3').addEventListener('click', handleClick);
                        ///TEST 3 BUTTONS///
                        document.getElementById('radar-button1').addEventListener('click', handleClick);
                        document.getElementById('radar-button2').addEventListener('click', handleClick);
                        ///TEST 4 BUTTONS///
                        document.getElementById('scan-button1').addEventListener('click', handleClick);
                        document.getElementById('scan-button2').addEventListener('click', handleClick);
                        document.getElementById('scan-button3').addEventListener('click', handleClick);
                    });
                });
        }
    }
}
function SwitchPlanet(planet){ //called from html button
    currentPlanet = planet // <-- dy tmam
    console.log(currentPlanet.name)
} 

chosenPlanets.forEach(planet => {
    console.log(planet)
}) 
document.addEventListener('DOMContentLoaded', () => {
    // TEST 1 BUTTONS //
    let sliderValue = 10;
    let slider = document.getElementById('slider'); //GETS SLIDER VALUE
    slider.addEventListener('input', () => {
        sliderValue = slider.value;
    });
    document.getElementById('back-button1').addEventListener('click', function() { //BACK BUTTON
        showResponses();
        hideTest('test1');
    });
    document.getElementById('submit-button').addEventListener('click',() => test1(sliderValue)); //SUBMIT BUTTON
    // TEST 2 BUTTONS //
    document.getElementById('back-button2').addEventListener('click', function(){
        showResponses();
        hideTest('test2');
    }); //SUBMIT BUTTON
    
    // TEST 3 BUTTONS //
    document.getElementById('back-button3').addEventListener('click', function(){
        showResponses();
        hideTest('test3');
    });
    // TEST 3 BUTTONS //
    document.getElementById('back-button4').addEventListener('click', function(){
        showResponses();
        hideTest('test4');
    });
    

    // LOG AND VIEW LOGS BUTTON //
    // document.getElementById('return-button').addEventListener('click', VictoryMenu);
    document.getElementById('confirm-yes').addEventListener('click', VictoryMenu);
    document.getElementById('log').addEventListener('click', Log);
    document.getElementById('submit-menu').addEventListener('click', SubmitMenu);
    document.getElementById('log-button').addEventListener('click', ReadLog);
    document.getElementById('return-button').addEventListener('click', ConfirmMenu);
    // RESPONSE BUTTONS //
    document.querySelectorAll('.response').forEach((button, index) => {
        button.addEventListener('click', () => activateTest(`test${index + 1}`));
    });

    // PLANET BUTTONS //
    document.querySelectorAll('.planet[name="PInput"]').forEach((radio, index) => {
        chosenPlanets[index]['id'] = `Planet${index+1}`;
        if(index === 0){
            currentPlanet = chosenPlanets[index];
        }
        radio.addEventListener('change', () => {
            SwitchPlanet(chosenPlanets[index]);
        });
    });
});

    let daysVisual = document.getElementById('days')
    const intervalId = setInterval(() => {
        if (days === 0) {
            VictoryMenu("Days ran out");
            clearInterval(intervalId);

        } else if (days === 3) {
            daysVisual.innerHTML = `Days left: ${--days}`;
            daysVisual.style.color = 'red';
        } else {
            daysVisual.innerHTML = `Days left: ${--days}`;
        }
    }, oneDayInMS); 


