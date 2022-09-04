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
        0,
        PIECE_HEIGHT,
        -3.5,
    ]);

    const { positionAnimated } = useSpring({
        positionAnimated: position,
    });

    // Moves piece
    const movePiece = () => {
        // TODO: Constrain possible positions within board
        setPosition([position[0], position[1], position[2] + roll]);
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
