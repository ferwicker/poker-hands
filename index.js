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

// function ThreeOfAKind (x, index){ // old version
//     if (x[0].value === x[1].value === x[2].value && x[3].value !== x[4].value) { // lower three are the same
//         playerHands[index].handValue = 4;
//         playerHands[index].highValue = x[0].value;
//         playerHands[index].highCard = x[4].value;
//         return true
//     } else if (x[0].value !== x[1].value && x[2].value === x[3].value === x[4].value) { // higher three are the same
//         playerHands[index].handValue = 4;
//         playerHands[index].highValue = x[4].value;
//         playerHands[index].highCard = x[1].value;
//         return true
//     } else if (x[0].value !== x[1].value && x[1].value === x[2].value === x[3].value && x[3].value !== x[4].value) { // middle cards same
//         playerHands[index].handValue = 4;
//         playerHands[index].highValue = x[2].value;
//         playerHands[index].highCard = x[4].value;
//         return true
//     } else {
//         return false
//     }
// }

function ThreeOfAKind(x, index){ //same method as pairs
    let counter = 1;
    const threes = [];
    const removeIndex = [];
    for (i=0; i < 4; i++) {
        if (x[i].value === x[i+1].value){
            counter ++;
            if (counter === 3) {
                threes.push(x[i].value);
                removeIndex.push(i-1, i, i+1); //check
            }
        } else {
            counter = 1;
        }
    }
    for (i=4; i>= 0; i--){
        if (removeIndex.includes(i)){
            x.splice(i, 1);
        }
    }
    if (threes.length > 0) {
        playerHands[index].handValue = 4;
        playerHands[index].highValue = threes[0];
        playerHands[index].highCard = x[1].value; //highest of 2 remaining
        return true
    } else {
        return false
    }
}

function Pairs(x, index){ //checks for one or 2 pairs
    let counter = 1;
    const pairs = [];
    const removeIndex = [];
    for (i=0; i < 4; i++) {
        if (x[i].value === x[i+1].value){
            counter ++;
            if (counter === 2) {
                pairs.push(x[i].value);
                removeIndex.push(i, i+1); //OK
            }
        } else {
            counter = 1;
        }
    }
    // remove paired cards from array, run for loop in reverse order
    for (i=4; i>= 0; i--){
        if (removeIndex.includes(i)){
            x.splice(i, 1);
        }
    }

    if (pairs.length === 2) {
        playerHands[index].handValue = 3;
        playerHands[index].highValue = pairs[1];
        playerHands[index].lowValue = pairs[0];
        playerHands[index].highCard = x[0].value; //value of remaining card
        return true
    } else if (pairs.length === 1) {
        playerHands[index].handValue = 2;
        playerHands[index].highValue = pairs[0];
        playerHands[index].highCard = x[2].value; //highest remaining out of 3
        return true
    } else {
        return false
    }
}

function NoPair(x, index){
    playerHands[index].handValue = 1;
    playerHands[index].highValue = x[4].value;
    return true
}

function checkHands(x){ //checks hands and assigns values
    x.forEach((element, index) => {
        playerHands.push({});
        let consecutive;
        let sameSuit;
        checkConsecutive(hand);
        checkSameSuit(hand);
        // check hands with switch statement
        switch (true){
            case RoyalFlush(hand, index):
                break;
            case StraightFlush(hand, index):
                break;
            case FourOfAKind(hand, index):
                break;
            case FullHouse(hand, index):
                break;
            case Flush(hand, index):
                break;
            case Straight(hand, index):
                break;
            case ThreeOfAKind(hand, index):
                break;
            case Pairs(hand,index):
                break;
            case NoPair(hand, index):
                break;
        }
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