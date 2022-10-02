# Game of Ur

## Live site

A deployment of this project's main branch can be found [here](https://game-of-ur.vercel.app/).

## What is it?

Based on [The Royal Game of Ur](https://en.wikipedia.org/wiki/Royal_Game_of_Ur), this web version uses [React Three Fiber](https://github.com/pmndrs/react-three-fiber) to create a digital version.

The textures used on the assets come from The Trustees of the British Museum, and can be found [here for the board](https://www.britishmuseum.org/collection/image/1613361042), and [here for the pieces](https://www.britishmuseum.org/collection/image/311475001).

## How do you play?

Each player has a number of pieces that they must get around the board. The first to get all their pieces around the board is the winner.

A set of four die which each have a 50% chance to roll a 0 and 50% chance to roll a 1 add up to the amount of spaces you may move one of your pieces per turn.

Only one piece can occupy a tile at a time. If it's a tile in the middle set of tiles, one player landing on another player's piece will cause the landed-on piece returning back to the start (off the board).

If you land on a tile with a rosette, you're allowed to roll and take another turn.

An exact roll is needed to move a piece off the board at the end; e.g., if you are 1 tile away, you cannot move your piece off the end until you roll exactly a 1.
