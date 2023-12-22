import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

interface LocalNames {
    [key: string]: string;
}

export interface GeocodingInner {
    name: string;
    local_names: LocalNames;
    lat: number;
    lon: number;
    country: string;
    state?: string;
}
@Schema({ timestamps: true })
export class Geocoding extends Document implements GeocodingInner {
    @Prop()
    name: string;

    @Prop({ type: Object })
    local_names: LocalNames;

    @Prop()
    lat: number;

    @Prop()
    lon: number;

    @Prop()
    country: string;

    @Prop()
    state?: string;
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

export const GeocodingSchema = SchemaFactory.createForClass(Geocoding);
