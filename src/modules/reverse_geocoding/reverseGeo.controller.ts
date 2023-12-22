import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ReverseGeocodingService } from './reverseGeo.service';
@Controller('reverse')
export class ReverseGeocodingController {
    constructor(
        private readonly reverseGeocodingService: ReverseGeocodingService,
    ) {}
    @Get(':lat/:lon')
    getWeatherAndPollution(
        @Param('lat') lat: string,
        @Param('lon') lon: string,
    ): Observable<any> {
        return this.reverseGeocodingService.getReverseGeocoding(
            parseFloat(lat),
            parseFloat(lon),
        );
    }
}
