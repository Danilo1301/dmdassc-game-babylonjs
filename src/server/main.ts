import '../../src/config/environment'
import MasterServer from './masterServer';
//import Server from '../src/server/server'

const port = parseInt(process.env.PORT) || 3000;

const server = new MasterServer();
server.listen(port);