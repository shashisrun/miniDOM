import MiniDOM from "./MiniDOM.js";
import MiniState from "./MiniState.js";

export default class MiniComponent extends MiniDOM {

    #states = [];
    #componentState = [];
    #parent;
    #template;
    #dynamicContent = [];
    #registeredComponents = [];

    constructor(parent) {
        super(parent);
        this.#parent = this.miniDOM;
    }

    // use state
    useState(initState) {
        const current = this.#states.length;
        const state = new MiniState(initState);
        this.#states[current] = state;
        this.#states[current].subscribe(() => {
            this.updateComponent()        
        });
        return this.#states[current];
    }

    createTemplate(elements) {
        this.#template = elements;
    }

    updateComponent() {
        for (let i = 0; i < this.#registeredComponents.length; i++) {
            this.update(this.#registeredComponents[i].object, this.#registeredComponents[i].path, this.#registeredComponents[i].value())
        }
        this.updateDOM();
    }

    // render component
    render() {
        this.#parent.element.innerHTML = '';
        this.#parent.childNodes = [];
        for (let i = 0; i < this.#template.length; i++) {
            this.appendNode(this.#parent, this.generateNode(this.#template[i]))
        }
        this.updateDOM();
    }
    generateNode(templateNode) {
        const node = { ...templateNode };
        const element = this.createNode(node.tagName);
        delete node.tagName
        const attributes = Object.keys(node);
        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i] === 'childNodes') {
                const childNodes = node[attributes[i]];
                for (let j = 0; j < childNodes.length; j++) {
                    if (childNodes[j].tagName) {
                        const html = this.generateNode(childNodes[j]);
                        this.appendNode(element, html);
                    } else {
                        let text = this.createTextNode(childNodes[j].text);
                        if (childNodes[j].text instanceof Function) {
                            if (this.#dynamicContent.includes(childNodes[j].text)) {
                                text = this.createTextNode(childNodes[j].text())
                                this.#registeredComponents.push({
                                    object: text,
                                    path: 'nodeValue',
                                    value: childNodes[j].text
                                })
                            } else {
                                text = this.createTextNode(childNodes[j].text)
                            }
                        } else {
                            text = this.createTextNode(childNodes[j].text)
                        }
                        this.appendNode(element, text)
                    }
                }
            } else {
                if (node[attributes[i]] instanceof Function) {
                    if (this.#dynamicContent.includes(node[attributes[i]])) {
                        this.#registeredComponents.push({
                            object: element,
                            path: attributes[i],
                            value: node[attributes[i]]
                        })
                        this.update(element, attributes[i], node[attributes[i]]())
                    } else {
                        this.update(element, attributes[i], node[attributes[i]])
                    }
                } else {
                    this.update(element, attributes[i], node[attributes[i]])
                }
            }
        }
        return element;
    }

    dynamic(content) {
        this.#dynamicContent.push(content)
        return content
    }
}