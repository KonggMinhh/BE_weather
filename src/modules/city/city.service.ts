import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Observable, catchError, throwError } from 'rxjs';
import { City } from '../../schema/city.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCityDto } from 'src/dto/city.dto';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class CityService {
    private readonly apiKey = '9bbc9de017cfa48a70c5390c42bc83c1';
    private readonly apiUrl = 'http://api.openweathermap.org/data/2.5';
    constructor(@InjectModel(City.name) private weatherModel: Model<City>) {}

    // Get coordinates in city
    @Cron('*/5 * * * * *')
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
    private async saveGeoToDatabase(
        lat: number,
        lon: number,
        weatherData: any[],
    ): Promise<void> {
        const existingWeather = await this.weatherModel.findOne({ lat, lon });

        if (!existingWeather) {
            const weatherRecord = new this.weatherModel({
                lat,
                lon,
                data: weatherData,
            });
            await weatherRecord.save();
        }
    }
    // Get Weather in City
    @Cron('*/5 * * * * *')
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
        weatherData: any[],
    ): Promise<void> {
        const existingWeather = await this.weatherModel.findOne({ city });

        if (!existingWeather) {
            const weatherRecord = new this.weatherModel({
                city,
                data: weatherData,
            });
            await weatherRecord.save();
        }
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
            return { city, data: {} } as City;
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
