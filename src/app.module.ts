import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CityModule } from './modules/city/city.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { City, CitySchema } from './schema/city.schema';
import { ForecastModule } from './modules/forecast/forecast.module';
import { Forecast, ForecastSchema } from './schema/forecast.schema';
import { PollutionModule } from './modules/air_pollution/pollution.module';
import { Pollution, PollutionSchema } from './schema/pollution.schema';
import { GeocodingModule } from './modules/geocoding/geocoding.module';
import { Geocoding, GeocodingSchema } from './schema/geocoding.schema';
import { GatewayModule } from './gateway/gateway.module';
import { ReverseGeocodingModule } from './modules/reverse_geocoding/reverseGeo.module';
import { ScheduleModule } from '@nestjs/schedule';
import {
    ReverseGeocoding,
    ReverseGeocodingSchema,
} from './schema/reverseGeocoding';

@Module({
    imports: [
        GatewayModule,
        CityModule,
        ForecastModule,
        PollutionModule,
        GeocodingModule,
        ReverseGeocodingModule,
        ScheduleModule.forRoot(),
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB_URL),
        MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
        MongooseModule.forFeature([
            { name: Forecast.name, schema: ForecastSchema },
        ]),
        MongooseModule.forFeature([
            { name: Pollution.name, schema: PollutionSchema },
        ]),
        MongooseModule.forFeature([
            { name: Geocoding.name, schema: GeocodingSchema },
        ]),
        MongooseModule.forFeature([
            { name: ReverseGeocoding.name, schema: ReverseGeocodingSchema },
        ]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
