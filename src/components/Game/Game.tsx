import { Suspense, useEffect, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import produce from 'immer';

import styles from './Game.module.css';
import Piece from '../Piece/Piece';

// Type definition for each piece's coordinates
export type PiecePosition = [x: number, y: number, z: number];

function Game() {
    // Number of pieces per player
    const NUM_PIECES = 3;
    // How high off the board the pieces are
    const PIECE_HEIGHT = 0.4;

    // Keep track of current roll
    const [roll, setRoll] = useState<number>(0);
    // ID of current player
    const [currPlayer, setCurrPlayer] = useState<number>(0);
    // Has made a move and a new roll must be generated
    const [hasMoved, setHasMoved] = useState<boolean>(true);
    // Positions array
    const [positions, setPositions] = useState<Array<{ pos: PiecePosition }>>(
        []
    );

    // Initialize positions for the first time
    useEffect(() => {
        setPositions(() => {
            let newPosArr: typeof positions = [];

            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < NUM_PIECES; j++) {
                    newPosArr.push({
                        pos: [i == 0 ? -1 : 1, PIECE_HEIGHT + j / 2, 0.5],
                    });
                }
            }

            return newPosArr;
        });
    }, []);

    const rollDice = () => {
        // 4 dice and each with a 50/50 chance in 0 and 1, the probability will be:
        // 0: 6.25%, 1: 25%, 2: 37.5%, 3: 25%, 4: 6.25%
        setRoll(() => {
            let num = Math.random();
            if (num < 0.0625) return 0;
            if (num < 0.0625 + 0.25) return 1;
            if (num < 0.0625 + 0.25 + 0.375) return 2;
            if (num < 0.0625 + 0.25 + 0.375 + 0.25) return 3;
            return 4;
        });

        // Swap current player
        // setCurrPlayer(currPlayer == 0 ? 1 : 0);

        // Allow a new move to be made
        setHasMoved(false);
    };

    /**
     * Moves the current piece
     *
     * @param id ID of the piece to be moved
     */
    const movePiece = (id: number) => {
        // Checks if it's the correct player's piece moving
        if (checkIfPlayerTurn(id) && !hasMoved) {
            // Get next position from helper function based off current position
            let [x, y, z] = getNextPos(positions[id].pos);

            y = PIECE_HEIGHT;

            // Check if next position has an enemy piece on it
            checkIfCapture([x, y, z]);

            // Check if the new position has a friendly piece blocking current piece
            if (checkIfFriendly([x, y, z], id)) {
                return;
            }
            // Set new position
            setPositions(
                produce((draft: any) => {
                    draft[id].pos = [x, y, z];
                })
            );

            // Check if next position is a rosette
            if (!checkIfRosette([x, y, z])) {
                // Alternate current player
                setCurrPlayer(currPlayer === 0 ? 1 : 0);
            }

            // Set hasMoved status
            setHasMoved(true);
        }
    };

    /**
     * Check if the position we're about to move to has a friendly piece would
     * would block the current move. Returns true if there is a friendly
     *
     * @param pos Position array of what we want to move to in form [x, y, z]
     * @param currId ID of the piece we're trying to move
     *
     * @return True if there is a friendly blocking the move, false if not
     */
    const checkIfFriendly = (pos: PiecePosition, currId: number) => {
        // Determine which indexes of positions we need to check
        let left, right;

        // Get indexes of friendly pieces
        if (currPlayer === 0) {
            left = 0;
            right = NUM_PIECES;
        } else {
            left = NUM_PIECES;
            right = NUM_PIECES * 2;
        }

        for (let i = left; i < right; i++) {
            if (i != currId) {
                // This check technically isn't needed for this to function
                if (positions[i].pos.toString() === pos.toString()) {
                    console.log('friendly piece is on new position');
                    return true;
                }
            }
        }

        return false;
    };

    /**
     * Check if the position we're about to move to is a rosette which would
     * allow the current player to roll and move again
     *
     * @param pos Position of the piece we're about to move in form [x, y, z]
     */
    const checkIfRosette = (pos: PiecePosition) => {
        // Coordinates of rosettes
        const rosettePos = ['-1,-3.5', '-1,2.5', '0,-0.5', '1,-3.5', '1,2.5'];

        // Get x and z coord from pos
        let [x, z] = [pos[0], pos[2]];

        // Check
        if (rosettePos.includes([x, z].toString())) {
            console.log('rosette');
            // Return true if we landed on a rosette
            return true;
        }

        // Return false if not a rosette
        return false;
    };

    /**
     * Checks if the position we're about to move to has an enemy piece which we
     * need to move back to spawn.
     *
     * @param pos Position of the piece we're about to move in form [x, y, z]
     */
    const checkIfCapture = (pos: PiecePosition) => {
        // Determine which indexes of positions we need to check
        let left, right;

        // Get indexes of enemy pieces
        if (currPlayer === 1) {
            left = 0;
            right = NUM_PIECES;
        } else {
            left = NUM_PIECES;
            right = NUM_PIECES * 2;
        }

        // Check if an enemy piece exists in the pos we're about to move to
        for (let i = left; i < right; i++) {
            if (positions[i].pos.toString() === pos.toString()) {
                console.log('is a capture for piece' + i);

                // Set piece-being-captured's position to spawn
                setPositions(
                    produce((draft: any) => {
                        draft[i].pos = [
                            i < NUM_PIECES ? -1 : 1,
                            PIECE_HEIGHT +
                                (i < NUM_PIECES ? i : i - NUM_PIECES) / 2,
                            0.5,
                        ];
                    })
                );
            }
        }
    };

    /**
     * Gets the next position to move to given an array of the current piece
     * position of form [x, y, z]
     *
     * @param pos Array of current position in the form [x, y, z]
     */
    const getNextPos = (pos: PiecePosition) => {
        let [x, y, z] = pos;

        if (x !== 0) {
            // starting part of the board
            if (z < 1) {
                if (z - roll < -3.5) {
                    x = 0;
                    z = -3.5 - (z - roll + 3.5) - 1;
                } else {
                    z -= roll;
                }
            }
            // finishing part of the board
            else {
                // must have an exact roll to finish
                if (z - roll >= 1.5) z -= roll;
            }
        } else {
            if (z + roll > 3.5) {
                // must have an exact roll to finish
                if (3.5 - (z + roll - 3.5) + 1 >= 1.5) {
                    x = currPlayer === 0 ? -1 : 1;
                    z = 3.5 - (z + roll - 3.5) + 1;
                }
            } else z += roll;
        }

        return [x, y, z];
    };

    /**
     * Checks if the pieceId is the current player's piece and is their turn to
     * move
     *
     * @param pieceId ID of the piece to be moved
     */
    const checkIfPlayerTurn = (pieceId: number) => {
        if (currPlayer === 0) {
            return pieceId < NUM_PIECES;
        } else {
            return pieceId >= NUM_PIECES;
        }
    };

    const board = useLoader(GLTFLoader, '/board.gltf');

    const pieces = Array(NUM_PIECES * 2)
        .fill(null)
        .map((e: any, i: number) => {
            return (
                <Piece
                    key={i}
                    positions={positions}
                    player={i < NUM_PIECES ? 0 : 1}
                    id={i}
                    movePiece={movePiece}
                />
            );
        });

    return (
        <Suspense fallback={null}>
            <div className={styles.canvasContainer}>
                <Canvas camera={{ position: [0, 10, 0] }}>
                    <primitive
                        object={board.scene}
                        scale={5}
                        position={[-0.05, 0, 0]}
                    />
                    <ambientLight />
                    <OrbitControls target={[0, 0, 0]} />
                    {pieces}
                </Canvas>
            </div>

            <div className={styles.menuContainer}>
                <p>Current roll: {roll}</p>
                <p>Current player: {currPlayer}</p>
                <button onClick={rollDice} disabled={!hasMoved}>
                    Roll
                </button>
            </div>
        </Suspense>
    );
}

export default Game;
