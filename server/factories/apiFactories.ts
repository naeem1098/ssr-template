import { UsersApi } from "../apis/users-api";
import { UserService } from "../modules/users/user-service";
import { ApiRoute, EndPoint } from "./../utils/api-routes";
import { BlogsApi } from "../apis/blogs-api";
import { BlogService } from "../modules/blogs/blog-service";

export interface IApiFactory {
    getEndPoints(): EndPoint[]
}


export class ApiFactory implements IApiFactory{
    private routes: ApiRoute[] = [];

    constructor(){
        this.routes.push(new UsersApi(new UserService));
        this.routes.push(new BlogsApi(new BlogService));
    }

    getEndPoints(): EndPoint[]{
        let endPoints: EndPoint[] = [];
        return endPoints.concat(...this.routes.map(r => r.getEndPoints()));
    }
}