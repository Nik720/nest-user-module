import { Injectable } from "@nestjs/common";
import { Cron, SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import EmailService from "../email/email.service";
import EmailScheduleDto from "./dto/emailSchedule.dto";

Injectable()
export default class EmailSchedulingService {
    
    constructor(
        private readonly emailService: EmailService,
        private readonly schedulerRegistery: SchedulerRegistry
    ) {}

    scheduleEmail(emailSchedule: EmailScheduleDto) {
        const date = new Date(emailSchedule.date);
        const job = new CronJob(date, () => {
            this.emailService.sendMail({
                to: emailSchedule.recipient,
                subject: emailSchedule.subject,
                text: emailSchedule.content
            })
        });

        this.schedulerRegistery.addCronJob(`${Date.now()}-${emailSchedule.subject}`, job);
        job.start();
    }

    cancelAllScheduledEmails() {
        this.schedulerRegistery.getCronJobs().forEach((job) => {
          job.stop();
        })
    }
}