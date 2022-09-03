import { Canvas } from '@react-three/fiber';
import { useState } from 'react';

import styles from './Game.module.css';

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

    return (
        <>
            <div className={styles.canvasContainer}>
                <Canvas>
                    <mesh>
                        <boxGeometry />
                        <meshStandardMaterial />
                    </mesh>
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
