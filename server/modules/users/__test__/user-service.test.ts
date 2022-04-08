
import { UserService } from "../user-service";

describe("Unit User Service", () => {
    describe("CURD Operations in Database", () => {

        it("will get only one user from database", async () => {
            // data
            const user1: string = "2213f961-2481-498d-aac5-c96616b72329";
            const userService = new UserService();

            // execution
            const users: any = await userService.getUserById(user1);
            console.log(users);

            // validation
            expect(users.user_id).toEqual(user1);
        })
        
        it("will get all users from database", async () => {
            // data
            const user1: string = "2213f961-2481-498d-aac5-c96616b72329";
            const user2: string = "5e3f3b2b-8511-4118-bbe1-be8cae471c88";
            const userService = new UserService();

            // execution
            const users: any = await userService.getAllUsers();

            // validation
            expect(users[0].user_id).toEqual(user1);
            expect(users[1].user_id).toEqual(user2);
        })
    })
})