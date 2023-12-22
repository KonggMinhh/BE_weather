import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GeocodingService } from './geocoding.service';
@Controller('geo')
export class GeocodingController {
    constructor(private readonly geocodingService: GeocodingService) {}
    @Get(':city')
    getWeather(@Param('city') city: string): Observable<any> {
        return this.geocodingService.getGeocoding(city);
    }
}
