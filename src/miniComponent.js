import miniDOM from "./miniDOM.js";
import miniState from "./miniState.js";

export default class miniComponent {

    #states = [];
    #functions = new Object();
    #registeredNodes = [];

    // use state
    useState(initState) {
        const current = this.#states.length;
        const state = new miniState(initState);
        this.#states[current] = state;
        this.#states[current].subscribe((state) => {
            for (let i = 0; i < this.#registeredNodes.length; i++) {
                this.updateComponent(this.#registeredNodes[i].node, this.#registeredNodes[i].object, this.#registeredNodes[i].path, this.#registeredNodes[i].functionName)
                this.#registeredNodes[i].node.updateDOM();
            }
        });
        return this.#states[current];
    }

    // render component
    renderComponent(elements, component) {
        for (let i = 0; i < elements.length; i++) {
            const range = document.createRange();
            
            // Make the parent of the first div in the document become the context node
            range.selectNode(elements[i].element);
            const documentFragment = range.createContextualFragment(component);

            const node = new miniDOM(documentFragment.childNodes[0])
            this.attachFunction(node)
            node.miniDOM.parentNode = elements[i];
            elements[i].childrens.push(node.miniDOM);
            elements[i].element.appendChild(node.miniDOM.element);
        }
    }

    createFunction(name, fn) {
        this.#functions[name] = fn
    }

    getFunction(name) {
        return this.#functions[name]()
    }


    attachFunction(node) {
        const fns = node.getPrivateFunctions()
        for (let j = 0; j < fns.length; j++) {
            const funcRegExp = /{{{([^}]+)}}}/g;
            const txt = node.getValue(fns[j].object, fns[j].path);
            const matches = [...txt.match(funcRegExp)];
            for (let k = 0; k < matches.length; k++) {
                const match = matches[k].replace(/{{{|}}}/g, '')
                this.#registeredNodes.push({
                    node: node,
                    path: fns[j].path,
                    functionName: match,
                    object: fns[j].object
                })
                this.updateComponent(node, fns[j].object, fns[j].path, match)
            }
        }
        node.updateDOM();
    }

    updateComponent(node, object, path, match) {
        const value = this.stringToFunction(match);
        node.update(object, path, value)
    }

    stringToFunction(functionName) {
        let func = this.#functions;
        const fns = functionName.split('.');
        for (let i = 0; i < fns.length; i++) {
            if (fns[i].includes('(') && fns[i].includes(')')) {
                func = func[fns[i].split('(')[0]]()
            } else {
                func = func[fns[i]]
            }
        }
        return func;
    }
}