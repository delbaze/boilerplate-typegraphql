import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export default class User {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;
}

@ObjectType()
export class LoginInfo {
  @Field()
  @Column()
  token : string;
}

@InputType()
export class UserRegister {
  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;
}

@InputType()
export class UserLogin {
  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;
}
