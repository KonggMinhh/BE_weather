import { Module } from '@nestjs/common';
import { ForecastController } from './forecast.controller';
import { ForecastService } from './forecast.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Forecast, ForecastSchema } from 'src/schema/forecast.schema';
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Forecast.name, schema: ForecastSchema },
        ]),
    ],
    controllers: [ForecastController],
    providers: [ForecastService],
    exports: [ForecastService],
})
export class ForecastModule {}
