const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let allGames = [];

let playerOneCount = 0;
let playerTwoCount = 0;

let playerHands = [];

let playerCards;

function sortValue (x){
    x.forEach(e => { //sort by numeric value
        e.sort(function(a, b) {
            return a.value - b.value;
          });
    })
}

function separatePlayers(hand){
    playerCards = [];
    playerCards.push(hand.slice(0,5), hand.slice(5));
    sortValue(playerCards);
}

function getNumValue(value){
    let number = parseInt(value);
    if (isNaN(number) === true){
        switch (value){
            case 'T':
                number = 10;
                break;
            case 'J':
                number = 11;
                break;
            case 'Q':
                number = 12;
                break;
            case 'K':
                number = 13;
                break;
            case 'A':
                number = 14;
                break;
        }
    }
    return number
}

function getCardsObject(cards){ 
    const allCards = cards.split(' ');
    const cardsArr = [];
    let cardsObj = [];
    for (i=0; i<allCards.length; i++){
        cardsArr.push(allCards[i].split(''));
        cardsObj = cardsArr.map(function(x){
            return {
                value: getNumValue(x[0]),
                suit: x[1]
            }
        });
    }
    return cardsObj;
}

function checkConsecutive(x){
    for (i=0; i<3; i++){
        var j = i + 1;
        var diff = x[i].value - x[j].value; //breaks here after certain amount of times running, cant find second value
        if(diff !== -1){
            consecutive = false;
            break
        } else {
            consecutive = true;
        }
    }
}

function checkSameSuit(x){
    for (i=0; i<3; i++){
        var j = i + 1;
        if (x[i].suit !== x[j].suit){
            sameSuit = false;
            break
        } else {
            sameSuit = true;
        }
    }
}

function RoyalFlush(x, index){
    if (consecutive === true && sameSuit === true){
        if (x[4].value === 14) {
            playerHands[index].handValue = 10;
            return true
        } else {
            return false
        }
    }
}

function StraightFlush(x, index){
    if (consecutive === true && sameSuit === true){
        if (x[4].value < 14) {
            playerHands[index].handValue = 9;
            playerHands[index].highValue = x[4].value;
            return true
        } else {
            return false
        }
    }
}

function Flush (x, index){
    if (consecutive === false && sameSuit === true) {
        playerHands[index].handValue = 6;
        playerHands[index].highValue = x[4].value;
        return true;
    } else {
        return false
    }
}

function Straight (x, index){
    if (consecutive === true && sameSuit === false) {
        playerHands[index].handValue = 5;
        playerHands[index].highValue = x[4].value;
        return true;
    } else {
        return false
    }
}

function checkHands(x){
    x.forEach((element, index) => {
        playerHands.push({});
        let consecutive;
        let sameSuit;
        checkConsecutive(hand);
        checkSameSuit(hand);
        // add hands check here switch statement
    });
}


function getWinner(a,b){
    //compare players hands and determine winner
    //add to winner's count
}

function init (hands){
    for (i=0; i<hands.length; i++){ //change to foreach
        playerHands = [];
        var cards = getCardsObject(hands[i]);
        separatePlayers(cards);
        checkHands(playerCards);
    };
    //log winners count
    process.stdout.write('\n'); //just adding some padding
    process.exit(); // add option to run again or exit?
}

rl.input.on('data', function(data){
    var allData = data.toString().trim();
    allGames = allData.split('\r');
    init(allGames);  
});