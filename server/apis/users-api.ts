import { Request, Response, NextFunction } from 'express';
import multiparty from 'multiparty';
import { createWriteStream } from 'fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { emailValidator, passwordValidator, userIdValidator } from '../modules/users/user-middleware';
import { IUserService } from "../modules/users/user-service";
import { ApiRoute, EndPoint, HttpVerbs } from "./../utils/api-routes";
import { User } from '../modules/users/user-model';

declare global {
    namespace Express {
      interface Request {
        user: any;
      }
    }
  }

export class UsersApi extends ApiRoute{
    
    constructor(private userService: IUserService /* other dependencies go here...*/){
        super('/api/user')
    }

    getEndPoints(): EndPoint[] {
        return [
            {
                pathString: `${this.path}/:userId`, 
                handlers: [this.getSingleUserById],
                httpVerb: HttpVerbs.GET,
            },
            {
                pathString: `${this.path}/`,
                handlers: [this.getAllUsers],
                httpVerb: HttpVerbs.GET,
            },
            {
                pathString: `${this.path}/add-user`,
                handlers: [this.addNewUser],
                httpVerb: HttpVerbs.POST,
            },
            {
                pathString: `${this.path}/update-user`,
                handlers: [this.updateUser],
                httpVerb: HttpVerbs.PUT,
            },
            {
                pathString: `${this.path}/login`,
                handlers: [this.login],
                httpVerb: HttpVerbs.POST,
            },
            {
                pathString: `${this.path}/forgot-password`,
                handlers: [this.forgotPassword],
                httpVerb: HttpVerbs.PATCH,
            },
            {
                pathString: `${this.path}/change-password`,
                handlers: [this.changePassword],
                httpVerb: HttpVerbs.PATCH,
            },
            {
                pathString: `${this.path}/delete-user`,
                handlers: [this.deleteUser],
                httpVerb: HttpVerbs.DELETE,
            }
        ]
    }

    getSingleUserById = async (req: Request, resp: Response, next: NextFunction) => {
        const userId = req.params.userId;
        try{
            if(userIdValidator(userId)){
                const user = await this.userService.getUserById(userId);
                resp.status(200).json(user);
            } else {
                resp.status(403).json({message: `Invalid user id provided!`});
            }
        }catch(err){
            next(err);
        }

    }

    getAllUsers = async (req: Request, resp: Response, next: NextFunction) => {        
        try{
            const users = await this.userService.getAllUsers();
            resp.status(200).json(users);
        }catch(err){
            next(err);
        }
    }

    addNewUser = async (req: Request, resp: Response, next: NextFunction) => {

        if((!req.user) || (req.user.role !== 1)) {
            resp.status(401).json({message: 'Unauthorized user! '})
        } else {
            try {
                
                let form = new multiparty.Form();
                let userData: any = {
                    firstName: '',
                    lastName: '',
                    bio: '',
                    role: 0,
                    password: '',
                    email: '',
                    address: '',
                    postCode: 0,
                    city: '',
                    country: '',
                    state: '',
                    phoneNumber: '',
                    isActive: 0
                };
                let fileName = '';
                form.on('part', (part: any) => {
                    if(part.filename) {
                        fileName = part.filename;
                        part.pipe(createWriteStream(`./src/images/users/${fileName}`))
                        userData.profilePictureUrl = `http://localhost:3000/users/download/${part.filename}`;
                    }
        
                });
        
                form.on('field', (fieldName: string, value: string) => {
                    switch(fieldName) {
                            case "firstName": {
                                userData.firstName = value;
                                break;
                            }
                            case "lastName": {
                                userData.lastName = value;
                                break;
                            }
                            case "bio": {
                                userData.bio = value;
                                break;
                            }
                            case "role": {
                                userData.role = parseInt(value);
                                break;
                            }
                            case "password": {
                                userData.password = value;
                                break;
                            }
                            case "email": {
                                userData.email = value;
                                break;
                            }
                            case "address": {
                                userData.address = value;
                                break;
                            }
                            case "postCode": {
                                userData.postCode = value;
                                break;
                            }
                            case "city": {
                                userData.city = value;
                                break;
                            }
                            case "country": {
                                userData.country = value;
                                break;
                            }
                            case "state": {
                                userData.state = value;
                                break;
                            }
                            case "phoneNumber": {
                                userData.phoneNumber = value;
                                break;
                            }
                            case "isActive": {
                                userData.isActive = parseInt(value);
                                break;
                            }
                    }
                })
        
                form.on('close', async() => {
                    if(!emailValidator(userData.email)) {
                        resp.status(400).json({message: "Invalid email address!"});
                    } else if(!passwordValidator(userData.password)){
                        resp.status(400).json({message: "Password must be at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and minimum 10 characters long."});
                    } else if((userData.role < 1) || (userData.role > 2)){
                        resp.status(400).json({message: "Invalid user role!"});
                    } else {
                        let user = new User(userData);
                        try{
                            const isSaved: any = await this.userService.addNewUser(user);
                            if(isSaved) {
                                resp.status(200).json(isSaved);
                            } 
                        } catch (error: any) {
        
                            switch (error['info'].code) {
                                case 1062: {
                                    resp.status(403).json({message: `This ${user.email} email address is already used.`});
                                    break;
                                }
                                case 1064: {
                                    resp.status(403).json({message: `Wrong data placed in a field!`});
                                    break;
                                }
                                case 1406: {
                                    resp.status(403).json({message: `Data is too long in one or more fields!`})
                                    break;
                                }
                                case 1264: {
                                    resp.status(403).json({message: `Out of range data in a field!`});
                                    break;
                                }
                                default: {
                                    resp.status(403).json({message: error})
                                }
                            }
                        }
                    }
                })
        
                form.parse(req);
    
            } catch (error) {
                next(error);
            }
        }
    }

