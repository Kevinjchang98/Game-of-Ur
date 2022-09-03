import { Canvas } from '@react-three/fiber';
import { useState } from 'react';

import styles from './Game.module.css';

function Game() {
    // Keep track of current roll
    const [roll, setRoll] = useState<number>(0);
    const [currPlayer, setCurrPlayer] = useState<number>(0);

    const rollDice = () => {
        // TODO: Actually generate a new roll
        // 4 dice and each with a 50/50 chance in 0 and 1, the probability will be:
        // 0: 6.25%, 1: 25%, 2: 37.5%, 3: 25%, 4: 6.25%
        setRoll( () => {
                var num = Math.random();
                if (num < 0.0625)
                    return 0;
                else if (num < (0.0625 + 0.25))
                    return 1;
                else if (num < (0.0625 + 0.25 + 0.375))
                    return 2;
                else if (num < (0.0625 + 0.25 + 0.375 + 0.25))
                    return 3;
                else
                    return 4;
            }
        )

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
