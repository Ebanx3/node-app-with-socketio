"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const websocket_1 = __importDefault(require("./websocket"));
class Server {
    constructor(port) {
        this.server = new http_1.default.Server();
        this.server.listen(port, () => console.log("---> Server up listening at port", port));
        this.wsServer = new websocket_1.default(this.server);
    }
    static getInstance() {
        if (this.instance == null) {
            return new Server(parseInt(process.env.PORT || "8080"));
        }
        return this.instance;
    }
}
exports.default = Server;
