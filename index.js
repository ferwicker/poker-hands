const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let allHands = [];

let playerOneCount = 0;
let playerTwoCount = 0;

let playerOneCards = [];
let playerTwoCards = [];


function separatePlayers(hand){
    var allCards = hand.split(' ');
    playerOneCards = allCards.slice(0,5);
    playerTwoCards = allCards.slice(5);
    //console.log(`Player 1 cards: ${playerOneCards} \nPlayer 2 cards: ${playerTwoCards}`)
}

process.stdin.on('data', function(data){
    var allData = data.toString().trim();
    allHands = allData.split('\r');
    // console.log('\n\n');
    // console.log(allHands);  
});