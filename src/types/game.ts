export type Game = {
    activeUser: string;
    hiddenWord: string;
    discoveredWord: string;
    round: number;
    fails: number;
    phase: 'addNewWord' | 'guessWord';
    winner?: string;
}