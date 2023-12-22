import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Forecast extends Document {
    @Prop({ required: true })
    dt: number;

    @Prop({ type: Object })
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        sea_level: number;
        grnd_level: number;
        humidity: number;
        temp_kf: number;
    };

    @Prop({ type: Array, default: [] })
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];

    @Prop({ type: Object })
    clouds: {
        all: number;
    };

    @Prop({ type: Object })
    wind: {
        speed: number;
        deg: number;
        gust: number;
    };

    @Prop({ default: 0 })
    visibility: number;

    @Prop({ default: 0 })
    pop: number;

    @Prop({ type: Object })
    rain: {
        '3h': number;
    };

    @Prop({ type: Object })
    sys: {
        pod: string;
    };

    @Prop()
    dt_txt: string;

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
