import { User } from './user';

export class Agriculturist implements User {
    readonly type: string = "agriculturist";

    token: string;

    constructor (public firstName: string,
                 public lastName: string,
                 public username: string,
                 public password: string,
                 public date: Date, 
                 public place: string,
                 public phone: string,
                 public email: string) { }
}