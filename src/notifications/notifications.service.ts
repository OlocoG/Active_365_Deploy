import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';
import { Users } from 'src/entities/users.entity';
import { UserService } from 'src/users/user.service';
import { FindOperator, LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        private readonly emailService: EmailService,
        private readonly usersService: UserService,
    ){}

    @Cron('0 0 1 * *')
    // @Cron('*/5 * * * *')
    async sendMonthlyOffers() {

        const page = 1; 
        const limit = 100; 
        const users = await this.usersService.getAllUsers(page, limit);
    
        if (!users || users.length === 0) {
            console.log('No hay usuarios registrados para enviar correos.');
            return;
        }
    
        for (const user of users) {
            const email = user.email;
            const name = user.name;
            const shopLink = 'https://example.com/shop';

    
    await this.emailService.sendProductOffersEmail(email, name, shopLink);
    }
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    // @Cron('*/5 * * * *')
    async sendMembershipExpirationReminder() {
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        threeDaysFromNow.setHours(23, 59, 59, 999);

        const usersToNotify = await this.usersRepository.find({
            where: {
                membershipExpiresAt: LessThanOrEqual(threeDaysFromNow),
            },
        });

        for (const user of usersToNotify) {
            await this.emailService.sendMembershipExpirationReminderEmail(
            user.email,
            {
                user: user,
                expirationDate: user.membershipExpiresAt,
            });
        }
    }
}