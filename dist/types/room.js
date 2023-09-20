"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
class Room {
    constructor(name, user, security, pin) {
        this.users = [user, null];
        this.name = name;
        this.security = security;
        pin ? (this.pin = pin) : null;
    }
    inspectRoom() {
        var _a, _b;
        console.log(`--------------------------------------
Room: ${this.name} -> user1: ${(_a = this.users[0]) === null || _a === void 0 ? void 0 : _a.username} -> user2: ${(_b = this.users[1]) === null || _b === void 0 ? void 0 : _b.username} -> ${this.security} -> ${this.pin}`);
    }
    getRoomDataToShow() {
        var _a, _b;
        return { roomName: this.name, user1: (_a = this.users[0]) === null || _a === void 0 ? void 0 : _a.username, user2: (_b = this.users[1]) === null || _b === void 0 ? void 0 : _b.username, security: this.security };
    }
    joinRoom(user) {
        this.users[1] = user;
    }
    startGame() {
        if (this.users[1] !== null)
            this.game = { activeUser: this.users[0].username, round: 1, fails: 0, hiddenWord: "", discoveredWord: "", phase: "addNewWord" };
    }
    getGame() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const gameData = {
            activeUser: (_a = this.game) === null || _a === void 0 ? void 0 : _a.activeUser,
            discoveredWord: (_b = this.game) === null || _b === void 0 ? void 0 : _b.discoveredWord,
            round: (_c = this.game) === null || _c === void 0 ? void 0 : _c.round,
            fails: (_d = this.game) === null || _d === void 0 ? void 0 : _d.fails,
            phase: (_e = this.game) === null || _e === void 0 ? void 0 : _e.phase,
            winner: (_f = this.game) === null || _f === void 0 ? void 0 : _f.winner
        };
        return { game: gameData, user1: (_g = this.users[0]) === null || _g === void 0 ? void 0 : _g.username, user2: (_h = this.users[1]) === null || _h === void 0 ? void 0 : _h.username, roomName: this.name };
    }
    setWord(newWord) {
        if (this.game) {
            this.game.hiddenWord = newWord;
            for (let i = 0; i < newWord.length; i++) {
                this.game.discoveredWord += "_";
            }
            this.game.phase = "guessWord";
            this.game.activeUser = this.users[0].username === this.game.activeUser ? this.users[1].username : this.users[0].username;
        }
    }
    tryLetter(char) {
        const index = this.game.hiddenWord.indexOf(char);
        if (index < 0) {
            this.game.fails++;
            if (this.game.fails === 6) {
                this.game.winner = this.game.activeUser === this.users[0].username ? this.users[1].username : this.users[0].username;
            }
        }
        else {
            const splitted = this.game.discoveredWord.split("");
            for (let i = 0; i < splitted.length; i++) {
                if (this.game.hiddenWord[i] === char)
                    splitted[i] = char;
            }
            this.game.discoveredWord = splitted.join("");
            if (this.game.discoveredWord === this.game.hiddenWord) {
                this.game.winner = this.game.activeUser;
            }
        }
    }
}
exports.Room = Room;
