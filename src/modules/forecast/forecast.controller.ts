import { Controller, Get, Param } from '@nestjs/common';
import { ForecastService } from './forecast.service';
import { Observable } from 'rxjs';

@Controller('forecast')
export class ForecastController {
    constructor(private readonly forecastService: ForecastService) {}

    // * * *  Get Coord * * *
    @Get(':lat/:lon')
    getForecast(
        @Param('lat') lat: string,
        @Param('lon') lon: string,
    ): Observable<any> {
        return this.forecastService.getFiveDayForecast(
            parseFloat(lat),
            parseFloat(lon),
        );
    }
    // * * * Get Forecast City * * *
    @Get(':city')
    getCity(@Param('city') city: string): Observable<any> {
        return this.forecastService.getFiveDayCityForecast(city);
    }
}
