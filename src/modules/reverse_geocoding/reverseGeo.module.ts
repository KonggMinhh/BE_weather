import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReverseGeocodingService } from './reverseGeo.service';
import { ReverseGeocodingController } from './reverseGeo.controller';
import {
    ReverseGeocoding,
    ReverseGeocodingSchema,
} from 'src/schema/reverseGeocoding';
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ReverseGeocoding.name, schema: ReverseGeocodingSchema },
        ]),
    ],
    controllers: [ReverseGeocodingController],
    providers: [ReverseGeocodingService],
    exports: [ReverseGeocodingService],
})
export class ReverseGeocodingModule {}
