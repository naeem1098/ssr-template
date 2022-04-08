import App from './app';
import { ApiFactory } from './factories/apiFactories';

const apiFactory = new ApiFactory();
const app = new App(apiFactory, 3000);

app.startServer();