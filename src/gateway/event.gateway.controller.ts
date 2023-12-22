import { Controller, Get, Render } from '@nestjs/common';
import { MyGateway } from './event.gateway';

@Controller()
export class AppController {
    constructor(private readonly myGateway: MyGateway) {}
    @Get()
    @Render('index')
    root() {
        return { message: 'Hello World!' };
    }
}
