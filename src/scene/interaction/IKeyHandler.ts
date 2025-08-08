export interface IKeyHandler {
    processKeyDown(event: KeyboardEvent): void;
    processKeyUp(event: KeyboardEvent): void;
    clean(): void;
}