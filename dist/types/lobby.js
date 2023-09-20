"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lobby = void 0;
const room_1 = require("./room");
class Lobby {
    constructor() {
        this.users = new Map();
        this.rooms = [];
    }
    static getInstance() {
        if (!Lobby.instance) {
            Lobby.instance = new Lobby();
        }
        return Lobby.instance;
    }
    joinLobby(username, socketId) {
        this.users.set(username, socketId);
    }
    quitLobby(socketId) {
        for (let [key, value] of this.users.entries()) {
            if (value === socketId) {
                this.users.delete(key);
                return;
            }
        }
    }
    getUserByName(username) {
        const sid = this.users.get(username);
        if (!sid) {
            return null;
        }
        return { username, socketId: sid };
    }
    onlinePlayers() {
        return this.users.size;
    }
    createRoom(username, roomName, secure, pin) {
        const user = this.getUserByName(username);
        if (!user) {
            return;
        }
        const newRoom = new room_1.Room(roomName, user, secure, pin);
        this.rooms.push(newRoom);
    }
    getRooms() {
        const games = this.rooms.map(room => room.getRoomDataToShow()).filter(room => room.user2 === undefined);
        return games;
    }
    getRoom(roomName) {
        const index = this.rooms.findIndex(room => room.name === roomName);
        if (index < 0)
            return;
        return this.rooms[index];
    }
    checkRoom(roomName) {
        var _a;
        const index = this.rooms.findIndex(room => room.name === roomName);
        if (index < 0)
            return;
        if ((_a = this.rooms[index].game) === null || _a === void 0 ? void 0 : _a.winner)
            this.rooms.splice(index, 1);
    }
    joinGame(username, roomName) {
        const index = this.rooms.findIndex(room => room.name === roomName);
        if (index < 0)
            return;
        const user = this.getUserByName(username);
        if (user !== null) {
            this.rooms[index].joinRoom(user);
            this.rooms[index].startGame();
        }
    }
    deleteGame(username) {
        this.rooms = this.rooms.filter(room => room.users[0].username !== username);
    }
    inspectLobby() {
        console.log("--- LOBBY ----------------------------");
        console.log(this.users);
        this.rooms.forEach(room => {
            room.inspectRoom();
        });
    }
}
exports.Lobby = Lobby;
