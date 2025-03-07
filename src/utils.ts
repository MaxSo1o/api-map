interface Coords {
    lat: number;
    lon: number;
}

export const debounce = (fn: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

//Формулу брал с интернета
export const getDistance = (first: Coords, second: Coords): number => {
    const R = 6371;
    const dLat = (second.lat - first.lat) * Math.PI / 180;
    const dLon = (second.lon - first.lon) * Math.PI / 180;
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(first.lat * Math.PI / 180) * Math.cos(second.lat * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};