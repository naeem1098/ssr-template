import { config } from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import next from "next";
import bodyParser from "body-parser";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';


class Server {

	constructor() {
		config();
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
		// try {
		// 	await app.prepare();
		// 	const server = express();

		// 	server.use(cors());
		// 	server.use(helmet());
		// 	server.use(cookieParser(process.env.COOKIE_SECRET));
		// 	server.use(bodyParser.json({ limit: '25mb' }));

		// 	server.get("/", (req: Request, res: Response) => {
		// 		return app.render(req, res, "/");
		// 	})

		// 	server.all("*", (req: Request, res: Response) => {
		// 		return handle(req, res);
		// 	});
			
		// 	server.listen(port, (err?: any) => {
		// 		if (err) throw err;
		// 		console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
		// 	});
		// } catch (error) {
		// 	console.error(error);
		// 	process.exit(1);	
		// }
	}


}

const ssr = new Server();
ssr.init();