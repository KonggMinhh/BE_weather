import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class City extends Document {
    @Prop()
    city: string;

    @Prop({
        type: Object,
        required: true,
        coord: { type: Object, lon: { type: Number }, lat: { type: Number } },
        weather: { type: Array, default: [] },
        main: {
            type: Object,
            temp: { type: Number },
            feels_like: { type: Number },
            temp_min: { type: Number },
            temp_max: { type: Number },
            pressure: { type: Number },
            humidity: { type: Number },
        },
        wind: {
            type: Object,
            speed: { type: Number },
            deg: { type: Number },
            gust: { type: Number },
        },
        clouds: { type: Object, all: { type: Number } },
        sys: {
            type: Object,
            typeValue: { type: Number },
            id: { type: Number },
            country: { type: String },
            sunrise: { type: Number },
            sunset: { type: Number },
            timezone: { type: Number },
        },
    })
    data: any; // Dữ liệu thời tiết từ OpenWeather API

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

export const CitySchema = SchemaFactory.createForClass(City);
