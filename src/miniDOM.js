import MiniUtils from "./MiniUtils.js";
import { HTMLattributes } from './miniConstants.js'
export default class miniDOM {

    miniDOM;
    #ids;
    #classLists;
    #tagLists;
    #nodeWatchers = new Map();
    #updates = new Map();


    constructor(node) {
        const util = new MiniUtils()
        this.miniDOM = util.toJSON(node);
        this.#ids = util.ids
        this.#classLists = util.classLists
        this.#tagLists = util.tagLists
    }

    // Create Virtual Node
    createNode(elementName) {
        const util = new MiniUtils()
        const elementNode = util.toJSON(document.createElement(elementName))
        return elementNode;
    }

    // Copy Virtual Node
    cloneNode(node) {
    }

    // Create Virtual Node
    createTextNode(text) {
        const util = new MiniUtils()
        const element = document.createTextNode(text);
        const elementNode = util.getAttributes(element)
        return elementNode;
    }

    // Append Virtual Node
    appendNode(parentNode, childNode) {
        parentNode.childNodes.push(childNode)
        parentNode.element.append(childNode.element)
        childNode.parentNode = parentNode;
    }

    // Remove Virtual Node
    removeNode() {
    }

    // get Virtual Node by ID
    getElementById(id) {
        return this.#ids[id]
    }

    // get Virtual Node by class
    getElementsByClassName(...classNames) {
        let results = [];

        for (let i = 0; i < classNames.length; i++) {
            results = [...results, ...this.#classLists[classNames[i]]];
        }
        return Array.from(new Set(results));
    }

    // get Virtual Node by tagname
    getElementsByTagName(tagName) {
        return this.#tagLists[tagName.toUpperCase()];
    }

    // get Virtual Node by query
    querySelector(tagName) {
        return this.#tagLists[tagName.toUpperCase()];
    }

    // get Virtual Nodes by query
    querySelectorAll(tagName) {
        return this.#tagLists[tagName.toUpperCase()];
    }

    // Subscribe to changes on Virtual Node
    subscribeNode(object, fn) {
        let fns = this.#nodeWatchers.get(object);
        if (!fns) {
            fns = [];
        }
        fns.push(fn);
        this.#nodeWatchers.set(object, fns);
    }

    // unsubscribe to changes for Virtual Node
    unsubscribeNode(object, fn) {
        let fns = this.#nodeWatchers.get(object);
        if (!fns) {
            fns = [];
        }
        fns.splice(fns.indexOf(fn), 1);
        this.#nodeWatchers.set(object, fns);
    }

    // update Virtual Node
    update(object, path, value) {
        if (HTMLattributes.includes(path)) {
            object[path] = value;
        }
        const update = this.#updates.get(object) || []
        if (!update.includes(path)) update.push(path)
        this.#updates.set(object, update)
        
        const fns = this.#nodeWatchers.get(object);
        if (fns) {
            for (let i = 0; i < fns.length; i++) {
                fns[i](object)
            }
        }
    }

    // Delete State
    deleteState() {

    }

    // Subscribe for states change
    subscribeState() {

    }

    // unubscribe for states change
    unsubscribeState() {

    }

    // Update Real DOM Node
    #updateNode(object, path) {
        if (HTMLattributes.includes(path)) {
            object.element[path] = object[path];
        }
    }

    // Amend Changes to DOM
    updateDOM() {
        for (let [key, value] of this.#updates) {
            for (let i = 0; i < value.length; i++) {
                this.#updateNode(key, value[i])
            }
            this.#updates.delete(key);
        }
    }

    // add Event Listener
    addEventListener() {

    }

    // remove Event Listener
    removeEventListener() {

    }

    // remove Event Listener
    removeAllEventListener() {

    }

    // remove Event Listener
    listAllEventListener() {

    }

}