export interface IMouseHandler {
    processMouseUp(event: MouseEvent, ...args: any[]): void;
    processMouseMove(event: MouseEvent, ...args: any[]): void;
    processMouseDown(event: MouseEvent, ...args: any[]): void;
}