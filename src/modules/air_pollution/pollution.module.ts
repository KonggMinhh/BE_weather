import { Module } from '@nestjs/common';
import { PollutionController } from './pollution.controller';
import { PollutionService } from './pollution.service';
import { Pollution, PollutionSchema } from 'src/schema/pollution.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Pollution.name, schema: PollutionSchema },
        ]),
    ],
    controllers: [PollutionController],
    providers: [PollutionService],
    exports: [PollutionService],
})
export class PollutionModule {}
