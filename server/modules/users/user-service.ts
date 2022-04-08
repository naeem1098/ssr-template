import { IUser } from "./user-model";
import UserRepo from "./user-repository";

const userRepository = new UserRepo;

export interface IUserService {
    getUserById(id: string): any;
    getUserByEmail(email: string): any;
    getAllUsers(): any;
    addNewUser(user: IUser): Promise<boolean>;
    updateUser(userId:string, user: IUser): Promise<boolean>;
    forgotPasswor(email: string): Promise<boolean>;
    changePassword(oldPasswrd: string, newPassword: string): Promise<boolean>;
    deleteUser(id: string): Promise<boolean>;
}

export class UserService implements IUserService {

    getUserById = async (id: string) : Promise<IUser> => {
        const result : any = await userRepository.getUserById(id);
        return result;
    };

    getUserByEmail = async (email: string) : Promise<IUser> => {
        const result : any = await userRepository.getUserByEmail(email);
        return result;
    };

    getAllUsers = async () : Promise<any> => {
        const result: any = await userRepository.getAllUsers();
        return result;
    };

    addNewUser = async(user: IUser): Promise<boolean> => {
        const result: boolean = await userRepository.setNewUser(user);
        return result;
    };

    updateUser = async (userId: string, user: IUser): Promise<boolean> => {
        const result : boolean = await userRepository.updateUser(userId, user);
        return result;
    };
    forgotPasswor = async (email: string) :Promise<boolean> => true;
    changePassword = async (oldPasswrd: string, newPassword: string): Promise<boolean> => true;
    
    deleteUser = async (id: string): Promise<boolean> => {
        return await userRepository.deleteUser(id);
    };
}
