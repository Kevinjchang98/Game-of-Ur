import { useSpring, animated } from '@react-spring/three';
import { useEffect, useState } from 'react';

interface PieceProps {
    roll: number;
    player: number;
    id: number;
    lastLanded: Array<number>;
    setLastLanded: Function;
    lastMovedId: number;
    setLastMovedId: Function;
}

const PIECE_HEIGHT = 0.5; // Height of pieces above board
const PIECE_SCALE = 0.4;

function Piece({
    roll,
    player,
    id,
    lastLanded,
    setLastLanded,
    lastMovedId,
    setLastMovedId,
}: PieceProps) {
    // [x, y, z] coord of position of piece
    const [position, setPosition] = useState<Array<number>>([
        player == 0 ? -1 : 1,
        PIECE_HEIGHT - 0.3,
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
            lastMovedId !== id
        ) {
            // TODO: Pick a place to keep all pieces that still need to be moved
            setPosition([3, 1, 0]);
            setLastMovedId(id);
        }
    }, [lastLanded]);

    // Moves piece
    const movePiece = () => {
        setPosition(([x, y, z]) => {
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

            // Update last-moved information
            setLastLanded([x, z]);
            setLastMovedId(id);

            // Update position
            return [x, y, z];
        });
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
