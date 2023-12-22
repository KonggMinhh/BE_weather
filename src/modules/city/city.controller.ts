import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    // Query,
} from '@nestjs/common';
import { CityService } from './city.service';
import { Observable } from 'rxjs';
import { CreateCityDto } from 'src/dto/city.dto';
// Controller nhận các request từ phía client gửi đến và response lại, response lấy data từ services
@Controller('weather')
export class CityController {
    constructor(private readonly cityService: CityService) {}

    // ========= Get city  ===========
    @Get(':city')
    getCity(@Param('city') city: string): Observable<any> {
        return this.cityService.getCity(city);
    }
    // ========= Get city by coord  ===========
    @Get(':lat/:lon')
    getCoordinates(
        @Param('lat') lat: string,
        @Param('lon') lon: string,
    ): Observable<any> {
        return this.cityService.getCoordinates(
            parseFloat(lat),
            parseFloat(lon),
        );
    }

    @Get('db/all')
    getAllCity() {
        return this.cityService.getAllCity();
    }
    @Get('db/:city')
    getCityDB(@Param('city') city: string) {
        return this.cityService.getCityDB(city);
    }
    @Post()
    createCity(@Body() createCityDto: CreateCityDto) {
        return this.cityService.createCity(createCityDto);
    }
    @Put('db/:city')
    updateCity(@Param('city') city: string, @Body() updateFields: any) {
        return this.cityService.updateCity(city, updateFields);
    }
    @Patch('db/:city')
    partialUpdateCity(
        @Param('city') city: string,
        @Body() partialUpdateFields: any,
    ) {
        return this.cityService.partialUpdateCity(city, partialUpdateFields);
    }
    @Delete('db/:city')
    deleteCity(@Param('city') city: string) {
        return this.cityService.deleteCity(city);
    }
}
