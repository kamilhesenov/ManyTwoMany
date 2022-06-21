import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsNotEmpty, IsNumber, IsOptional} from "class-validator";

export class TeacherDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsOptional()
    name: string;

    @ApiProperty({type: [Number]})
    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, {each: true})
    studentIds: number[]
}
