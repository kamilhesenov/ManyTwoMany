import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsNotEmpty, IsNumber, IsOptional} from "class-validator";

export class StudentDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsOptional()
    name: string;

    @ApiProperty({type: [Number]})
    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, {each: true})
    teacherIds: number[];
}
