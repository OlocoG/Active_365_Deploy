import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, Min, IsString, Max, IsPositive, IsNumber } from "class-validator";

export class GymReviewDto {
    @IsUUID()
    @ApiProperty()
    gymId: string;

    @IsString()
    @ApiProperty()
    @IsUUID()
    userId: string;

    @IsNumber()
    @Min(0)
    @Max(5)
    @ApiProperty()
    @IsPositive()
    rating: number;

    @IsString()
    @ApiProperty()
    comment: string;
}