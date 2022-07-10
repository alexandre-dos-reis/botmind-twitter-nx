import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDtoRequest {
  @ApiProperty({
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  firstname!: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  lastname!: string;
}
