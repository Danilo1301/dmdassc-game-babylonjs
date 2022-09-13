import '../src/config/environment'
import Server from '../src/server/server'

const port = parseInt(process.env.PORT) || 3000;

const server = new Server();
server.listen(port);