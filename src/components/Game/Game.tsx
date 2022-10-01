import { Suspense, useEffect, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import produce from 'immer';

import styles from './Game.module.css';
import Piece from '../Piece/Piece';

function Game() {
    // Number of pieces per player
    const NUM_PIECES = 3;
    // How high off the board the pieces are
    const PIECE_HEIGHT = 0.4;

    // Keep track of current roll
    const [roll, setRoll] = useState<number>(0);
    // ID of current player
    const [currPlayer, setCurrPlayer] = useState<number>(0);
    // x, z coord of last moved-to square
    const [lastLanded, setLastLanded] = useState<Array<number>>([-1, -1]);
    // ID of last-moved piece
    const [lastMovedPlayer, setLastMovedPlayer] = useState<number>(-1);
    // Array of coords filled with pieces
    const [occupied, setOccupied] = useState<any>([[], []]);
    // Has made a move and a new roll must be generated
    const [hasMoved, setHasMoved] = useState<boolean>(true);
    // If a reroll is allowed by landing on a rosette
    const [isReroll, setIsReroll] = useState<boolean>(false);
    // Positions array
    const [positions, setPositions] = useState<any>([]);

    // Initialize positions for the first time
    useEffect(() => {
        setPositions(() => {
            let newPosArr = [];

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
            else if (num < 0.0625 + 0.25) return 1;
            else if (num < 0.0625 + 0.25 + 0.375) return 2;
            else if (num < 0.0625 + 0.25 + 0.375 + 0.25) return 3;
            else return 4;
        });

        // Swap current player
        setCurrPlayer(currPlayer == 0 ? 1 : 0);

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
        if (checkIfPlayerTurn(id)) {
            // Get next position from helper function based off current position
            let nextPos = getNextPos(positions[id].pos);

            // Check if next position has an enemy piece on it
            checkIfCapture(nextPos);

            // Check if next position is a rosette
            checkIfRosette(nextPos);

            // Set new position
            setPositions(
                produce((draft: any) => {
                    draft[id].pos = nextPos;
                })
            );
        }
    };

    /**
     * Check if the position we're about to move to is a rosette which would
     * allow the current player to roll and move again
     *
     * @param pos Position of the piece we're about to move in form [x, y, z]
     */
    const checkIfRosette = (pos: Array<number>) => {
        // Coordinates of rosettes
        const rosettePos = ['-1,-3.5', '-1,2.5', '0,-0.5', '1,-3.5', '1,2.5'];

        // Get x and z coord from pos
        let [x, z] = [pos[0], pos[2]];

        // Check
        if (rosettePos.includes([x, z].toString())) {
            console.log('rosette');
            // TODO: Finish
        }
    };

    /**
     * Checks if the position we're about to move to has an enemy piece which we
     * need to move back to spawn.
     *
     * @param pos Position of the piece we're about to move in form [x, y, z]
     */
    const checkIfCapture = (pos: Array<number>) => {
        // Determine which indexes of positions we need to check
        let left, right;

        // Get indexes of enemy pieces
        if (currPlayer === 1) {
            left = 0;
            right = NUM_PIECES - 1;
        } else {
            left = NUM_PIECES;
            right = NUM_PIECES * 2 - 1;
        }

        // Check if an enemy piece exists in the pos we're about to move to
        for (let i = left; i <= right; i++) {
            if (positions[i].pos.toString() === pos.toString()) {
                console.log('is a capture for piece' + i);

                // Set piece-being-captured's position to spawn
                setPositions(
                    produce((draft: any) => {
                        draft[i].pos = [
                            i == 0 ? -1 : 1,
                            PIECE_HEIGHT + (currPlayer === 0 ? 1 : 0) / 2,
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
     * @param currPos Array of current position in the form [x, y, z]
     */
    const getNextPos = (currPos: Array<number>) => {
        let [x, y, z] = currPos;

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

    const reroll = () => {
        setCurrPlayer(currPlayer == 0 ? 1 : 0);
        setLastMovedPlayer(lastMovedPlayer == 0 ? 1 : 0);
    };

    const board = useLoader(GLTFLoader, '/board.gltf');

    const pieces = Array(NUM_PIECES * 2)
        .fill(null)
        .map((e: any, i: number) => {
            return (
                <Piece
                    positions={positions}
                    setPositions={setPositions}
                    roll={roll}
                    player={i < NUM_PIECES ? 0 : 1}
                    setCurrPlayer={setCurrPlayer}
                    id={i}
                    lastLanded={lastLanded}
                    setLastLanded={setLastLanded}
                    lastMovedPlayer={lastMovedPlayer}
                    setLastMovedPlayer={setLastMovedPlayer}
                    occupied={occupied}
                    setOccupied={setOccupied}
                    key={i}
                    hasMoved={hasMoved}
                    setHasMoved={setHasMoved}
                    isReroll={isReroll}
                    setIsReroll={setIsReroll}
                    NUM_PIECES={NUM_PIECES}
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
                <button
                    onClick={rollDice}
                    // disabled={!hasMoved && roll !== 0 && !isReroll}
                >
                    Roll
                </button>
                {currPlayer}
            </div>
        </Suspense>
    );
}

export default Game;
