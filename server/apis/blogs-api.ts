import { Request, Response, NextFunction } from 'express';
import { IBlogService } from "../modules/blogs/blog-service";
import { ApiRoute, EndPoint, HttpVerbs } from "./../utils/api-routes";
import { IBlog } from '../modules/blogs/blog-model';

export class BlogsApi extends ApiRoute{
    
    constructor(private userService: IBlogService /* other dependencies go here...*/){
        super('/blog')
    }

    getEndPoints(): EndPoint[] {
        return [
            {
                pathString: `${this.path}/:blogId`, 
                handlers: [this.getSingleBlogById],
                httpVerb: HttpVerbs.GET,
            },
            {
                pathString: `${this.path}/`,
                handlers: [this.getAllBlogs],
                httpVerb: HttpVerbs.GET,
            },
            {
                pathString: `${this.path}/add-blog`,
                handlers: [this.addNewBlog],
                httpVerb: HttpVerbs.POST,
            },
            {
                pathString: `${this.path}/update-blog`,
                handlers: [this.updateBlog],
                httpVerb: HttpVerbs.PUT,
            },
            {
                pathString: `${this.path}/delete-blog`,
                handlers: [this.deleteBlog],
                httpVerb: HttpVerbs.DELETE,
            }
        ]
    }

    getSingleBlogById = async (req: Request, resp: Response, next: NextFunction) => {
        const blogId = req.params.blogId;
        try{
            const blog = await this.userService.getBlogById(blogId);
            resp.status(200).json(blog);
        }catch(err){
            next(err);
        }

    }

    getAllBlogs = async (req: Request, resp: Response, next: NextFunction) => {        
        try{
            const blogs = await this.userService.getAllBlogs();
            resp.status(200).json(blogs);
        }catch(err){
            next(err);
        }
    }

    addNewBlog = async (req: Request, resp: Response, next: NextFunction) => {
        const newBlog : IBlog = req.body.blog;
        try{
            const isAdded = await this.userService.addNewBlog(newBlog);
            resp.status(200).json(isAdded);
        }catch(err){
            next(err);
        }
    }

    updateBlog = async (req: Request, resp: Response, next: NextFunction) => {
        const blogData : IBlog = req.body.updatedBlog;        
        try{
            const isUpdated = await this.userService.updateBlog(blogData);
            resp.status(200).json(isUpdated);
        }catch(err){
            next(err);
        }
    }

    deleteBlog = async (req: Request, resp: Response, next: NextFunction) => { 
        const blogId = req.body.blogId;
        try{
            const isDeleted = await this.userService.deleteBlog(blogId);
            resp.status(200).json(isDeleted);
        }catch(err){
            next(err);
        }
    }
}