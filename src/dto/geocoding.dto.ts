import {
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LocalNamesDTO {
    @IsNotEmpty()
    @IsString()
    ascii: string;

    @IsNotEmpty()
    @IsString()
    feature_name: string;
}

export class GeocodingDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => LocalNamesDTO)
    local_names: Record<string, LocalNamesDTO>;

    @IsNotEmpty()
    @IsNumber()
    lat: number;

    @IsNotEmpty()
    @IsNumber()
    lon: number;

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsString()
    state?: string;
}