    updateUser = async (req: Request, resp: Response, next: NextFunction) => {
        try {

            let form = new multiparty.Form();
            let userData: any = {
                firstName: '',
                lastName: '',
                bio: '',
                role: 0,
                password: '',
                email: '',
                address: '',
                postCode: 0,
                city: '',
                country: '',
                state: '',
                phoneNumber: '',
                isActive: 0
            };
            let fileName = '';
            form.on('part', (part: any) => {
                if(part.filename) {
                    fileName = part.filename;
                    part.pipe(createWriteStream(`./src/images/users/${fileName}`))
                    userData.profilePictureUrl = `http://localhost:3000/users/download/${part.filename}`;
                }
    
            });
    
            form.on('field', (fieldName: string, value: string) => {
                switch(fieldName) {
                        case "firstName": {
                            userData.firstName = value;
                            break;
                        }
                        case "lastName": {
                            userData.lastName = value;
                            break;
                        }
                        case "bio": {
                            userData.bio = value;
                            break;
                        }
                        case "role": {
                            userData.role = parseInt(value);
                            break;
                        }
                        case "password": {
                            userData.password = value;
                            break;
                        }
                        case "email": {
                            userData.email = value;
                            break;
                        }
                        case "address": {
                            userData.address = value;
                            break;
                        }
                        case "postCode": {
                            userData.postCode = value;
                            break;
                        }
                        case "city": {
                            userData.city = value;
                            break;
                        }
                        case "country": {
                            userData.country = value;
                            break;
                        }
                        case "state": {
                            userData.state = value;
                            break;
                        }
                        case "phoneNumber": {
                            userData.firstName = value;
                            break;
                        }
                        case "isActive": {
                            userData.isActive = parseInt(value);
                            break;
                        }
                }
            })
    
            form.on('close', async() => {
                let user = new User(userData);
                const userId: string = req.user.userId;
                try{
                    const isSaved: any = await this.userService.updateUser(userId, user);
                    if(isSaved) {
                        resp.status(200).json(isSaved);
                    } 
                } catch (error: any) {

                    switch (error['info'].code) {
                        case 1062: {
                            resp.status(403).json({message: `This ${user.email} email address is already used.`});
                            break;
                        }
                        case 1064: {
                            resp.status(403).json({message: `Wrong data placed in a field!`});
                            break;
                        }
                        case 1406: {
                            resp.status(403).json({message: `Data is too long in one or more fields!`})
                            break;
                        }
                        case 1264: {
                            resp.status(403).json({message: `Out of range data in a field!`});
                            break;
                        }
                        default: {
                            resp.status(403).json({message: error})
                        }
                    }
                }
            })
    
            form.parse(req);

        } catch (error) {
            next(error);
        }
    }

