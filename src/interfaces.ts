export interface Coords {
    lat: number;
    lon: number;
}

export interface InputBoxProps {
    label: string;
    name: string;
    onSuggestionClick: (name: string, suggestion: string) => void;
    inputClear: (name: string) => void;
}