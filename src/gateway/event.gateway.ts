// Xu ly request tu phia client
import {
    // MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PollutionService } from 'src/modules/air_pollution/pollution.service';
import { CityService } from 'src/modules/city/city.service';
import { ForecastService } from 'src/modules/forecast/forecast.service';
import { GeocodingService } from 'src/modules/geocoding/geocoding.service';
import { ReverseGeocodingService } from 'src/modules/reverse_geocoding/reverseGeo.service';
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class MyGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(
        private readonly cityService: CityService,
        private readonly geocodingService: GeocodingService,
        private readonly reverseGeocodingService: ReverseGeocodingService,
        private readonly forecastService: ForecastService,
        private readonly pollutionService: PollutionService,
    ) {}

    afterInit(server: Server) {
        console.log(server);
        //Do stuffs
    }
    @WebSocketServer()
    server: Server;
    // define events listen to client, handleevent is active is event is active, emit listen client
    // @SubscribeMessage('events')
    // handleEvent(@MessageBody() data: string) {
    //     console.log(data);
    //     this.server.emit('event', {
    //         msg: 'Test',
    //         content: data,
    //     });
    // }
    // * * * Get Geocoding * * *
    @SubscribeMessage('subscribeGeocoding')
    handleGeocoding(client: any, { params }: { params: string }): void {
        this.geocodingService.getGeocoding(params).subscribe({
            next: (data) => {
                // Emit the weather data array back to the client
                // console.log(data);
                this.server.to(client.id).emit('geocodingUpdate', {
                    data,
                });
            },
            error: () => {
                // Handle errors from the weather service (e.g., city not found)
                this.server
                    .to(client.id)
                    .emit('weatherError', 'Error fetching weather data');
            },
        });
    }

    // * * * Get City * * *
    @SubscribeMessage('subscribeCity')
    handleCity(
        client: any,
        { params }: { params?: { lat?: string; lon?: string } },
    ): void {
        if (!params || !params.lat || !params.lon) {
            // Handle the case where lat or lon is missing
            this.server
                .to(client.id)
                .emit('weatherError', 'Latitude or Longitude is missing');
            return;
        }
        const { lat, lon } = params;

        // Extract numeric values from lat and lon
        const numericLat = parseFloat(lat.split('=')[1]);
        const numericLon = parseFloat(lon.split('=')[1]);

        this.cityService.getCoordinates(numericLat, numericLon).subscribe({
            next: (data) => {
                // Emit the weather data array back to the client
                this.server.to(client.id).emit('cityUpdate', {
                    data,
                });
            },
            error: () => {
                // Handle errors from the weather service (e.g., city not found)
                this.server
                    .to(client.id)
                    .emit('weatherError', 'Error fetching weather data');
            },
        });
    }

    // * * * Get Reverse Geocoding * * *
    @SubscribeMessage('subscribeReverseGeocoding')
    handleReverseGeocoding(
        client: any,
        { params }: { params?: { lat?: string; lon?: string } },
    ): void {
        if (!params || !params.lat || !params.lon) {
            // Handle the case where lat or lon is missing
            this.server
                .to(client.id)
                .emit('weatherError', 'Latitude or Longitude is missing');
            return;
        }
        const { lat, lon } = params;
        // Extract numeric values from lat and lon
        const numericLat = parseFloat(lat.split('=')[1]);
        const numericLon = parseFloat(lon.split('=')[1]);
        this.reverseGeocodingService
            .getReverseGeocoding(numericLat, numericLon) // Adjust this line based on your service method
            .subscribe({
                next: (data) => {
                    // Emit the weather data array back to the client
                    // console.log(data);
                    this.server.to(client.id).emit('reverseGeoUpdate', {
                        data,
                    });
                },
                error: () => {
                    // Handle errors from the weather service (e.g., city not found)
                    this.server
                        .to(client.id)
                        .emit('weatherError', 'Error fetching weather data');
                },
            });
    }

    // * * * Get Forecast * * *
    @SubscribeMessage('subscribeForecast')
    handleForecast(
        client: any,
        { params }: { params?: { lat?: string; lon?: string } },
    ): void {
        if (!params || !params.lat || !params.lon) {
            // Handle the case where lat or lon is missing
            this.server
                .to(client.id)
                .emit('weatherError', 'Latitude or Longitude is missing');
            return;
        }

        const { lat, lon } = params;

        const numericLat = parseFloat(lat.split('=')[1]);
        const numericLon = parseFloat(lon.split('=')[1]);

        this.forecastService
            .getFiveDayForecast(numericLat, numericLon) // Adjust this line based on your service method
            .subscribe({
                next: (data) => {
                    // Emit the weather data array back to the client
                    this.server.to(client.id).emit('forecastUpdate', {
                        data,
                    });
                },
                error: () => {
                    // Handle errors from the weather service (e.g., city not found)
                    this.server
                        .to(client.id)
                        .emit('weatherError', 'Error fetching weather data');
                },
            });
    }

    // * * * Get Pollution * * *
    @SubscribeMessage('subscribePollution')
    handlePollution(
        client: any,
        { params }: { params?: { lat?: string; lon?: string } },
    ): void {
        if (!params || !params.lat || !params.lon) {
            // Handle the case where lat or lon is missing
            this.server
                .to(client.id)
                .emit('weatherError', 'Latitude or Longitude is missing');
            return;
        }
        const { lat, lon } = params;
        const numericLat = parseFloat(lat.split('=')[1]);
        const numericLon = parseFloat(lon.split('=')[1]);
        this.pollutionService
            .getPollution(numericLat, numericLon) // Adjust this line based on your service method
            .subscribe({
                next: (data) => {
                    // Emit the weather data array back to the client
                    // console.log('Pollution', data);
                    this.server.to(client.id).emit('pollutionUpdate', {
                        data,
                    });
                },
                error: () => {
                    // Handle errors from the weather service (e.g., city not found)
                    this.server
                        .to(client.id)
                        .emit('weatherError', 'Error fetching weather data');
                },
            });
    }

    // Check connection client -> server
    handleConnection(client: any) {
        console.log('Client connected: ' + client.id);
    }
    handleDisconnect(client: any) {
        console.log('Client disconnected: ' + client.id);
    }
}
