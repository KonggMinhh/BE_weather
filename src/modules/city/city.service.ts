import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Observable, catchError, throwError } from 'rxjs';
import { City } from '../../schema/city.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCityDto } from 'src/dto/city.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
@Injectable()
export class CityService {
    private readonly apiKey = '9bbc9de017cfa48a70c5390c42bc83c1';
    private readonly apiUrl = 'http://api.openweathermap.org/data/2.5';
    constructor(@InjectModel(City.name) private weatherModel: Model<City>) {}

    // Get coordinates in city
    @Cron(CronExpression.EVERY_5_MINUTES)
    getCoordinates(lat: number, lon: number): Observable<any> {
        const url = `${this.apiUrl}/weather/?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
        return new Observable((observer) => {
            axios
                .get(url)
                .then(async (response: AxiosResponse) => {
                    const coordinatesData = response.data;
                    await this.saveGeoToDatabase(lat, lon, coordinatesData); // Save lat, lon to MongoDB
                    observer.next(coordinatesData);
                    observer.complete();
                })
                .catch((error) => {
                    observer.error(error);
                    return throwError(() => error);
                });
        });
    }
    // Save lat, lon in database
    async saveGeoToDatabase(
        lat: number,
        lon: number,
        weatherData: any,
    ): Promise<void> {
        const cityRecord = new this.weatherModel({
            city: weatherData.name || 'YourCityName', // Use city name from data or replace with a default name
            coord: {
                lat,
                lon,
            },
            weather: Array.isArray(weatherData.weather)
                ? weatherData.weather.map((item) => ({
                      id: item.id,
                      main: item.main,
                      description: item.description,
                      icon: item.icon,
                  }))
                : [],
            main: {
                temp: weatherData.main?.temp || 0,
                feels_like: weatherData.main?.feels_like || 0,
                temp_min: weatherData.main?.temp_min || 0,
                temp_max: weatherData.main?.temp_max || 0,
                pressure: weatherData.main?.pressure || 0,
                humidity: weatherData.main?.humidity || 0,
            },
            wind: {
                speed: weatherData.wind?.speed || 0,
                deg: weatherData.wind?.deg || 0,
                gust: weatherData.wind?.gust || 0,
            },
            clouds: {
                all: weatherData.clouds?.all || 0,
            },
            sys: {
                typeValue: weatherData.sys?.type || 0,
                id: weatherData.sys?.id || 0,
                country: weatherData.sys?.country || '',
                sunrise: weatherData.sys?.sunrise || 0,
                sunset: weatherData.sys?.sunset || 0,
                timezone: weatherData.timezone || 0,
            },
        });

        await cityRecord.save();
    }

    // Get Weather in City
    @Cron(CronExpression.EVERY_5_MINUTES)
    getCity(city: string): Observable<any> {
        const url = `${this.apiUrl}/weather/?q=${city}&appid=${this.apiKey}`;
        return new Observable((observer) => {
            axios
                .get(url)
                .then((response: AxiosResponse) => {
                    const weatherData = response.data;
                    this.saveWeatherToDatabase(city, weatherData); // Lưu vào MongoDB
                    observer.next(weatherData);
                    observer.complete();
                })
                .catch((error) => {
                    observer.error(error);
                });
        }).pipe(catchError((error) => throwError(() => error)));
    }
    // Save city in database
    private async saveWeatherToDatabase(
        city: string,
        weatherData: any,
    ): Promise<void> {
        const cityRecord = new this.weatherModel({
            city: city || 'YourCityName', // Use city name from the API response or replace with a default name
            coord: {
                lat: weatherData.coord?.lat || 0,
                lon: weatherData.coord?.lon || 0,
            },
            weather: Array.isArray(weatherData.weather)
                ? weatherData.weather.map((item) => ({
                      id: item.id,
                      main: item.main,
                      description: item.description,
                      icon: item.icon,
                  }))
                : [],
            main: {
                temp: weatherData.main?.temp || 0,
                feels_like: weatherData.main?.feels_like || 0,
                temp_min: weatherData.main?.temp_min || 0,
                temp_max: weatherData.main?.temp_max || 0,
                pressure: weatherData.main?.pressure || 0,
                humidity: weatherData.main?.humidity || 0,
            },
            wind: {
                speed: weatherData.wind?.speed || 0,
                deg: weatherData.wind?.deg || 0,
                gust: weatherData.wind?.gust || 0,
            },
            clouds: {
                all: weatherData.clouds?.all || 0,
            },
            sys: {
                typeValue: weatherData.sys?.type || 0,
                id: weatherData.sys?.id || 0,
                country: weatherData.sys?.country || '',
                sunrise: weatherData.sys?.sunrise || 0,
                sunset: weatherData.sys?.sunset || 0,
                timezone: weatherData.timezone || 0,
            },
        });

        await cityRecord.save();
    }

    // Create city new database
    async createCity(createWeatherDto: CreateCityDto): Promise<City> {
        const createdWeather = new this.weatherModel(createWeatherDto);
        return createdWeather.save();
    }
    // Get city in database
    async getCityDB(city: string): Promise<City> {
        return this.weatherModel.findOne({ city }).exec();
    }
    // Put Update city in database
    async updateCity(city: string, updateFields: any): Promise<City> {
        const updatedWeather = await this.weatherModel.findOneAndUpdate(
            { city },
            { $set: { data: { ...updateFields } } },
            { new: true },
        );

        if (!updatedWeather) {
            throw new Error(`Weather data for ${city} not found`);
        }
        return updatedWeather;
    }
    // Delete city in database
    async deleteCity(city: string): Promise<City> {
        const result = await this.weatherModel.deleteOne({ city });
        if (result.deletedCount === 1) {
            return { city } as City;
        } else {
            throw new Error(
                `Weather data for ${city} not found or not deleted`,
            );
        }
    }
    // Path city in database
    async partialUpdateCity(
        city: string,
        partialUpdateFields: any,
    ): Promise<City> {
        const updatedWeather = await this.weatherModel.findOneAndUpdate(
            { city },
            {
                $set: {
                    'data.coord': partialUpdateFields.coord,
                    'data.weather': partialUpdateFields.weather,
                    'data.main': partialUpdateFields.main,
                    'data.wind': partialUpdateFields.wind,
                    'data.sys': partialUpdateFields.sys,
                    'data.id': partialUpdateFields.id,
                    'data.name': partialUpdateFields.name,
                },
            },
            { new: true },
        );

        if (!updatedWeather) {
            throw new Error(`Weather data for ${city} not found`);
        }

        return updatedWeather;
    }
    // Get all city in database
    async getAllCity(): Promise<City[]> {
        return this.weatherModel.find().exec();
    }
}
