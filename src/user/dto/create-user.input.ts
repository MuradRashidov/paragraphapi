import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsString, Min, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(1)
  password: string;

  @Field({nullable: true})
  bio?: string;

  @Field({nullable: true})
  avatar?: string;
}
