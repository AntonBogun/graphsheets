import { UIRadioButton } from "./UIRadioButton";

export class UIRadioGroup {
    private radioButtons: UIRadioButton[];

    constructor() {
        this.radioButtons = [];
    }

    public addRadioButton(radioButton: UIRadioButton): void {
        this.radioButtons.push(radioButton);
        radioButton.radioGroup = this;
    }

    public processRadioButtonPressed(radioButton: UIRadioButton) {
        for(const button of this.radioButtons) {
            if(button === radioButton) {
                button.isDown = true;
            } else {
                button.isDown = false;
            }
        }
    }
}