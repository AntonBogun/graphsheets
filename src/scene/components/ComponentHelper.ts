import { IClickable } from "../interaction/IClickable";
import { ISelectable } from "../interaction/ISelectable";
import { Vec2d } from "../../geometry/Vec2d.js";
import { IMovable } from "../interaction/IMovable.js";
import { IHoverable } from "../interaction/IHoverable.js";
export class ComponentHelper {
    static isSelectable(component: any): component is ISelectable {
        return ('boundingBox' in component) && ('isSelected' in component);
    }
    static isClickable(component: any): component is IClickable {
        return ('isDown' in component);
    }
    static isMovable(component: any): component is IMovable {
        return ('position' in component) && ('setPosition' in component);
    }
    static isHoverable(component: any): component is IHoverable {
        return 'isHovered' in component;
    }
}