    updateUserById = async (req: Request, resp: Response, next: NextFunction) => {
        try {

            let form = new multiparty.Form();
            let userData: any = {
                firstName: '',
                lastName: '',
                bio: '',
                role: 0,
                password: '',
                email: '',
                address: '',
                postCode: 0,
                city: '',
                country: '',
                state: '',
                phoneNumber: '',
                isActive: 0
            };
            let fileName = '';
            form.on('part', (part: any) => {
                if(part.filename) {
                    fileName = part.filename;
                    part.pipe(createWriteStream(`./src/images/users/${fileName}`))
                    userData.profilePictureUrl = `http://localhost:3000/users/download/${part.filename}`;
                }
    
            });
    
            form.on('field', (fieldName: string, value: string) => {
                switch(fieldName) {
                        case "firstName": {
                            userData.firstName = value;
                            break;
                        }
                        case "lastName": {
                            userData.lastName = value;
                            break;
                        }
                        case "bio": {
                            userData.bio = value;
                            break;
                        }
                        case "role": {
                            userData.role = parseInt(value);
                            break;
                        }
                        case "password": {
                            userData.password = value;
                            break;
                        }
                        case "email": {
                            userData.email = value;
                            break;
                        }
                        case "address": {
                            userData.address = value;
                            break;
                        }
                        case "postCode": {
                            userData.postCode = value;
                            break;
                        }
                        case "city": {
                            userData.city = value;
                            break;
                        }
                        case "country": {
                            userData.country = value;
                            break;
                        }
                        case "state": {
                            userData.state = value;
                            break;
                        }
                        case "phoneNumber": {
                            userData.firstName = value;
                            break;
                        }
                        case "isActive": {
                            userData.isActive = parseInt(value);
                            break;
                        }
                }
            })
    
            form.on('close', async() => {
                let user = new User(userData);
                const userId: string = req.params.userId;
                try{
                    const isSaved: any = await this.userService.updateUser(userId, user);
                    if(isSaved) {
                        resp.status(200).json(isSaved);
                    } 
                } catch (error: any) {

                    switch (error['info'].code) {
                        case 1062: {
                            resp.status(403).json({message: `This ${user.email} email address is already used.`});
                            break;
                        }
                        case 1064: {
                            resp.status(403).json({message: `Wrong data placed in a field!`});
                            break;
                        }
                        case 1406: {
                            resp.status(403).json({message: `Data is too long in one or more fields!`})
                            break;
                        }
                        case 1264: {
                            resp.status(403).json({message: `Out of range data in a field!`});
                            break;
                        }
                        default: {
                            resp.status(403).json({message: error})
                        }
                    }
                }
            })
    
            form.parse(req);

        } catch (error) {
            next(error);
        }
    }

    login = async (req: Request, resp: Response, next: NextFunction) => {
        const email: string = req.body.email;
        const password: string = req.body.password;

        try {

            let user : any = await this.userService.getUserByEmail(email.toString());
            if(!user) {
                resp.status(404).json({message: `User not found with ${email} address!`});
            } else {
                if (!bcrypt.compareSync(password.toString(), user.password_hash)) {
                    resp.status(403).json({message: "wrong password!"})
                } else {
                    let token = jwt.sign(user, process.env.JWT_SECRATE, {expiresIn: Date.now() + (1000*60*60*8), subject: user.user_id});
                    token = "JWT " + token;
                    user = new User(user);
                    user.password = undefined;
                    user.isActive = undefined;
                    const payload = {
                        token: token,
                        payload: user
                    }

                    resp.status(200).json(payload);
                }
            }
        } catch (error) {
            next(error);
        }
    }

    forgotPassword = async (req: Request, resp: Response, next: NextFunction) => {
        const email = req.body.email;        
        try{
            const isLinkSent = await this.userService.forgotPasswor(email);
            resp.status(200).json(isLinkSent);
        }catch(err){
            next(err);
        }
    }

    changePassword = async (req: Request, resp: Response, next: NextFunction) => {        
        const oldPassword: string = req.body.password;
        const newPassword: string = req.body.password;
        try{
            const isChanged = await this.userService.changePassword(oldPassword, newPassword);
            resp.status(200).json(isChanged);
        }catch(err){
            next(err);
        }
    }

    deleteUser = async (req: Request, resp: Response, next: NextFunction) => { 
        const userId = req.body.userId;
        try{
            const isDeleted = await this.userService.deleteUser(userId);
            resp.status(200).json(isDeleted);
        }catch(err){
            next(err);
        }
    }
}