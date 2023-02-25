/* eslint-env es6 */
/* eslint-disable */
/* jslint-disable */

var firstRound = true;
var gameList = [];
var correctField = Math.floor(Math.random()*10);
var hasChosen = false;
var streakScore = 0;
var wins = 0;
var losses = 0;
var canApplyChanges = false;
var appliedCheck = [true, true, true, true, true, true, true, true, true, true]; /*0-4 Element, 5-9 Stars */
var unsavedCheck = [true, true, true, true, true, true, true, true, true, true]; /*0-4 Element, 5-9 Stars */
var unsavedDifficulty = 10;
var difficulty = 10;

var index = 0;
var path = window.location.href;
path = path.replace("index.html", "");
monsterList = readTextFile(path + "Database.txt");
updateStats();
gameList = monsterList.map(elem => elem);
StartNewGame();




function StartNewGame()
    {
        if(!hasChosen && !firstRound) losses++;
        firstRound = false;
        hasChosen = false;
        var mon = document.getElementById("monster").children;
        for(var i=0; i<mon.length; i++){
            mon[i].style.border = "5px solid #ccc";
            mon[i].removeAttribute("hidden");
        }
        for(var j = difficulty; j<mon.length;j++){
            mon[j].setAttribute("hidden", "hidden");
        }
            
        correctField = Math.floor(Math.random()*difficulty);
        var shuffledList = Array.from(Array(gameList.length).keys());
        shuffle(shuffledList);
        shuffledList = shuffledList.slice(0,difficulty+1);
        
        for(let g = 0;g<=difficulty-1; g++)
        {
            if(g==correctField)
                {
                    document.getElementById(g).src =  "Images/" + gameList[shuffledList[difficulty]][3];
                }
            else{
                    document.getElementById(g).src =  "Images/" + gameList[shuffledList[g]][3];
            }
        }
        document.getElementById("quest").innerHTML = gameList[shuffledList[difficulty]][2];
        updateStats();
    }

function reset()
{
    appliedCheck = [true, true, true, true, true, true, true, true, true, true];
    unsavedCheck = [true, true, true, true, true, true, true, true, true, true];
    hasChosen = false;
    streakScore = 0;
    wins = 0;
    losses = 0;
    canApplyChanges = false;
    document.getElementById("cb0")
}

function isClicked(ident) {
    if(!hasChosen){
        if(ident != correctField){
           document.getElementById(ident).style.border = "5px solid red"; 
            document.getElementById(correctField).style.border = "5px solid green";
            streakScore = 0;
            losses++;
        }
        else{
            document.getElementById(correctField).style.border = "5px solid green";
            streakScore++;
            wins++;
        }
        hasChosen = true;
        
    }
    updateStats();
}
function checkChanged(identif){
   if(identif.includes("rb")){
       unsavedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
       if(unsavedDifficulty == difficulty) {
           document.getElementById("b_apply").style.backgroundColor = "#555555";
            document.getElementById("b_apply").style.cursor = "not-allowed";
            canApplyChanges = false;
        }
        else {
            document.getElementById("b_apply").style.backgroundColor = "#58b06f";
            document.getElementById("b_apply").style.cursor = "pointer";
            canApplyChanges = true;
       }
   }
    else{
        var extId = identif.replace("cb","");
        unsavedCheck[extId] = document.getElementById(identif).checked;

        if(compareArrays(unsavedCheck, appliedCheck)) {
            document.getElementById("b_apply").style.backgroundColor = "#555555";
            document.getElementById("b_apply").style.cursor = "not-allowed";
            canApplyChanges = false;
        }
        else {
            document.getElementById("b_apply").style.backgroundColor = "#58b06f";
            document.getElementById("b_apply").style.cursor = "pointer";
            canApplyChanges = true;
        }
    }
}

function changeGameRules() {
    if(canApplyChanges){
        var tempList = gameList.map(elem => elem);
    gameList = [];
     for(let entry in monsterList) {
         let hasPassed = true;
         if(unsavedCheck[0] == false && monsterList[entry][0] === "Fire") {hasPassed = false;}
         else if(unsavedCheck[1] == false && monsterList[entry][0] === "Water") {hasPassed = false;}
         else if(unsavedCheck[2] == false && monsterList[entry][0] === "Wind") {hasPassed = false;}
         else if(unsavedCheck[3] == false && monsterList[entry][0] === "Light") {hasPassed = false;}
         else if(unsavedCheck[4] == false && monsterList[entry][0] === "Dark") {hasPassed = false;}
         else if(unsavedCheck[5] == false && monsterList[entry][1] == 1) {hasPassed = false;}
         else if(unsavedCheck[6] == false && monsterList[entry][1] == 2) {hasPassed = false;}
         else if(unsavedCheck[7] == false && monsterList[entry][1] == 3) {hasPassed = false;}
         else if(unsavedCheck[8] == false && monsterList[entry][1] == 4) {hasPassed = false;}
         else if(unsavedCheck[9] == false && monsterList[entry][1] == 5) {hasPassed = false;}
         
         if(hasPassed){
             gameList.push(monsterList[entry]);
         }
     }
    if(gameList.length < unsavedDifficulty + 2){
        gameList = tempList.map(elem => elem);
        alert("Too few Items chosen");
    }
    else {
        appliedCheck = unsavedCheck.map(elem => elem);
        document.getElementById("b_apply").style.backgroundColor = "#555555";
        document.getElementById("b_apply").style.cursor = "not-allowed";
        canApplyChanges = false;
        alert("You will load a new game");
        wins = 0;
        losses = 0;
        streakScore = 0;
        firstRound = true;
        difficulty = unsavedDifficulty;
        updateStats();
        StartNewGame();
    }
    }
    
}

function updateStats() {
    document.getElementById("streak").innerHTML = "Streak: " + streakScore;   
    document.getElementById("ratio").innerHTML = "Win/Loss: " + wins + "/" + losses;
    document.getElementById("percent").innerHTML = "Percent: " + toPercent(wins, losses);
}

function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    var tdArr = [];
    rawFile.open("GET", file, false);

    
    rawFile.onreadystatechange = function ()
    {   
        if(rawFile.readyState === 4)
        { 
                
            if(rawFile.status === 200 || rawFile.status == 0)
            { 
                
                var allText = rawFile.responseText;
                var splitUp = allText.split("\n");
                
                
                for(let items in splitUp)
                {
                    tdArr[items] = splitUp[items].split(",");
                }
            
            }
        }
    }
    rawFile.send(null);
    return tdArr;
}

function shuffle(array) {
  var random = array.map(Math.random);
  array.sort(function(a, b) {
    return random[a] - random[b];
  });
}
const compareArrays = (a, b) => {
  return a.toString() == b.toString();
};
function toPercent(a, b) {
    if(a == 0 && b == 0) return "0%";
    else if(a == 0) return "0%";
    else if(b == 0) return "100%";
    else return Math.floor((a/(a+b))*100) + "%";
}   