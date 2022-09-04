import { useSpring, animated } from '@react-spring/three';
import { useState } from 'react';

interface PieceProps {
    roll: number;
}

// TODO: Properly size board
const GRID_SIZE_MULTIPLIER = 0.72; // Multiplier for grid transformations
const PIECE_HEIGHT = 0.4; // Height of pieces above board
const PIECE_SCALE = 0.4;

function Piece({ roll }: PieceProps) {
    const [position, setPosition] = useState<Array<number>>([
        0,
        PIECE_HEIGHT,
        -3.5 * GRID_SIZE_MULTIPLIER,
    ]);

    const { positionAnimated } = useSpring({
        positionAnimated: position,
    });

    // Moves piece
    const movePiece = () => {
        // TODO: Constrain possible positions within board
        setPosition([
            position[0],
            position[1],
            position[2] + GRID_SIZE_MULTIPLIER * roll,
        ]);
    };

    return (
        <animated.mesh
            scale={PIECE_SCALE}
            position={positionAnimated as any}
            onClick={movePiece}
        >
            <boxGeometry />
            <meshStandardMaterial color={'blue'} />
        </animated.mesh>
    );
}

export default Piece;
