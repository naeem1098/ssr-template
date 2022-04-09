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
		this.addRoutes();
	}
	
	private configure(): void {
		this.server.use(cors());
		//TODO: in production build make the server.use(helmet()) independant of if block.
		if(!this.dev) {
			this.server.use(helmet());
		}
		this.server.use(cookieParser(process.env.COOKIE_SECRET));
		this.server.use(bodyParser.json({ limit: '25mb' }));
		this.server.use(express.static(path.join(__dirname, './../src/public/')));
	}

	private addRoutes = async() => {
        const router = express.Router();

        const endPoints = this.apiFactory.getEndPoints();
        endPoints.forEach(endPoint => {
            router[endPoint.httpVerb](endPoint.pathString, endPoint.handlers);            
        });

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

        // this.server.use(this.authenticator);
        this.server.use("/api/v1", router);
        
        //error handler
        this.server.use(this.errorHandler);
    }
    
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
}
