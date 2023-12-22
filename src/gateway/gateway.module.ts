import { Module } from '@nestjs/common';
import { MyGateway } from './event.gateway';
import { CityModule } from 'src/modules/city/city.module';
import { GeocodingModule } from 'src/modules/geocoding/geocoding.module';
import { ReverseGeocodingModule } from 'src/modules/reverse_geocoding/reverseGeo.module';
import { ForecastModule } from 'src/modules/forecast/forecast.module';
import { PollutionModule } from 'src/modules/air_pollution/pollution.module';

@Module({
    imports: [
        CityModule,
        GeocodingModule,
        ReverseGeocodingModule,
        ForecastModule,
        PollutionModule,
    ],
    providers: [MyGateway],
    exports: [MyGateway],
})
export class GatewayModule {}
