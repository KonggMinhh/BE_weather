import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { Observable, catchError, throwError } from 'rxjs';
import { Forecast } from 'src/schema/forecast.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
@Injectable()
export class ForecastService {
    private readonly apiKey = '9bbc9de017cfa48a70c5390c42bc83c1';
    private readonly apiUrl = 'http://api.openweathermap.org/data/2.5';
    constructor(
        @InjectModel(Forecast.name) private forecastModel: Model<Forecast>,
    ) {}
    // * * * Start Get Coord Forecast * * *
    @Cron(CronExpression.EVERY_5_MINUTES)
    getFiveDayForecast(lat: number, lon: number): Observable<any> {
        const url = `${this.apiUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
        return new Observable((observer) => {
            axios
                .get(url)
                .then((response: AxiosResponse) => {
                    const forecastData = response.data;

                    // Save to MongoDB
                    this.saveForecastToDatabase(lat, lon, forecastData.list);
                    observer.next(forecastData);
                    observer.complete();
                })
                .catch((error) => {
                    observer.error(error);
                });
        }).pipe(catchError((error) => throwError(() => error)));
    }
    // Save Database
    async saveForecastToDatabase(
        lat: number,
        lon: number,
        dataList: any[],
    ): Promise<any[]> {
        const weatherDocuments = dataList.map((item) => {
            return {
                lat: lat,
                lon: lon,
                dt: item.dt,
                main: {
                    temp: item.main.temp,
                    feels_like: item.main.feels_like,
                    temp_min: item.main.temp_min,
                    temp_max: item.main.temp_max,
                    pressure: item.main.pressure,
                    sea_level: item.main.sea_level,
                    grnd_level: item.main.grnd_level,
                    humidity: item.main.humidity,
                    temp_kf: item.main.temp_kf,
                },
                weather: item.weather.map((condition) => {
                    return {
                        id: condition.id,
                        main: condition.main,
                        description: condition.description,
                        icon: condition.icon,
                    };
                }),
                clouds: {
                    all: item.clouds.all,
                },
                wind: {
                    speed: item.wind.speed,
                    deg: item.wind.deg,
                    gust: item.wind.gust,
                },
                visibility: { all: item.visibility }, // Đảm bảo giữ nguyên kiểu dữ liệu của visibility
                pop: { all: item.pop }, // Đảm bảo giữ nguyên kiểu dữ liệu của pop
                rain: item.rain ? { '3h': item.rain['3h'] } : undefined,
                sys: {
                    pod: item.sys.pod,
                },
                dt_txt: item.dt_txt,
            };
        });

        try {
            const insertedDocuments =
                await this.forecastModel.insertMany(weatherDocuments);
            return insertedDocuments; // Trả về mảng các document đã được chèn vào MongoDB
        } catch (error) {
            console.error('Lỗi khi lưu dữ liệu thời tiết vào MongoDB:', error);
            throw new Error('Không thể lưu dữ liệu thời tiết vào MongoDB');
        }
    }
    // * * * End Get Coord Forecast * * *

    // * * * Start Get City Forecast * * *
    @Cron(CronExpression.EVERY_5_MINUTES)
    getFiveDayCityForecast(city: string): Observable<any> {
        const url = `${this.apiUrl}/forecast?q=${city}&units=metric&appid=${this.apiKey}`;
        return new Observable((observer) => {
            axios
                .get(url)
                .then((response: AxiosResponse) => {
                    const forecastData = response.data;

                    // Save to MongoDB
                    this.saveForecastDatabase(city, forecastData.list);

                    observer.next(forecastData);
                    observer.complete();
                })
                .catch((error) => {
                    observer.error(error);
                });
        }).pipe(catchError((error) => throwError(() => error)));
    }
    // Save Database
    async saveForecastDatabase(city: string, dataList: any[]): Promise<any[]> {
        const weatherDocuments = dataList.map((item) => {
            return {
                city: city,
                dt: item.dt,
                main: {
                    temp: item.main.temp,
                    feels_like: item.main.feels_like,
                    temp_min: item.main.temp_min,
                    temp_max: item.main.temp_max,
                    pressure: item.main.pressure,
                    sea_level: item.main.sea_level,
                    grnd_level: item.main.grnd_level,
                    humidity: item.main.humidity,
                    temp_kf: item.main.temp_kf,
                },
                weather: item.weather.map((condition) => {
                    return {
                        id: condition.id,
                        main: condition.main,
                        description: condition.description,
                        icon: condition.icon,
                    };
                }),
                clouds: {
                    all: item.clouds.all,
                },
                wind: {
                    speed: item.wind.speed,
                    deg: item.wind.deg,
                    gust: item.wind.gust,
                },
                visibility: { all: item.visibility }, // Đảm bảo giữ nguyên kiểu dữ liệu của visibility
                pop: { all: item.pop }, // Đảm bảo giữ nguyên kiểu dữ liệu của pop
                rain: item.rain ? { '3h': item.rain['3h'] } : undefined,
                sys: {
                    pod: item.sys.pod,
                },
                dt_txt: item.dt_txt,
            };
        });

        try {
            const insertedDocuments =
                await this.forecastModel.insertMany(weatherDocuments);
            return insertedDocuments; // Trả về mảng các document đã được chèn vào MongoDB
        } catch (error) {
            console.error('Lỗi khi lưu dữ liệu thời tiết vào MongoDB:', error);
            throw new Error('Không thể lưu dữ liệu thời tiết vào MongoDB');
        }
    }
}
