import { IClickable } from "../interaction/IClickable";
import { ISelectable } from "../interaction/ISelectable";

export class ComponentHelper {
    static isSelectable(component: any): component is ISelectable {
        return ('boundingBox' in component) && ('isSelected' in component);
    }
    static isClickable(component: any): component is IClickable {
        return ('isDown' in component);
    }
}