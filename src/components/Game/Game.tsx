import { Canvas } from '@react-three/fiber';

import styles from './Game.module.css';

function Game() {
    return (
        <div className={styles.canvasContainer}>
            <Canvas>
                <mesh>
                    <boxGeometry />
                    <meshStandardMaterial />
                </mesh>
            </Canvas>
        </div>
    );
}

export default Game;
