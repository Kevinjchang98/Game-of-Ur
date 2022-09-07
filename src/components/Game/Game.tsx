import { Suspense, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import styles from './Game.module.css';
import Piece from '../Piece/Piece';

function Game() {
    // Keep track of current roll
    const [roll, setRoll] = useState<number>(1);
    // ID of current player
    const [currPlayer, setCurrPlayer] = useState<number>(0);
    // x, z coord of last moved-to square
    const [lastLanded, setLastLanded] = useState<Array<number>>([-1, -1]);
    // ID of last-moved piece
    const [lastMovedId, setLastMovedId] = useState<number>(-1);

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
    };

    const board = useLoader(GLTFLoader, '/board.gltf');

    return (
        <Suspense fallback={null}>
            <div className={styles.canvasContainer}>
                <Canvas>
                    <primitive
                        object={board.scene}
                        scale={5}
                        position={[-0.05, 0, 0]}
                    />
                    <ambientLight />
                    <OrbitControls />
                    <Piece
                        roll={roll}
                        player={0}
                        id={0}
                        lastLanded={lastLanded}
                        setLastLanded={setLastLanded}
                        lastMovedId={lastMovedId}
                        setLastMovedId={setLastMovedId}
                    />
                    <Piece
                        roll={roll}
                        player={1}
                        id={1}
                        lastLanded={lastLanded}
                        setLastLanded={setLastLanded}
                        lastMovedId={lastMovedId}
                        setLastMovedId={setLastMovedId}
                    />
                </Canvas>
            </div>

            <div className={styles.menuContainer}>
                <p>Current roll: {roll}</p>
                <p>Current player: {currPlayer}</p>
                <button onClick={rollDice}>Roll</button>
            </div>
        </Suspense>
    );
}

export default Game;
