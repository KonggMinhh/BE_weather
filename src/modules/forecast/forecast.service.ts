import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { Observable, catchError, throwError } from 'rxjs';
import { Forecast } from 'src/schema/forecast.schema';

@Injectable()
export class ForecastService {
    private readonly apiKey = '9bbc9de017cfa48a70c5390c42bc83c1';
    private readonly apiUrl = 'http://api.openweathermap.org/data/2.5';
    constructor(
        @InjectModel(Forecast.name) private forecastModel: Model<Forecast>,
    ) {}
    // * * * Start Get Coord Forecast * * *
    getFiveDayForecast(lat: number, lon: number): Observable<any> {
        const url = `${this.apiUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
        return new Observable((observer) => {
            axios
                .get(url)
                .then((response: AxiosResponse) => {
                    const forecastData = response.data;

                    // Save to MongoDB
                    this.saveForecastToDatabase(lon, lat, forecastData);

                    observer.next(forecastData);
                    observer.complete();
                })
                .catch((error) => {
                    observer.error(error);
                });
        }).pipe(catchError((error) => throwError(() => error)));
    }

    // * * * End Get Coord Forecast * * *

    async saveForecastToDatabase(
        lat: number,
        lon: number,
        forecastData: any,
    ): Promise<void> {
        try {
            const existingForecast = await this.forecastModel.findOne({
                lat,
                lon,
            });

            if (existingForecast) {
                // If the record exists, update its data
                existingForecast.dt = forecastData.dt || Date.now();
                existingForecast.main = forecastData.main;
                existingForecast.weather = forecastData.weather;
                existingForecast.clouds = forecastData.clouds;
                existingForecast.wind = forecastData.wind;
                existingForecast.visibility = forecastData.visibility;
                existingForecast.pop = forecastData.pop;
                existingForecast.rain = forecastData.rain;
                existingForecast.sys = forecastData.sys;
                existingForecast.dt_txt = forecastData.dt_txt;

                await existingForecast.save();
            } else {
                // If the record doesn't exist, create a new one
                const forecastRecord = new this.forecastModel({
                    lat,
                    lon,
                    dt: forecastData.dt || Date.now(),
                    main: forecastData.main,
                    weather: forecastData.weather,
                    clouds: forecastData.clouds,
                    wind: forecastData.wind,
                    visibility: forecastData.visibility,
                    pop: forecastData.pop,
                    rain: forecastData.rain,
                    sys: forecastData.sys,
                    dt_txt: forecastData.dt_txt,
                });

                await forecastRecord.save();
            }
        } catch (error) {
            // Handle error appropriately
            console.error('Error saving forecast to database:', error.message);
            throw error;
        }
    }

    // * * * Start Get City Forecast * * *
    getFiveDayCityForecast(city: string): Observable<any> {
        const url = `${this.apiUrl}/forecast?q=${city}&units=metric&appid=${this.apiKey}`;
        return new Observable((observer) => {
            axios
                .get(url)
                .then((response: AxiosResponse) => {
                    const forecastData = response.data;

                    // Save to MongoDB
                    // this.saveForecastToDatabase(lon, lat, forecastData);

                    observer.next(forecastData);
                    observer.complete();
                })
                .catch((error) => {
                    observer.error(error);
                });
        }).pipe(catchError((error) => throwError(() => error)));
    }

    // asyn saveForecastToDatabase(
    //     city: string,
    //     forecastData: ForecastItemDto[],
    // ): Promise<void> {
    //     // Thực hiện bất kỳ xử lý nào bạn cần trước khi lưu vào cơ sở dữ liệu
    //     const forecastRecord = new this.forecastModel({
    //         city,
    //         data: forecastData,
    //     });

    //     await forecastRecord.save();
    // }
}
