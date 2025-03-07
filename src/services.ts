const apiGetCity = "6db384a6-1ccf-4be1-8245-0493bedd79de";
const apiGetCord = "e45a9477-be9b-429b-9920-c688301cfd52";

export const getCity = async (query: string): Promise<string[]> => {
    try {
        const response = await fetch(`https://suggest-maps.yandex.ru/v1/suggest?apikey=${apiGetCity}&text=${query}&results=4&types=locality`) // Поставил 4 города чтобы выдавало
        const data = await response.json()
        console.log('Получаем города')
        return data.results.map((item: any) => item.title.text)
    }
    catch (error) {
        console.log("Не получили города",error)
        return[];
    }
}

export const getCord = async (position: string): Promise<string[]> => {
    try {
        const response = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${apiGetCord}&geocode=${position}&format=json`)
        const data = await response.json()
        console.log('Получаем координаты')
        return data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
    }
    catch (error) {
        console.log("Не получили координаты",error)
        return[];
    }
}