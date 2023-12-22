import { Module } from '@nestjs/common';
import { GeocodingController } from './geocoding.controller';
import { GeocodingService } from './geocoding.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Geocoding, GeocodingSchema } from 'src/schema/geocoding.schema';
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Geocoding.name, schema: GeocodingSchema },
        ]),
    ],
    controllers: [GeocodingController],
    providers: [GeocodingService],
    exports: [GeocodingService],
})
export class GeocodingModule {}
