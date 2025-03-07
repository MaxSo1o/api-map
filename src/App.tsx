import React, {useState, useCallback, useEffect, useMemo} from 'react';
import { getCord, getCity } from './services';
import {debounce, getDistance} from "./utils";

interface Coords {
    lat: number;
    lon: number;
}

interface InputBoxProps {
    label: string;
    name: string;
    onSuggestionClick: (name: string, suggestion: string) => void;
    inputClear: (name: string) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ label, name, onSuggestionClick, inputClear }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [show, setShow] = useState(false);


    const debouncedSearch = useMemo(() =>
        debounce (async (val: string) => {
        if (val.trim().length > 0) {
            const suggestions = await getCity(val);
            setSuggestions(suggestions);
            setShow(true);
        }
        if (val.trim() === '')
        {
            setSuggestions([]);
            setShow(false);
            inputClear(name)
        }
    }, 200), [inputClear, name]);

    const handleChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setInputValue(value);
        debouncedSearch(value);
    }, [debouncedSearch]);

    const handleSuggestionClick = useCallback((suggestion: string) => {
        onSuggestionClick(name, suggestion);
        setInputValue(suggestion);
        setSuggestions([]);
    }, [name, onSuggestionClick]);

    const handleBlur = useCallback(() => {
        setTimeout(() => setShow(false), 200);
    }, []);

    return (
        <div className="input-box">
            <span className="text-input">{label}:</span>
            <input
                name={name}
                value={inputValue}
                onFocus={() => setShow(true)}
                onBlur={handleBlur}
                onChange={handleChange}
            />
            {show && suggestions.length > 0 && (
                <div className="suggestions-container">
                    <ul className="hide-city">
                        {suggestions.map((suggestion, index) => (
                            <li key={index} onMouseDown={() => handleSuggestionClick(suggestion)}>
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                </div>
            )
            }
        </div>
    );
};

const DistanceMap: React.FC = () => {
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

export default DistanceMap;