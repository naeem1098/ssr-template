import bcrypt from 'bcrypt';
import {v4 as uuidv4 } from 'uuid';


export interface IUser {
    id: string,
    firstName: string,
    lastName: string,
    bio: string,
    role: number,
    password: string,
    email: string,
    address: string,
    postCode: string,
    city: string,
    country: string,
    state: string
    phoneNumber: string,
    profilePictureUrl: string,
    timestamp: string,
    isActive: number
}

export class User implements IUser {
    public id: string = '';
    public firstName: string = ''
    public lastName: string = '';
    public bio: string = '';
    public role: number = 0;
    public password: string = ''
    public email: string = ''
    public address: string = ''
    public postCode: string = ''
    public city: string = ''
    public country: string = ''
    public state: string = ''
    public phoneNumber: string = ''
    public profilePictureUrl: string = ''
    public timestamp: string = '';
    public isActive: 1

    constructor(user: any) {
        let date : Date = new Date();
        this.id = user.user_id? user.user_id : uuidv4();
        this.firstName = user.firstName? user.firstName : user.first_name;
        this.lastName = user.lastName? user.lastName : user.last_name;
        this.bio = user.bio? user.bio : '';
        this.role = user.role;
        this.password = user.password ?  bcrypt.hashSync(user.password, 10) : user.password_hash? user.password_hash : '';
        this.email = user.email;
        this.address = user.address;
        this.postCode = user.postCode? user.postCode : user.post_code;
        this.city = user.city;
        this.country = user.country;
        this.state = user.state;
        this.phoneNumber = user.phoneNumber? user.phoneNumber : user.phone_number;
        this.profilePictureUrl = user.profilePictureUrl? user.profilePictureUrl : user.profile_picture_url;
        this.timestamp = user.timestamp? user.timestamp : date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        this.isActive = user.isActive ? user.isActive: user.is_active;
    }
}
