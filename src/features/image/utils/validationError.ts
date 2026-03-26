export class ValidationErrors extends Error {
    messages: Array<string>;
    constructor(messages: Array<string>) {
        super()
        Object.setPrototypeOf(this, ValidationErrors.prototype);
        this.name = "validationErrors";
        this.messages = messages;
    }
}