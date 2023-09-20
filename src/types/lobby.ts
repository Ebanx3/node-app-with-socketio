import { Room, RoomSecurity } from "./room";
import { User } from "./user";

export class Lobby {
    public static instance: Lobby;
    users: Map<string, string>;
    rooms: Room[];

    private constructor() {
        this.users = new Map();
        this.rooms = [];
    }

    public static getInstance() {
        if (!Lobby.instance) {
            Lobby.instance = new Lobby();
        }
        return Lobby.instance;
    }

    joinLobby(username: string, socketId: string) {
        this.users.set(username, socketId)
    }

    quitLobby(socketId: string) {
        for (let [key, value] of this.users.entries()) {
            if (value === socketId) {
                this.users.delete(key);
                return;
            }
        }
    }

    getUserByName(username: string): User | null {
        const sid = this.users.get(username);
        if (!sid) {
            return null
        }
        return { username, socketId: sid }
    }

    onlinePlayers(): number {
        return this.users.size;
    }

    createRoom(username: string, roomName: string, secure: RoomSecurity, pin?: number) {
        const user = this.getUserByName(username);
        if (!user) { return }
        const newRoom = new Room(roomName, user, secure, pin);
        this.rooms.push(newRoom);
    }

    getRooms() {
        const games: { roomName: string, user1: string | undefined, user2: string | undefined, security: string }[] = this.rooms.map(room => room.getRoomDataToShow()).filter(room => room.user2 === undefined);
        return games;
    }

    getRoom(roomName: string) {
        const index = this.rooms.findIndex(room => room.name === roomName);
        if (index < 0) return;
        return this.rooms[index];
    }

    checkRoom(roomName: string) {
        const index = this.rooms.findIndex(room => room.name === roomName);
        if (index < 0) return;
        if (this.rooms[index].game?.winner)
            this.rooms.splice(index, 1);
    }

    joinGame(username: string, roomName: string) {
        const index = this.rooms.findIndex(room => room.name === roomName);
        if (index < 0) return;
        const user = this.getUserByName(username);
        if (user !== null) {
            this.rooms[index].joinRoom(user);
            this.rooms[index].startGame();
        }

    }

    deleteGame(username: string) {
        this.rooms = this.rooms.filter(room => room.users[0].username !== username)
    }

    inspectLobby() {
        console.log("--- LOBBY ----------------------------")
        console.log(this.users);
        this.rooms.forEach(room => {
            room.inspectRoom();
        });
    }
}
