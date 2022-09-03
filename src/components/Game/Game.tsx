import { useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import styles from './Game.module.css';
import { OrbitControls } from '@react-three/drei';

function Game() {
    // Keep track of current roll
    const [roll, setRoll] = useState<number>(0);
    const [currPlayer, setCurrPlayer] = useState<number>(0);

    const rollDice = () => {
        // TODO: Actually generate a new roll
        setRoll(roll + 1);

        // Swap current player
        setCurrPlayer(currPlayer == 0 ? 1 : 0);
    };

    const board = useLoader(GLTFLoader, 'src/assets/board.gltf');

    return (
        <>
            <div className={styles.canvasContainer}>
                <Canvas>
                    <primitive object={board.scene} />
                    <ambientLight />
                    <OrbitControls />
                </Canvas>
            </div>

            <div className={styles.menuContainer}>
                <p>Current roll: {roll}</p>
                <p>Current player: {currPlayer}</p>
                <button onClick={rollDice}>Roll</button>
            </div>
        </>
    );
}

export default Game;
