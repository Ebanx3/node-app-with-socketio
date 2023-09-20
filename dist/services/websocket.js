"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const lobby_1 = require("../types/lobby");
class WebSocketServer {
    constructor(app) {
        this.ws = new socket_io_1.default.Server(app, { cors: {} });
        this.lobby = lobby_1.Lobby.getInstance();
        this.ws.on("connection", (socket) => {
            socket.emit("username", "need username");
            socket.on("username", (data) => {
                this.lobby.joinLobby(data, socket.id);
                this.ws.emit("online-players", this.lobby.onlinePlayers().toString());
                socket.broadcast.emit("message", `${data} se acaba de unir`);
            });
            socket.on("change-username", (data) => {
                const dataSplitted = data.split("-*-");
                this.lobby.joinLobby(dataSplitted[1], socket.id);
            });
            socket.on("message", (data) => {
                this.ws.emit("message", data);
            });
            socket.on("new-game", (data) => {
                //username-*-roomTitle-*-security-*-pin
                const info = data.split("-*-");
                socket.join(info[1]);
                this.lobby.createRoom(info[0], info[1], info[2], info[3]);
                this.ws.emit("active-games", JSON.stringify(this.lobby.getRooms()));
            });
            socket.on("delete-game", (data) => {
                //username
                console.log(data);
                this.lobby.deleteGame(data);
                this.ws.emit("active-games", JSON.stringify(this.lobby.getRooms()));
            });
            socket.on("join-game", (data) => {
                var _a;
                //username-*-roomName
                const dataSplitted = data.split("-*-");
                socket.join(dataSplitted[1]);
                this.lobby.joinGame(dataSplitted[0], dataSplitted[1]);
                this.ws.to(dataSplitted[1]).emit("start-game", JSON.stringify((_a = this.lobby.getRoom(dataSplitted[1])) === null || _a === void 0 ? void 0 : _a.getGame()));
                this.ws.emit("active-games", JSON.stringify(this.lobby.getRooms()));
            });
            socket.on("add-word", (data) => {
                var _a, _b;
                //roomName-*-word
                const dataSplitted = data.split("-*-");
                (_a = this.lobby.getRoom(dataSplitted[0])) === null || _a === void 0 ? void 0 : _a.setWord(dataSplitted[1]);
                this.ws.to(dataSplitted[0]).emit("update-game", JSON.stringify((_b = this.lobby.getRoom(dataSplitted[0])) === null || _b === void 0 ? void 0 : _b.getGame()));
            });
            socket.on("try-letter", (data) => {
                var _a, _b;
                //roomName-*-letter
                const dataSplitted = data.split("-*-");
                (_a = this.lobby.getRoom(dataSplitted[0])) === null || _a === void 0 ? void 0 : _a.tryLetter(dataSplitted[1]);
                this.ws.to(dataSplitted[0]).emit("update-game", JSON.stringify((_b = this.lobby.getRoom(dataSplitted[0])) === null || _b === void 0 ? void 0 : _b.getGame()));
                this.lobby.checkRoom(dataSplitted[0]);
                this.ws.emit("active-games", JSON.stringify(this.lobby.getRooms()));
            });
            socket.on("disconnect", () => {
                this.lobby.quitLobby(socket.id);
                this.lobby.inspectLobby();
                this.ws.emit("online-players", this.lobby.onlinePlayers().toString());
            });
        });
    }
}
exports.default = WebSocketServer;
