import http from "http"
import WebSocketServer from "./websocket";

class Server {
    public static instance: Server;
    server = new http.Server();
    wsServer: WebSocketServer;

    private constructor(port: number) {
        this.server.listen(port, () => console.log("---> Server up listening at port", port))
        this.wsServer = new WebSocketServer(this.server);
    }

    public static getInstance(): Server {
        if (this.instance == null) {
            return new Server(parseInt(process.env.PORT || "8080"))
        }
        return this.instance
    }
}

export default Server;