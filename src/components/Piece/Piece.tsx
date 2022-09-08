import { useSpring, animated } from '@react-spring/three';
import { useEffect, useState } from 'react';

interface PieceProps {
    roll: number;
    player: number;
    id: number;
    lastLanded: Array<number>;
    setLastLanded: Function;
    lastMovedPlayer: number;
    setLastMovedPlayer: Function;
    occupied: any;
    setOccupied: Function;
}

const PIECE_HEIGHT = 0.5; // Height of pieces above board
const PIECE_SCALE = 0.4;

function Piece({
    roll,
    player,
    id,
    lastLanded,
    setLastLanded,
    lastMovedPlayer,
    setLastMovedPlayer,
    occupied,
    setOccupied,
}: PieceProps) {
    // [x, y, z] coord of position of piece
    const [position, setPosition] = useState<Array<number>>([
        player == 0 ? -1 : 1,
        PIECE_HEIGHT + id / 2,
        0.5,
    ]);

    // Animate position to new position
    const { positionAnimated } = useSpring({
        positionAnimated: position,
    });

    // Checks if this piece was just landed on and if it should reset to spawn
    useEffect(() => {
        if (
            position[0] === lastLanded[0] &&
            position[2] === lastLanded[1] &&
            lastMovedPlayer !== player
        ) {
            // TODO: Pick a place to keep all pieces that still need to be moved
            // Set to the starting position
            setPosition([player == 0 ? -1 : 1, PIECE_HEIGHT + id / 2, 0.5]);
            setLastMovedPlayer(id);
        }
    }, [lastLanded]);

    // Moves piece
    const movePiece = () => {
        let [x, y, z] = position;

        if (x != 0) {
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
                    x = player == 0 ? -1 : 1;
                    z = 3.5 - (z + roll - 3.5) + 1;
                }
            } else z += roll;
        }

        if (!occupied[player].includes([x, z].toString())) {
            // If square we're moving to isn't occupied by friendly piece

            if (occupied[player === 0 ? 1 : 0].includes([x, z].toString())) {
                // TODO: If square we're moving to is occupied by enemy piece
            }

            // Update last-moved information
            setLastLanded([x, z]);
            setLastMovedPlayer(player);

            // Update occupied information
            setOccupied((prev: typeof occupied) => {
                // Create copy of old state
                let newOccupied = prev;

                // Add new position if it doesn't exist
                if (!newOccupied[player].includes([x, z].toString())) {
                    newOccupied[player].push([x, z].toString());
                }

                // Remove old position
                const old = newOccupied[player].indexOf(
                    [position[0], position[2]].toString()
                );

                if (old > -1) {
                    newOccupied[player].splice(old, 1);
                }

                return newOccupied;
            });

            // Move finished pieces to a place by player
            // TODO: Pass NUM_PIECES in from Game and line the finished pieces up horizontal?
            if (x === (player == 0 ? -1 : 1) && z === 1.5) {
                x = player == 0 ? -3 : 3;
                z = -3.5;
            }

            // Update position
            setPosition([x, PIECE_HEIGHT, z]);
        }
    };

    return (
        <animated.mesh
            scale={PIECE_SCALE}
            position={positionAnimated as any}
            onClick={movePiece}
        >
            <boxGeometry />
            <meshStandardMaterial color={player == 0 ? 'blue' : 'red'} />
        </animated.mesh>
    );
}

export default Piece;
