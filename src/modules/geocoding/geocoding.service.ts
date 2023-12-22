import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { Observable, catchError, throwError } from 'rxjs';
import { Geocoding } from 'src/schema/geocoding.schema';
@Injectable()
export class GeocodingService {
    private readonly apiKey = '9bbc9de017cfa48a70c5390c42bc83c1';
    private readonly apiUrl = 'http://api.openweathermap.org/geo/1.0/direct';
    constructor(
        @InjectModel(Geocoding.name)
        private geocodingModel: Model<Geocoding>,
    ) {}
    // Call api and save database
    getGeocoding(city: string): Observable<any> {
        const url = `${this.apiUrl}?q=${city}&limit=5&appid=${this.apiKey}`;

        return new Observable((observer) => {
            axios
                .get(url)
                .then(async (response: AxiosResponse) => {
                    const geocodingData = response.data;
                    await this.saveToDatabase(geocodingData);
                    observer.next(geocodingData);
                    observer.complete();
                })
                .catch((error) => {
                    observer.error(error);
                });
        }).pipe(catchError((error) => throwError(() => error)));
    }
    private async saveToDatabase(geocodingDataArray: any[]): Promise<any[]> {
        try {
            const savedDataArray = [];

            for (const geocodingData of geocodingDataArray) {
                const { name, local_names, lat, lon, country } = geocodingData;

                const geocodingInstance = new this.geocodingModel({
                    name,
                    local_names,
                    lat,
                    lon,
                    country,
                });

                const savedData = await geocodingInstance.save();
                savedDataArray.push(savedData);
            }

            return savedDataArray;
        } catch (error) {
            console.error('Error saving to database:', error);
            throw error; // Rethrow the error to handle it at a higher level if needed
        }
    }
}
