import BaseRepo from "../../core/baseRepo";
import { IUser, User } from "./user-model";

export default class UserRepo extends BaseRepo{
    
    constructor() {
        super();
    }

    getUserById = async (id: string) : Promise<IUser> => {
        const Id = id.toString();
        try{
            const [result]: any = await this._query(`select user_id, first_name, last_name, role, email, address, post_code, city, country, state, phone_number, profile_picture_url, timestamp, is_active from users where user_id = "${Id}" and is_active = 1;`);
            const user = new User(result[0]);
            return user;
        } catch(error: any) {
            return error;
        }
    }

    getUserByEmail = async (email: string) : Promise<IUser | null> => {
        try{
            const [result]: any = await this._query(`select user_id, first_name, last_name, role, password_hash, email, address, post_code, city, country, state, phone_number, profile_picture_url, timestamp, is_active from users where email = "${email}" and is_active = 1;`);

            if(result[0]){
                // const user = new User(result[0]);
                return result[0];
            } else {
                return null;
            }
        } catch(error: any) {
            return error;
        }
    }

    getAllUsers = async (): Promise<IUser[]> => {
        try{
            const [result]: any = await this._query(`select * from users;`);
            const users: IUser[] = result.map((user:any, key:any) => {
                user.password_hash = '';
                return new User(user);
            })
            
            return users;
        } catch(error: any) {
            return error;
        }
    }

    // getAllActiveUsers = async (): Promise<IUser[]> => {
    //     try{
    //         const [result]: any = await this._query(`select * from users where is_active = 1;`);
    //         const users: IUser[] = result.map((user:any, key:any) => {
    //             return new User(user);
    //         })
    //         return users;
    //     } catch(error: any) {
    //         return error;
    //     }
    // } 

    updateUser = async (userId: string, user: IUser): Promise<boolean> => {
        try {
            const [, result]: any = await this._query(`UPDATE users SET first_name = '${user.firstName}', last_name = '${user.lastName}', bio = ${user.bio}, role = '${user.role}', password_hash = '${user.password}', email = '${user.email}', address = '${user.address}', post_code = '${user.postCode}', city = '${user.city}', country = '${user.country}', state = '${user.state}', phone_number = '${user.phoneNumber}', profile_picture_url = '${user.profilePictureUrl}', WHERE user_id = '${userId}';`);
            
            return result;
        } catch(error) {
            throw error;
        }

    }


    setNewUser = async (user: IUser): Promise<boolean> => {
        try {
            const [, result]: any = await this._query(`INSERT INTO users (user_id, first_name, last_name, role, password_hash, email, address, post_code, city, country, state, phone_number, profile_picture_url, timestamp, is_active)
            VALUES ('${user.id}', '${user.firstName}', '${user.lastName}', ${user.role}, '${user.password}', '${user.email}', '${user.address}', '${user.postCode}', '${user.city}', '${user.country}', '${user.state}', '${user.phoneNumber}', '${user.profilePictureUrl}', '${user.timestamp}', ${user.isActive} );`);
            
            return result;
        } catch(error) {
            throw error;
        }

    } 

    deleteUser = async (userId: string): Promise<boolean> => {
        try {
            const [,result]: any = await this._query(`DELETE FROM users WHERE user_id='${userId}';`);
            return result
        } catch (error) {
            throw error;
        }
    }
    
}