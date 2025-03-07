import React, {useCallback, useMemo, useState} from "react";
import {debounce} from "../utils";
import {getCity} from "../services";
import {InputBoxProps} from "../interfaces";

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

export default InputBox;