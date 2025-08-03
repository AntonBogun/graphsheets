import { ISelectable } from "./ISelectable";

export class ComponentHelper {
    static isSelectable(component: any): component is ISelectable {
        return ('boundingBox' in component) && ('isSelected' in component);
    }
}