import { IBlog } from "./blog-model";


export interface IBlogService {
    getAllBlogs(): any[];
    getBlogById(id: string): any;
    addNewBlog(user: IBlog): boolean;
    updateBlog(user: IBlog): boolean;
    deleteBlog(id: string): boolean;
}

export class BlogService implements IBlogService {

    // method name  :  arguments        :       implimentations
    getAllBlogs = () => [];
    getBlogById = (id: string) => {return {id, title: 'How to make fast website'}};
    addNewBlog = (user: IBlog) => true;
    updateBlog = (user: IBlog) => true;
    deleteBlog = (id: string) => true;
}
