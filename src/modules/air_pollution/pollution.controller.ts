import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PollutionService } from './pollution.service';
import { AirQualityDTO } from 'src/dto/pollution.dto';
import { Pollution } from 'src/schema/pollution.schema';
@Controller('air_pollution')
export class PollutionController {
    constructor(private readonly pollutionService: PollutionService) {}
    // * * * Start Get Coord * * *
    @Get(':lat/:lon')
    getWeatherAndPollution(
        @Param('lat') lat: string,
        @Param('lon') lon: string,
    ): Observable<any> {
        return this.pollutionService.getPollution(
            parseFloat(lat),
            parseFloat(lon),
        );
    }
    // * * * End Get Coord * * *

    // * * * Start Get Pollution In Database * * *
    @Get('db/:lat/:lon')
    getPollutionDB(@Param('lat') lat: string, @Param('lon') lon: string) {
        const parsedLat = parseFloat(lat);
        const parsedLon = parseFloat(lon);

        return this.pollutionService.getPollutionDB(parsedLat, parsedLon);
    }
    // * * *  End Get Pollution In Database * * *

    // * * * Start Create New In Pollution * * *
    @Post()
    async createPollution(
        @Body() createPollutionDto: AirQualityDTO,
    ): Promise<Pollution> {
        return this.pollutionService.createPollution(createPollutionDto);
    }
    // * * * End Create New In Pollution * * *

    // * * * Start Patch Database * * *
    @Patch('db/:lat/:lon')
    async updatePatchPollution(
        @Param('lat') lat: string,
        @Param('lon') lon: string,
        @Body() updateFields: any,
    ) {
        try {
            const updatedData =
                await this.pollutionService.updatePatchPollutionData(
                    lat,
                    lon,
                    updateFields,
                );
            return { success: true, data: updatedData };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    // * * * End Patch Database * * *

    // * * * Start Delete Database * * *
    @Delete('db/:lat/:lon')
    deletePollution(@Param('lat') lat: string, @Param('lon') lon: string) {
        return this.pollutionService.deletePollution(lat, lon);
    }
    // * * * End Delete Database * * *
}
