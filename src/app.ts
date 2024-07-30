
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/Server";
import { envs } from './config/envs';

(async () => {
    main();
  })();


  async function main() {    
  
    const server = new Server({
      port: envs.PORT,
      routes:AppRoutes.routes,
    });
  
    server.start();
  }