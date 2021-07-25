# Poker Hand Sorter
Welcome! This command line application will compare poker hands between two players and return the total games won by each player.

## Features
When the application runs, it will read the poker hands from the provided file, compare the hands and count how many games each player has won. When all the hands have been determined, the application will print the total scores for each player.

## Built with
- Javascript

## Installation
After downloading the package, navigate to the folder in your Terminal. Now you are ready, start the application from the folder using `node index.js` command.

## How to Use
A test file with 500 poker hands is provided. To change the hands that are compared, edit or replace the file (be careful to use the same name or the application won't run).

The hands are given in the following format:
Each card is represented by 2 characters - the value and the suit. The first 5 cards in the line
have been dealt to Player 1, the last 5 cards in the line belong to Player 2.

Example of one hand/line:

`AH 9S 4D TD 8S 4H JS 3C TC 8D`

The cards are valued in the order:
2, 3, 4, 5, 6, 7, 8, 9, 10(T), Jack(J) Queen(Q), King(K), Ace(A)

  For this application, Ace is considered high only. *(i.e. cannot be used as a low card below 2 in a straight)*.

Suits are:
Diamonds (D), Hearts (H), Spades (S), Clubs (C)
