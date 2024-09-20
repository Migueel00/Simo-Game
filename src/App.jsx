import { useState, useEffect, useRef } from "react";
import useSound from "use-sound";
import simon from "./assets/sounds/sprite.mp3";
import "./App.css";

export default function App() {
    // referencia al sprite de sonido
    const [play] = useSound(simon, {
        sprite: {
            one: [0, 500],
            two: [1000, 500],
            three: [2000, 500],
            four: [3000, 500],
            erro: [4000, 1000],
        },
    });

    // Array de pociones
    const potions = [
        {
            color: 'blue',
            on: './blue-potion-on.png',
            off: './blue-potion.png',
            sound: 'one', // Si quieres asignar un sonido
        },
        {
            color: 'green',
            on: './green-potion-on.png',
            off: './green-potion.png',
            sound: 'two',
        },
        {
            color: 'purple',
            on: './purple-potion-on.png',
            off: './purple-potion.png',
            sound: 'three',
        },
        {
            color: 'red',
            on: './red-potion-on.png',
            off: './red-potion.png',
            sound: 'four',
        },
    ];

    // Constantes para los calculos del juego
    const minNumber = 0;
    const maxNumber = potions.length - 1; // Cambiado para que coincida con el número de pociones
    const speedGame = 400;

    // Hooks de estado
    const [sequence, setSequence] = useState([]);
    const [currentGame, setCurrentGame] = useState([]);
    const [isAllowedToPlay, setIsAllowedToPlay] = useState(false);
    const [speed, setSpeed] = useState(speedGame);
    const [turn, setTurn] = useState(0);
    const [pulses, setPulses] = useState(0);
    const [success, setSuccess] = useState(0);
    const [isGameOn, setIsGameOn] = useState(false);
    const [activePotions, setActivePotions] = useState([]);
    const [shuffledPotions, setShuffledPotions] = useState(potions);

    const initGame = () => {
        randomNumber();
        setIsGameOn(true);
    };

    const randomNumber = () => {
        setIsAllowedToPlay(false);
        const randomNum = Math.floor(Math.random() * (maxNumber + 1));
        setSequence([...sequence, randomNum]);
        setTurn(turn + 1);
    };

    const handleClick = (index) => {
        if (isAllowedToPlay) {
            play({ id: potions[index].sound });
            setCurrentGame([...currentGame, index]);
            setPulses(pulses + 1);
        }
    };

    const shufflePotions = (array) => {
        let shuffledArray = [...array]

        for(let i = shuffledArray.length - 1; i > 0; i--){

            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
        }

        return shuffledArray;
    }

    useEffect(() => {
        if (pulses > 0) {
            if (Number(sequence[pulses - 1]) === Number(currentGame[pulses - 1])) {
                setSuccess(success + 1);
            } else {
                const index = sequence[pulses - 1];
                play({ id: 'erro' });
                setIsGameOn(false);
            }
        }
    }, [pulses]);

    useEffect(() => {
        if (!isGameOn) {
            setSequence([]);
            setCurrentGame([]);
            setIsAllowedToPlay(false);
            setSpeed(speedGame);
            setSuccess(0);
            setPulses(0);
            setTurn(0);
            setActivePotions([]); 
        }
    }, [isGameOn]);

    useEffect(() => {
        if (success === sequence.length && success > 0) {
            setSpeed(speed - sequence.length * 2);
            setTimeout(() => {
                setSuccess(0);
                setPulses(0);
                setCurrentGame([]);
                randomNumber();
            }, 500);
        }
    }, [success]);

    useEffect(() => {
        if (!isAllowedToPlay) {
            sequence.forEach((item, index) => {
                setTimeout(() => {
                    play({ id: potions[item].sound });
                    setActivePotions(prev => [...prev, item]); 
                    setTimeout(() => {
                        setActivePotions(prev => prev.filter(i => i !== item)); 
                    }, speed / 2);
                }, speed * index);
            });
        }
        setIsAllowedToPlay(true);
    }, [sequence]);

    useEffect(() => {
        if (!isGameOn) {
            document.body.style.backgroundImage = "url('./background.jpg')";
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
        } else {
            document.body.style.background = "url('./fondo-mesa.png')";
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
        }
    }, [isGameOn]);

    useEffect(() => {
        

        if(turn > 0  && turn % 5 === 0){
            const newShuffledPotions = shufflePotions(potions);
            setShuffledPotions(newShuffledPotions)
        }
    }, [turn])

    return (
        <>
            {isGameOn ? (
                <>
                    <div className="header">
                        <h1>Turn {turn}</h1>
                    </div>
                    <div className="container">
                        {shuffledPotions.map((item, index) => (
                            <div key={index}  onClick={() => handleClick(index)}>
                                <img
                                    src={activePotions.includes(index) ? item.on : item.off}
                                    alt={`${item.color} potion`}
                                    className="potion-image"
                                />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="header">
                    <img src="./boton.png" alt="boton" onClick={initGame} className="btn-enter" />
                </div>
            )}
        </>
    );
}
