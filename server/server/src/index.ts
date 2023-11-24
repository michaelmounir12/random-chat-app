import { Elysia,t } from "elysia";
// import { authController } from "./controllers";
import {authController} from "./controllers/auth"
import {cors} from '@elysiajs/cors'
import { webSocketController} from "./controllers/websocket"

const app = new Elysia()
      .use(cors())

.use(authController)
.use(webSocketController)
app.listen(4000);


