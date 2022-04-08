import { config } from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import next from "next";
import bodyParser from "body-parser";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import { IApiFactory } from "./factories/apiFactories";
import { Server } from "http"


export default class App {

	public server: express.Application;
	private dev : boolean;

	constructor(private apiFactory: IApiFactory, private readonly PORT = 3000) {
		config();
		this.server = express();
		this.dev = process.env.NODE_ENV !== "production";
		this.configure();
		// this.addRoutes();
	}
	
	private configure = async () => {
		this.server.use(cors());
		//TODO: in production build make the server.use(helmet()) independant of if block.
		if(!this.dev) {
			this.server.use(helmet());
		}
		this.server.use(cookieParser(process.env.COOKIE_SECRET));
		this.server.use(bodyParser.json({ limit: '25mb' }));
		this.server.use(express.static(path.join(__dirname, './../src/public/')));
		const dev = this.dev;
		const app = next({ dev });
		const handle = app.getRequestHandler();
		await app.prepare();

		this.server.get("/", (req: Request, resp: Response) => {
			return app.render( req, resp, "/");
		})

		this.server.all("*", (req: Request, resp: Response) => {
			return handle(req, resp);
		})
	}

	private addRoutes(): void {
        const router = express.Router();
        router.get('/', this.indexHandler);
        const endPoints = this.apiFactory.getEndPoints();
        endPoints.forEach(endPoint => {
            router[endPoint.httpVerb](endPoint.pathString, endPoint.handlers);            
        });
        // this.server.use(this.authenticator);
        this.server.use(router);
        //catch 404
        this.server.use(this.notFoundHandler);
        //error handler
        this.server.use(this.errorHandler);
    }

	private indexHandler = (req: Request, resp: Response, next: NextFunction) => {
        return resp.status(200).json({ message: 'hello world' });
    }

    private notFoundHandler = (req: Request, resp: Response, next: NextFunction) => {
        return resp.status(404).json({ message: 'resource not found!' });
    }

	// private nextjsHandler = (req: Request, resp: Response, next: NextFunction) => {
	// 	return handle(req, res);
	// }
    
    private errorHandler = (err: Error, req: Request, resp: Response, next: NextFunction) => {
        /**
         * In production errors are supposed to be handled based on the environment.
         * */
        console.error(err);
        return resp.status(500).json({message: 'Internal server error! try again.'});
    }

    public startServer = (): Server => {

        return this.server.listen(this.PORT, '0.0.0.0', () => {
            console.log(`server is listing at port: ${this.PORT}`);
        });
    }


	public init = () => {

		const dev = process.env.NODE_ENV !== "production";
		const app = next({ dev });
		const handle = app.getRequestHandler();
		const port = process.env.PORT || 3000;
		
		try {
			app.prepare().then(() => {

				const server = express();
	
				server.use(cors());
				//TODO: in production build make the server.use(helmet()) independant of if block.
				if(!dev) {
					server.use(helmet());
				}
				server.use(cookieParser(process.env.COOKIE_SECRET));
				server.use(bodyParser.json({ limit: '25mb' }));
				server.use(express.static(path.join(__dirname, './../src/public/')));
	
				server.get("/", (req: Request, res: Response) => {
					return app.render(req, res, "/");
				})
	
				server.all("*", (req: Request, res: Response) => {
					return handle(req, res);
				});
				
				server.listen(port, (err?: any) => {
					if (err) throw err;
					console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
				});
			}).catch(error => {
				throw error
			});
		} catch (error) {
			console.error(error);
			process.exit(1);	
		}
	}
}

// const ssr = new Server();
// ssr.init();