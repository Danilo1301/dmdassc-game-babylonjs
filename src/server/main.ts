import '../../src/config/environment'
import { MasterServer } from './MasterServer'

const masterServer = new MasterServer();
masterServer.start()
//masterServer.listen(port);