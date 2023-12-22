import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class Components {
    @Prop({ type: Number })
    co: number;

    @Prop({ type: Number })
    no: number;

    @Prop({ type: Number })
    no2: number;

    @Prop({ type: Number })
    o3: number;

    @Prop({ type: Number })
    so2: number;

    @Prop({ type: Number })
    pm2_5: number;

    @Prop({ type: Number })
    pm10: number;

    @Prop({ type: Number })
    nh3: number;
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

@Schema()
class Main {
    @Prop({ type: Number })
    aqi: number;
}

@Schema()
class List {
    @Prop({ type: Number })
    dt: number;

    @Prop({ type: Main })
    main: Main;

    @Prop({ type: Components })
    components: Components;
}

@Schema({ timestamps: true })
export class Pollution extends Document {
    @Prop({ type: [Number] })
    coord: number[];

    @Prop({ type: [List] })
    list: List[];
}

export const PollutionSchema = SchemaFactory.createForClass(Pollution);
