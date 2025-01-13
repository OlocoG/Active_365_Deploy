import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsInt, Min, IsString, Max, IsPositive } from "class-validator";

export class ProductReviewDto {
    @IsUUID()
    @ApiProperty()
    productId: string;

    @IsString()
    @ApiProperty()
    @IsUUID()
    userId: string;

    @IsInt()
    @Min(0)
    @Max(5)
    @ApiProperty()
    @IsPositive()
    rating: number;

    @IsString()
    @ApiProperty()
    comment: string;


}