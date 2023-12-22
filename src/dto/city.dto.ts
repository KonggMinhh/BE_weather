import { IsString, IsObject, IsNumber, ValidateNested } from 'class-validator';

class CoordDto {
    @IsNumber()
    lon: number;

    @IsNumber()
    lat: number;
}

class WeatherDto {
    @IsNumber()
    id: number;

    @IsString()
    main: string;

    @IsString()
    description: string;

    @IsString()
    icon: string;
}

class MainDto {
    @IsNumber()
    temp: number;

    @IsNumber()
    feels_like: number;

    @IsNumber()
    temp_min: number;

    @IsNumber()
    temp_max: number;

    @IsNumber()
    pressure: number;

    @IsNumber()
    humidity: number;
}

class WindDto {
    @IsNumber()
    speed: number;

    @IsNumber()
    deg: number;

    @IsNumber()
    gust: number;
}

class CloudsDto {
    @IsNumber()
    all: number;
}

class SysDto {
    @IsNumber()
    type: number;

    @IsNumber()
    id: number;

    @IsString()
    country: string;

    @IsNumber()
    sunrise: number;

    @IsNumber()
    sunset: number;

    @IsNumber()
    timezone: number;
}

export class CreateCityDto {
    @IsString()
    city: string;

    @IsObject()
    @ValidateNested()
    coord: CoordDto;

    @IsObject()
    @ValidateNested()
    weather: WeatherDto[];

    @IsObject()
    @ValidateNested()
    main: MainDto;

    @IsObject()
    @ValidateNested()
    wind: WindDto;

    @IsObject()
    @ValidateNested()
    clouds: CloudsDto;

    @IsObject()
    @ValidateNested()
    sys: SysDto;
}
