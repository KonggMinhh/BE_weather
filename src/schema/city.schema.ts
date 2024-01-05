import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class City extends Document {
    @Prop()
    city: string;

    @Prop({
        type: {
            lon: { type: Number },
            lat: { type: Number },
        },
    })
    coord: {
        lon: number;
        lat: number;
    };

    @Prop({
        type: [{ id: Number, main: String, description: String, icon: String }],
        default: [],
    })
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];

    @Prop({
        type: {
            temp: Number,
            feels_like: Number,
            temp_min: Number,
            temp_max: Number,
            pressure: Number,
            humidity: Number,
        },
    })
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };

    @Prop({
        type: {
            speed: Number,
            deg: Number,
            gust: Number,
        },
    })
    wind: {
        speed: number;
        deg: number;
        gust: number;
    };

    @Prop({ type: { all: Number } })
    clouds: {
        all: number;
    };

    @Prop({
        type: {
            typeValue: Number,
            id: Number,
            country: String,
            sunrise: Number,
            sunset: Number,
            timezone: Number,
        },
    })
    sys: {
        typeValue: number;
        id: number;
        country: string;
        sunrise: number;
        sunset: number;
        timezone: number;
    };

    @Prop({
        type: Date,
        default: () => new Date(Date.now() + 7 * 60 * 60 * 1000),
    })
    createdAt: Date;

    @Prop({
        type: Date,
        default: () => new Date(Date.now() + 7 * 60 * 60 * 1000),
    })
    updatedAt: Date;
}

export const CitySchema = SchemaFactory.createForClass(City);
