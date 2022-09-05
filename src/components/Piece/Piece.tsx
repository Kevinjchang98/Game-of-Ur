import { useSpring, animated } from '@react-spring/three';
import { useState } from 'react';

interface PieceProps {
    roll: number;
    player: number;
}

const PIECE_HEIGHT = 0.5; // Height of pieces above board
const PIECE_SCALE = 0.4;

function Piece({ roll, player }: PieceProps) {
    const [position, setPosition] = useState<Array<number>>([
        player == 0 ? -1 : 1,
        PIECE_HEIGHT - 0.3,
        0.5,
    ]);

    const { positionAnimated } = useSpring({
        positionAnimated: position,
    });

    // Moves piece
    const movePiece = () => {
        // TODO: Constrain possible positions within board
        setPosition(
            // [
            // position[0],
            // position[1],
            // position[2] - roll
            // ]
            validMove()
        );
    };

    function validMove() {
        let x = position[0],
            y = position[1],
            z = position[2];
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
        // for testing
        console.log(player);
        console.log([x, y, z]);
        return [x, y, z];
    }

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
