import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import JwtAuthenticationGuard from "../authentication/guards/jwt-authentication.guard";
import EmailScheduleDto from "./dto/emailSchedule.dto";
import EmailSchedulingService from "./emailScheduling.service";

@Controller()
export default class EmailScheduleController {
    constructor(
        private readonly emailScheduleService: EmailSchedulingService
    ) {}

    @Post('schedule')
    @UseGuards(JwtAuthenticationGuard)
    async scheduleEmail(@Body() emailSchedule: EmailScheduleDto) {
        this.emailScheduleService.scheduleEmail(emailSchedule);
    }
}