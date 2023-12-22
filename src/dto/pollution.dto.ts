// air-quality.dto.ts
import { IsArray, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ComponentsDTO {
    @IsNumber()
    co: number;

    @IsNumber()
    no: number;

    @IsNumber()
    no2: number;

    @IsNumber()
    o3: number;

    @IsNumber()
    so2: number;

    @IsNumber()
    pm2_5: number;

    @IsNumber()
    pm10: number;

    @IsNumber()
    nh3: number;
}

export class AirQualityItemDTO {
    @IsNumber()
    dt: number;

    @IsObject()
    @ValidateNested()
    @Type(() => ComponentsDTO)
    components: ComponentsDTO;
}

export class AirQualityDTO {
    @IsArray()
    @Type(() => Number)
    coord: number[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AirQualityItemDTO)
    list: AirQualityItemDTO[];
}
