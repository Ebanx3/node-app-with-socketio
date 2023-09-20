import { Game } from "./game";
import { User } from "./user";

export type RoomSecurity = "public" | "private";

export class Room {
    name: string;
    users: [u1: User, u2: User | null];
    security: RoomSecurity;
    pin?: number;
    game?: Game;

    constructor(name: string, user: User, security: RoomSecurity, pin?: number) {
        this.users = [user, null];
        this.name = name;
        this.security = security;
        pin ? (this.pin = pin) : null;
    }

    inspectRoom() {
        console.log(`--------------------------------------
Room: ${this.name} -> user1: ${this.users[0]?.username} -> user2: ${this.users[1]?.username} -> ${this.security} -> ${this.pin}`);
    }

    getRoomDataToShow(): { roomName: string, user1: string | undefined, user2: string | undefined, security: string } {
        return { roomName: this.name, user1: this.users[0]?.username, user2: this.users[1]?.username, security: this.security }
    }

    joinRoom(user: User) {
        this.users[1] = user;
    }

    startGame() {
        if (this.users[1] !== null)
            this.game = { activeUser: this.users[0].username, round: 1, fails: 0, hiddenWord: "", discoveredWord: "", phase: "addNewWord" };
    }

    getGame() {
        const gameData = {
            activeUser: this.game?.activeUser,
            discoveredWord: this.game?.discoveredWord,
            round: this.game?.round,
            fails: this.game?.fails,
            phase: this.game?.phase,
            winner: this.game?.winner
        }
        return { game: gameData, user1: this.users[0]?.username, user2: this.users[1]?.username, roomName: this.name };
    }

    setWord(newWord: string) {
        if (this.game) {
            this.game.hiddenWord = newWord;
            for (let i = 0; i < newWord.length; i++) {
                this.game.discoveredWord += "_"
            }
            this.game.phase = "guessWord";
            this.game.activeUser = this.users[0].username === this.game.activeUser ? this.users[1]!.username : this.users[0].username;
        }
    }

    tryLetter(char: string) {
        const index = this.game!.hiddenWord.indexOf(char);
        if (index < 0) {
            this.game!.fails++;
            if (this.game!.fails === 6) {
                this.game!.winner = this.game!.activeUser === this.users[0].username ? this.users[1]!.username : this.users[0].username;
            }
        }
        else {
            const splitted = this.game!.discoveredWord.split("");
            for (let i = 0; i < splitted.length; i++) {
                if (this.game!.hiddenWord[i] === char)
                    splitted[i] = char
            }
            this.game!.discoveredWord = splitted.join("");
            if (this.game!.discoveredWord === this.game!.hiddenWord) {
                this.game!.winner = this.game!.activeUser
            }
        }

    }
}
