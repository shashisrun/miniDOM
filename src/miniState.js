export default class miniState {
    
    #state;
    #subscriptions = [];

    constructor(state) {
        this.#state = state;
    }

    // update State
    update(state) {
        this.#state = state;
        for (let i = 0; i < this.#subscriptions.length; i++) {
            this.#subscriptions[i](this.get())
        }
    }

    // get State
    get() {
        return this.#state;
    }

    subscribe(callback) {
        this.#subscriptions.push(callback)
    }

    unsubscribe(callback) {
        this.#subscriptions.splice(this.#subscriptions.indexOf(callback), 1);
    }
}