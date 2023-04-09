import { HTMLattributes } from './miniConstants.js'
export default class MiniUtils{
    ids = {};
    classLists = {};
    tagLists = {};
    
    // Get All attributes of DOM Node
    getAttributes(node) {
        const virtNode = {};
        for (let i = 0; i < HTMLattributes.length; i++) {
            if (node[HTMLattributes[i]]) {
                virtNode[HTMLattributes[i]] = node[HTMLattributes[i]]
            }
        }

        if (node.classList) {
            for (let i = 0; i < node.classList.length; i++) {
                if (!this.classLists[node.classList[i]]) {
                    this.classLists[node.classList[i]] = []
                }
                this.classLists[node.classList[i]].push(virtNode)
            }
        }
        if (node.id) {
            this.ids[node.id] = virtNode;
        }
        if (!this.tagLists[virtNode.tagName]) {
            this.tagLists[virtNode.tagName] = []
        }
        this.tagLists[virtNode.tagName].push(virtNode);
        virtNode.childNodes = [];
        virtNode.element = node;
        return virtNode;
    }

    // Convert DOM Node and it's childrens to JS Object
    toJSON(node) {
        const virtDOM = this.getAttributes(node);
        for (let i = 0; i < node.childNodes.length; i++) {
            const child = this.toJSON(node.childNodes[i]);
            child.order = i;
            child.parentNode = virtDOM;
            virtDOM.childNodes[virtDOM.childNodes.length] = child;
        }
        return virtDOM;
    }
}