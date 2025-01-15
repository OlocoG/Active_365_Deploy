import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { addMonths, addYears } from 'date-fns';
import { Users } from 'src/entities/users.entity';
import { userRoles } from 'src/enums/userRoles.enum';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class MembershipService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
    ) {}

    calculateMembershipExpiration(membershipType: string): Date {
        const currentDate = new Date();

        switch (membershipType.toLowerCase()) {
            case 'monthly membership':
                return addMonths(currentDate, 1);
            case 'quarterly membership':
                return addMonths(currentDate, 3);
            case 'semiannual membership':
                return addMonths(currentDate, 6);
            case 'annual membership':
                return addYears(currentDate, 1);
            default:
                throw new Error('Invalid membership type');
        }
    }

    @Cron('0 0 * * *') 
    async checkExpiredMemberships() {
        const expiredUsers = await this.usersRepository.find({
            where: {
                membershipExpiresAt: LessThan(new Date()),
            },
        });

        for (const user of expiredUsers) {
            user.rol = userRoles.registered; 
            user.membershipExpiresAt = null; 
            await this.usersRepository.save(user);
        }
    }
}
