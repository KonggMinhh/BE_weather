import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios, { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { Observable, catchError, throwError } from 'rxjs';
import { AirQualityDTO } from 'src/dto/pollution.dto';
import { Pollution } from 'src/schema/pollution.schema';
@Injectable()
export class PollutionService {
    private readonly apiKey = '9bbc9de017cfa48a70c5390c42bc83c1';
    private readonly apiUrl = 'http://api.openweathermap.org/data/2.5';
    constructor(
        @InjectModel(Pollution.name) private pollutionModel: Model<Pollution>,
    ) {}
    // * * * Start Call Api And Save Database * * *
    @Cron(CronExpression.EVERY_5_MINUTES)
    getPollution(lat: number, lon: number): Observable<any> {
        const url = `${this.apiUrl}/air_pollution?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;

        return new Observable((observer) => {
            axios
                .get(url)
                .then(async (response: AxiosResponse) => {
                    const pollutionData = response.data;
                    await this.saveWeatherToDatabase(pollutionData, lon, lat);
                    observer.next(pollutionData);
                    observer.complete();
                })
                .catch((error) => {
                    observer.error(error);
                });
        }).pipe(catchError((error) => throwError(() => error)));
    }
    // Function save database
    async saveWeatherToDatabase(
        pollutionData: any,
        lat: number,
        lon: number,
    ): Promise<any> {
        try {
            if (lon !== undefined && lat !== undefined) {
                const pollution = new this.pollutionModel({
                    coord: [lon, lat],
                    list: pollutionData.list,
                });

                const savedData = await pollution.save();
                return savedData;
            } else {
                throw new Error('Error: lon or lat is undefined');
            }
        } catch (error) {
            console.error(`Error saving weather data: ${error.message}`);
            throw error;
        }
    }
    // * * * End Call Api And Save Database * * *

    // * * * Start Get Pollution In Database * * *
    async getPollutionDB(lat: number, lon: number): Promise<Pollution | null> {
        try {
            const pollution = await this.pollutionModel
                .findOne({ 'coord.0': lon, 'coord.1': lat })
                .exec();
            return pollution;
        } catch (error) {
            console.error('Error fetching pollution from the database:', error);
            return null;
        }
    }
    // * * * End Get Pollution In Database * * *

    // * * * Start Create New Database * * *
    async createPollution(
        createPollutionDto: AirQualityDTO,
    ): Promise<Pollution> {
        const createdPollution = new this.pollutionModel(createPollutionDto);
        return createdPollution.save();
    }
    // * * * End Create New Database * * *

    // * * * Start Path Database * * *
    async updatePatchPollutionData(
        lat: string,
        lon: string,
        updateFields: any,
    ): Promise<Pollution> {
        try {
            const updatedData = await this.pollutionModel.findOneAndUpdate(
                { 'coord.0': parseFloat(lon), 'coord.1': parseFloat(lat) },
                {
                    $set: {
                        'list.$[element].main.aqi': updateFields.aqi,
                        'list.$[element].components.co': updateFields.co,
                        'list.$[element].components.no': updateFields.no,
                        'list.$[element].components.no2': updateFields.no2,
                        'list.$[element].components.o3': updateFields.o3,
                        'list.$[element].components.pm2_5': updateFields.pm2_5,
                        'list.$[element].components.pm10': updateFields.pm10,
                        'list.$[element].components.nh3': updateFields.nh3,
                    },
                },
                {
                    new: true,
                    arrayFilters: [{ 'element.dt': updateFields.dt }],
                },
            );

            if (!updatedData) {
                throw new Error(`Pollution data for ${lat} not found`);
            }

            return updatedData;
        } catch (error) {
            console.error('Error updating pollution data:', error);
            throw error;
        }
    }
    // * * * End Path Database * * *

    // * * * Start Delete Database * * *
    async deletePollution(lat: string, lon: string): Promise<Pollution> {
        try {
            const deletedPollution = await this.pollutionModel
                .findOneAndDelete({
                    'coord.0': parseFloat(lon),
                    'coord.1': parseFloat(lat),
                })
                .lean();

            if (!deletedPollution) {
                throw new Error(`Pollution data for ${lat} not found`);
            }

            // The result is now a plain JavaScript object, so the cast to Pollution is safe
            return deletedPollution as Pollution;
        } catch (error) {
            console.error('Error deleting pollution data:', error);
            throw error;
        }
    }
    // * * * End Delete Database * * *
}
