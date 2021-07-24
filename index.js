const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let allGames = [];

let playerOneCount = 0;
let playerTwoCount = 0;

let playerCards;

function separatePlayers(hand){
    playerCards = [];
    playerCards.push(hand.slice(0,5), hand.slice(5));
    playerCards.forEach(e => { //sort cards by value
        e.sort(function(a, b) {
            return a.value - b.value;
          });
    })
}

function numberValue(value){
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
                value: numberValue(x[0]),
                suit: x[1]
            }
        });
    }
    return cardsObj;
}

function checkHands(x){
    x.forEach(element => {
        var i = 0;
        console.log(element);
        console.log('\n\n')
        let consecutive;
        let sameSuit;
        for (i=0; i<3; i++){
            var j = i + 1;
            var diff = element[i].value - element[j].value;
            if(diff !== -1){
                consecutive = false;
                break
            } else {
                consecutive = true;
            }
        }
        for (i=0; i<3; i++){
            var j = i + 1;
            if (element[i].suit !== element[j].suit){
                sameSuit = false;
                break
            } else {
                sameSuit = true;
            }
        }
        // check what's true and false
        if (consecutive === true && sameSuit === true){
            if (element[4].value === 14) {
                console.log('Royal Flush!');
            } else {
                console.log('Straight Flush!')
            }
        } else if (consecutive === true && sameSuit === false){
            console.log('Straight!')
        } else if (consecutive === false && sameSuit === true) {
            console.log('Flush!')
        } else {
            console.log('keep checking');
        }
        //console.log(consecutive, sameSuit);
    });
}

function getWinner(a,b){
    //compare players hands and determine winner
    //add to winner's count
}

function init (hands){
    for (i=0; i<hands.length; i++){ //change to foreach
        var cards = getCardsObject(hands[i]);
        separatePlayers(cards);
        checkHands(playerCards);
    };
    //log winners count
    process.stdout.write('\n'); //just adding some padding
    process.exit(); // add option to run again or exit?
}

process.stdin.on('data', function(data){
    var allData = data.toString().trim();
    allGames = allData.split('\r');
    process.stdout.write('\n\n'); //just adding some padding
    init(allGames);  
});