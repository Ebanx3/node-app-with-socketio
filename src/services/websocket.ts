import io, { Socket } from "socket.io";
import http from "http"
import { Lobby } from "../types/lobby";

class WebSocketServer {
    ws: io.Server;
    lobby: Lobby;

    constructor(app: http.Server) {
        this.ws = new io.Server(app, {
            cors: {
                origin: "*"
            }
        })
        this.lobby = Lobby.getInstance();

        this.ws.on("connection", (socket: Socket) => {
            socket.emit("username", "need username")

            socket.on("username", (data) => {
                this.lobby.joinLobby(data, socket.id)
                this.ws.emit("online-players", this.lobby.onlinePlayers().toString())
                socket.broadcast.emit("message", `${data} se acaba de unir`)
            })

            socket.on("change-username", (data) => {
                const dataSplitted = data.split("-*-")
                this.lobby.joinLobby(dataSplitted[1], socket.id)
            })

            socket.on("message", (data) => {
                this.ws.emit("message", data);
            })

            socket.on("new-game", (data) => {
                //username-*-roomTitle-*-security-*-pin
                const info = data.split("-*-");
                socket.join(info[1]);
                this.lobby.createRoom(info[0], info[1], info[2], info[3]);
                this.ws.emit("active-games", JSON.stringify(this.lobby.getRooms()));
            })

            socket.on("delete-game", (data) => {
                //username
                console.log(data);
                this.lobby.deleteGame(data);
                this.ws.emit("active-games", JSON.stringify(this.lobby.getRooms()));
            })

            socket.on("join-game", (data) => {
                //username-*-roomName
                const dataSplitted = data.split("-*-");
                socket.join(dataSplitted[1]);
                this.lobby.joinGame(dataSplitted[0], dataSplitted[1]);
                this.ws.to(dataSplitted[1]).emit("start-game", JSON.stringify(this.lobby.getRoom(dataSplitted[1])?.getGame()));
                this.ws.emit("active-games", JSON.stringify(this.lobby.getRooms()));
            })

            socket.on("add-word", (data) => {
                //roomName-*-word
                const dataSplitted = data.split("-*-");
                this.lobby.getRoom(dataSplitted[0])?.setWord(dataSplitted[1]);
                this.ws.to(dataSplitted[0]).emit("update-game", JSON.stringify(this.lobby.getRoom(dataSplitted[0])?.getGame()));
            })

            socket.on("try-letter", (data) => {
                //roomName-*-letter
                const dataSplitted = data.split("-*-");
                this.lobby.getRoom(dataSplitted[0])?.tryLetter(dataSplitted[1]);
                this.ws.to(dataSplitted[0]).emit("update-game", JSON.stringify(this.lobby.getRoom(dataSplitted[0])?.getGame()));
                this.lobby.checkRoom(dataSplitted[0]);
                this.ws.emit("active-games", JSON.stringify(this.lobby.getRooms()));
            })

            socket.on("disconnect", () => {
                this.lobby.quitLobby(socket.id);
                this.lobby.inspectLobby();
                this.ws.emit("online-players", this.lobby.onlinePlayers().toString())
            })
        })

    }


}



export default WebSocketServer;