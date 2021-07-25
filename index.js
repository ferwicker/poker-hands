const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: fs.createReadStream('poker-hands.txt'),
  output: process.stdout,
  console: false
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
    for (i=0; i<4; i++){
        var j = i + 1;
        var diff = x[i].value - x[j].value;
        if(diff !== -1){
            consecutive = false;
            break
        } else {
            consecutive = true;
        }
    }
}

function checkSameSuit(x){
    for (i=0; i<4; i++){
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

function FourOfAKind (x, index){ //could use counter but theres only two options to return true here, so using simple comparison
    if (x[0].value === x[1].value && 
        x[0].value === x[2].value && 
        x[0].value === x[3].value) {
        playerHands[index].handValue = 8;
        playerHands[index].highValue = x[0].value;
        playerHands[index].highCard = x[4].value;
        return true
    } else if (x[1].value === x[2].value && 
               x[1].value === x[3].value && 
               x[1].value === x[4].value) {
        playerHands[index].handValue = 8;
        playerHands[index].highValue = x[4].value;
        playerHands[index].highCard = x[0].value;
        return true
    } else {
        return false
    }
}

function FullHouse (x, index){ // use same method as pairs and threes - OK
    let counter = 1;
    let pair = 0; //would only be one of each so doesnt need array
    let threes = 0;
    for (i=0; i < 4; i++) {
        if (x[i].value === x[i+1].value){
            counter ++;
            if (counter === 2) {
                if (pair === 0) { //if pair is empty only
                    pair = x[i].value
                }
            } if (counter === 3) {
                threes = x[i].value;
                if (pair === threes){
                    pair = 0; //reset pair if it becomes three of a kind
                }
            }
        } else {
            counter = 1;
        }
    }
    if (pair > 0 && threes > 0) {
        playerHands[index].handValue = 7;
        playerHands[index].highValue = threes;
        playerHands[index].highCard = pair;
        return true
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
        playerHands[index].secondCard = x[1].value;
        playerHands[index].thirdCard = x[0].value;
        return true
    } else {
        return false
    }
}

function NoPair(x, index){
    playerHands[index].handValue = 1;
    playerHands[index].highValue = x[4].value;
    playerHands[index].highCard = x[3].value;
    playerHands[index].secondCard = x[2].value;
    playerHands[index].thirdCard = x[1].value;
    playerHands[index].fourthCard = x[0].value;
    return true
}

function checkHands(x){ //checks hands and assigns values
    x.forEach((hand, index) => {
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

function simpleCompare (a,b) {
    if (a > b) {
        playerOneCount ++
    } else {
        playerTwoCount ++
    };
}

function tieBreaker(a, b){
    switch (true) {
        case (a.highValue && a.highValue !== b.highValue): //if high value exists and is different
            simpleCompare(a.highValue, b.highValue);
            break;
        case (a.lowValue && a.lowValue !== b.lowValue):
            simpleCompare(a.lowValue, b.lowValue);
            break;
        case (a.highCard && a.highCard !== b.highCard):
            simpleCompare(a.highCard, b.highCard);
            break;
        case (a.secondCard && a.secondCard !== b.secondCard):
            simpleCompare(a.secondCard, b.secondCard);
            break;
        case (a.thirdCard && a.thirdCard !== b.thirdCard):
            simpleCompare(a.thirdCard, b.thirdCard);
            break;
        case (a.fourthCard && a.fourthCard !== b.fourthCard):
            simpleCompare(a.fourthCard, b.fourthCard);
            break;
        default:
            break;
    }
}

function getWinner(a, b){
    if (a.handValue > b.handValue) {
        playerOneCount ++
    } else if (a.handValue < b.handValue) {
        playerTwoCount ++
    } else if (a.handValue === b.handValue) { //if they have same hand ranking
        tieBreaker(a, b)
    }
}

function init (games){
    games.forEach((game) => {
        playerHands = [];
        var cards = getCardsObject(game);
        separatePlayers(cards);
        checkHands(playerCards);
        getWinner(playerHands[0], playerHands[1]);
    })
    //log winners count
    process.stdout.write(`\n\nPlayer 1: ${playerOneCount} hands \nPlayer 2: ${playerTwoCount} hands\n`);
    process.exit(); 
}

rl.on('line', function(line) {
    allGames.push(line);
});

rl.input.on('end', () => {
    init(allGames); 
})