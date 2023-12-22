// city.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export interface LocalNames {
    [key: string]: string;
}

@Schema()
export class ReverseGeocoding extends Document {
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

export const ReverseGeocodingSchema =
    SchemaFactory.createForClass(ReverseGeocoding);
