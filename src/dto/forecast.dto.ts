export class ForecastDto {
    readonly dt: number;
    readonly main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        sea_level: number;
        grnd_level: number;
        humidity: number;
        temp_kf: number;
    };
    readonly weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];
    readonly clouds: {
        all: number;
    };
    readonly wind: {
        speed: number;
        deg: number;
        gust: number;
    };
    readonly visibility: number;
    readonly pop: number;
    readonly rain?: {
        '3h': number;
    };
    readonly sys: {
        pod: string;
    };
    readonly dt_txt: string;
}
