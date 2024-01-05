import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

interface Main {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
}

interface WeatherCondition {
    id: number;
    main: string;
    description: string;
    icon: string;
}

interface Clouds {
    all: number;
}

interface Wind {
    speed: number;
    deg: number;
    gust: number;
}

interface Rain {
    '3h': number;
}

interface Sys {
    pod: string;
}

@Schema({ timestamps: true })
export class Forecast extends Document {
    @Prop()
    dt: number;

    @Prop({
        type: {
            temp: Number,
            feels_like: Number,
            temp_min: Number,
            temp_max: Number,
            pressure: Number,
            sea_level: Number,
            grnd_level: Number,
            humidity: Number,
            temp_kf: Number,
        },
    })
    main: Main;

    @Prop()
    weather: WeatherCondition[];

    @Prop({ type: { all: Number } }) // Specify the type for the clouds property
    clouds: Clouds;

    @Prop({ type: { all: Number } })
    wind: Wind;

    @Prop({ type: { all: Number } })
    visibility: number;

    @Prop({ type: { all: Number } })
    pop: number;

    @Prop({ type: { '3h': Number } })
    rain?: Rain;

    @Prop({ type: { pod: String } })
    sys: Sys;

    @Prop()
    dt_txt: string;

    @Prop({ type: Number }) // Add lat field
    lat?: number;

    @Prop({ type: Number }) // Add lon field
    lon?: number;

    @Prop()
    city?: string;

    @Prop({
        type: Date,
        default: () => new Date(Date.now() + 7 * 60 * 60 * 1000),
    }) // UTC+7
    createdAt: Date;

    @Prop({
        type: Date,
        default: () => new Date(Date.now() + 7 * 60 * 60 * 1000),
    }) // UTC+7
    updatedAt: Date;
}

export const ForecastSchema = SchemaFactory.createForClass(Forecast);
