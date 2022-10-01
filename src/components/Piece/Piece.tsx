import { useSpring, animated } from '@react-spring/three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

interface PieceProps {
    positions: any;
    player: number;
    id: number;
    movePiece: Function;
}

type GLTFResult = GLTF & {
    nodes: {
        Sphere: THREE.Mesh;
    };
    materials: any; // TODO: Reconsider any
};

const PIECE_HEIGHT = 0.4; // Height of pieces above board
const PIECE_SCALE = 0.3;

function Piece({ positions, player, id, movePiece }: PieceProps) {
    // Geometry and texture of pieces
    const { nodes, materials } = useGLTF('/piece.gltf') as GLTFResult;

    // Starting position of the pieces
    const SPAWN = [player === 0 ? -1 : 1, PIECE_HEIGHT + id / 2, 0.5];

    // Animate position to new position
    const { positionAnimated } = useSpring({
        positionAnimated: positions[id].pos,
    });

    return (
        <>
            <animated.mesh
                castShadow
                receiveShadow
                scale={[
                    PIECE_SCALE * 1,
                    PIECE_SCALE * PIECE_HEIGHT,
                    PIECE_SCALE * 1,
                ]}
                position={positionAnimated as any}
                geometry={nodes.Sphere.geometry}
                // TODO: Rename materials so we don't have to player + 1
                material={materials[`Material.00${player + 1}`]}
                onClick={() => {
                    movePiece(id);
                }}
            ></animated.mesh>
        </>
    );
}

export default Piece;
