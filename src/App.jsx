import { useState, useEffect, useRef } from "react";
import useSound from "use-sound";
import simon from "./assets/sounds/sprite.mp3";
import "./App.css";

export default function App(){

    // Referencias a los elementos de colores
    const blueRef   = useRef(null);
    const yellowRef = useRef(null);
    const greenRef  = useRef(null);
    const redRef    = useRef(null);

    // referencia al sprite de sonido
    const [play ] = useSound(simon, {
        sprite: {
            one:    [0, 500],
            two:    [1000, 500],
            three:  [2000, 500],
            four:   [3000, 500],
            erro:   [4000, 1000]
        }
    });

    // Array de objetos para los colores, sus referencias y sonido
    const colors = [
        {
            color: '#FAF303',
            ref:    yellowRef,
            sound:  'one'
        },
        {
            color: '#030AFA',
            ref:    blueRef,
            sound: 'two'
        },
        {
            color: '#FA0E03',
            ref:    redRef,
            sound: 'three'
        },
        {
            color: '#0AFA03',
            ref:    greenRef,
            sound: 'four'
        }
    ];

    // Constantes para los calculos del juego
    const minNumber = 0;
    const maxNumber = 3;
    const speedGame = 400;


    // Hooks de estado
    const [sequence, setSequence]               = useState([]);
    const [currentGame, setCurrentGame]         = useState([]);
    const [isAllowedToPlay, setIsAllowedToPlay] = useState(false);
    const [speed, setSpeed]                     = useState(speedGame);
    const [turn, setTurn]                       = useState(0);
    const [pulses, setPulses]                   = useState(0);
    const [success, setSuccess]                 = useState(0);
    const [isGameOn, setIsGameOn]               = useState(false);

    const initGame = () => {
        randomNumber();
        setIsGameOn(true);
    }

    const randomNumber = () => {
        setIsAllowedToPlay(false);
        const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber);
        setSequence([ ...sequence, randomNumber]);
        setTurn(turn + 1);
    }

    const handleClick = (index) => {
        if(isAllowedToPlay){
            play({id: colors[index].sound})
            colors[index].ref.current.style.opacity = (1);
            colors[index].ref.current.style.scale   = (0.9);
            setTimeout(() => {
                colors[index].ref.current.style.opacity = (0.5);
                colors[index].ref.current.style.scale   =(1);
                setCurrentGame([ ...currentGame, index]);
                setPulses(pulses + 1);

            }, speed / 2)
        }
    }

    useEffect(() => {
        if(pulses > 0){
            if(Number(sequence[pulses -1]) === Number(currentGame[pulses - 1])){
                setSuccess(success + 1);
            } else {
                const index = sequence[pulses - 1]
                if(index) colors[index].ref.current.style.opacity = (1);
                play({id: 'error'})
                setTimeout(() => {
                    if(index) colors[index].ref.current.style.opacity = (0.5);
                    setIsGameOn(false);
                }, speed * 2)
            setIsAllowedToPlay(false);
            }
        }

    }, [pulses]);

    useEffect(() => {
        if(!isGameOn){
            setSequence([]);
            setCurrentGame([]);
            setIsAllowedToPlay(false);
            setSpeed(speedGame);
            setSuccess(0);
            setPulses(0);
            setTurn(0);
        }
    }, [isGameOn])

    useEffect(() => {
        if(success === sequence.length && success > 0){
            setSpeed(speed - sequence.length * 2);
            setTimeout(() => {
                setSuccess(0);
                setPulses(0);
                setCurrentGame([]);
                randomNumber();
            }, 500)
        }
    }, [success]);

    useEffect(() => {
        if(!isAllowedToPlay){
            sequence.map((item, index) => {
                setTimeout(() => {
                    play({id : colors[item].sound})
                    colors[item].ref.current.style.opacity = (1);
                    setTimeout(() => {
                        colors[item].ref.current.style.opacity = (0.5);
                    }, speed / 2)
                }, speed * index);
            });
        }
        setIsAllowedToPlay(true);
    }, [sequence])

    return(
        <>
            {
                isGameOn 
                ?
                <>
                    <div className="header">
                        <h1>Turn {turn}</h1>
                    </div>
                    <div className="container">
                        {colors.map((item, index) => {
                            return (
                                <div    key = {index}
                                        ref = {item.ref}
                                        className = {`pad pad-${index}`} 
                                        style = {{backgroundColor: `${item.color}`, opacity: 0.6}}
                                        onClick = {() => handleClick(index)}
                                >
                                </div>
                            );
                        })}
                    </div>
                </>
                :
                <>
                    <div className="header">
                        <h1>SUPER SIMON</h1>
                    </div>
                    <button onClick={initGame}>START</button>
                </>
            }  
        </>
    )
}

