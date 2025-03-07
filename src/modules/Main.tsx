import React, {useCallback, useEffect, useState} from "react";
import {getCord} from "../services";
import {getDistance} from "../utils";
import InputBox from "./Input";
import {Coords} from "../interfaces";

const MainDistance: React.FC = () => {
    const [firstCoord, setFirstCoord] = useState<Coords | null>(null);
    const [secondCoord, setSecondCoord] = useState<Coords | null>(null);
    const [distance, setDistance] = useState<number | null>(null);

    const handleSuggestionClick = async (inputName: string, suggestion: string) => {
        try {
            const coords: any = await getCord(suggestion);
            if (!coords) return;

            const [lat, lon] = coords.split(' ').map(Number);
            if (isNaN(lat) || isNaN(lon)) return;

            const newCoord = { lat, lon };
            inputName === 'firstCity' ? setFirstCoord(newCoord) : setSecondCoord(newCoord);

        } catch (error) {
            console.error('Ошибка с координатами', error);
        }
    };

    const clearCoord = useCallback((inputName: string) => {
        inputName === 'firstCity' ? setFirstCoord(null) : setSecondCoord(null);
    }, []);

    useEffect(() => {
        if (firstCoord === null || secondCoord === null) {
            setDistance(null);
        } else {
            const result = getDistance(firstCoord, secondCoord);
            setDistance(Math.round(result));
        }
    }, [firstCoord, secondCoord]);

    return (
        <div className="container">
            <span className="hide-name">Калькулятор расстояния</span>
            <div className="input-index">
                <InputBox
                    label="Откуда"
                    name="firstCity"
                    onSuggestionClick={handleSuggestionClick}
                    inputClear={clearCoord}
                />

                <InputBox
                    label="Куда"
                    name="secondCity"
                    onSuggestionClick={handleSuggestionClick}
                    inputClear={clearCoord}
                />

                <div className="distantion">
                    <span className="text-input">Расстояние:</span>
                    <span className="distantion-data">
            {(distance === null ? '—' : `${distance} км`)}
          </span>
                </div>
            </div>
        </div>
    );
};

export default MainDistance;