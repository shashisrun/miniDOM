class miniDOM {

    miniDOM;
    ids = {};
    classLists = {};
    tagLists = {};
    nodeWatchers = new Map();
    updates = new Map();
    states = {};
    stateWatchers = new Map();


    constructor(node) {
        this.miniDOM = this.toJSON(node);
    }


    getAttributes(node) {
        const virtNode = {};
        const attributes = node.attributes;
        for (let i = 0; i < attributes.length; i++) {
            switch (attributes[i].nodeName) {
                case 'class':
                    virtNode.classlist = [...node.classList];
                    for (let i = 0; i < virtNode.classlist.length; i++) {
                        if (!this.classLists[virtNode.classlist[i]]) {
                            this.classLists[virtNode.classlist[i]] = [];
                        }
                        this.classLists[virtNode.classlist[i]].push(virtNode);
                    }
                    break;
                case 'id':
                    virtNode.id = node.id;
                    this.ids[node.id] = virtNode
                    break;
                default:
                    virtNode.classlist = [];
                    virtNode[attributes[i].nodeName] = attributes[i].nodeValue;
                    break;
            }
        }
        virtNode.childrens = [];
        virtNode.tagName = node.tagName;

        if (!this.tagLists[virtNode.tagName]) {
            this.tagLists[virtNode.tagName] = []
        }
        this.tagLists[virtNode.tagName].push(virtNode);
        if (node.value) virtNode.value = node.value;
        virtNode.element = node;
        return virtNode;
    }

    toJSON(node) {
        const virtDOM = this.getAttributes(node);
        for (let i = 0; i < node.childNodes.length; i++) {
            if (!node.childNodes[i].attributes) {
                const child = {}
                child.key = node.childNodes[i].nodeName;
                child.value = node.childNodes[i].nodeValue;
                virtDOM.childrens[i] = child;
            } else {
                const child = this.toJSON(node.childNodes[i]);
                child.parentNode = virtDOM;
                virtDOM.childrens[i] = child;
            }
        }
        return virtDOM;
    }

    createElement(elementName) {
        const node = {
            tagName: elementName
        }
        node.classList = [];
        node.childrens = [];
        return node;
    }

    append(parentNode, childNode) {
        parentNode.childrens.push(childNode)
        childNode.parentNode = parentNode;
        return node;
    }

    getElementById(id) {
        return this.ids[id]
    }

    getElementsByClassName(...classNames) {
        let results = [];

        for (let i = 0; i < classNames.length; i++) {
            results = [...results, ...this.classLists[classNames[i]]];
        }
        return Array.from(new Set(results));
    }

    getElementsByTagName(tagName) {
        return this.tagLists[tagName.toUpperCase()];
    }

    subscribeNode(object, fn) {
        let fns = this.nodeWatchers.get(object);
        if (!fns) {
            fns = [];
        }
        fns.push(fn);
        this.nodeWatchers.set(object, fns);
    }


    unsubscribeNode(object, fn) {
        let fns = this.nodeWatchers.get(object);
        if (!fns) {
            fns = [];
        }
        fns.splice(fns.indexOf(fn), 1);
        this.nodeWatchers.set(object, fns);
    }

    update(object, path, value, avoidLog) {
        if (path.length == 1 && path[0] !== 'classLists' && path[0] !== 'tagName' && path[0] !== 'childrens') {
            object[path[0]] = value instanceof Function ? value() : value;
        } else if (path[0] === 'childrens') {
            object.childrens[path[1]].value = value instanceof Function ? value() : value;
        } else if (path[0] === 'classList') {
            if (object.classList.length != object.element.classList.length || object.classList.length != Array.of(new set([...object.classList, ...object.element.classList])).length) {
                object.classList = value instanceof Function ? value() : value;
            }
        }
        if (!avoidLog) {
            this.updates.set(object, {

                path: path,
                value: value instanceof Function ? value : null
            })
        }

        const fns = this.nodeWatchers.get(object);
        if (fns) {
            for (let i = 0; i < fns.length; i++) {
                fns[i](object)
            }
        }
    }

    createState(key, value) {
        if (this.states.hasOwnProperty(key)) {
            throw 'State Already Exits';
        }
        this.states[key] = value;
    }
    updateState(key, value) {
        if (!this.states.hasOwnProperty(key)) {
            throw 'State Does Not Exits';
        }
        this.states[key] = value;
    }
    useState(key) {
        if (!this.states.hasOwnProperty(key)) {
            throw 'State Does Not Exits';
        }
        return this.states[key];
    }

    updateNode(object, path) {
        if (path.length == 1 && path[0] !== 'classLists' && path[0] !== 'tagName' && path[0] !== 'childrens') {
            object.element.setAttribute(path[0], object[path[0]]);
        } else if (path[0] === 'childrens') {
            object.element.childNodes[path[1]].nodeValue = object.childrens[path[1]].value
        } else if (path[0] === 'classList') {
            if (object.classList.length != object.element.classList.length || object.classList.length != Array.of(new set([...object.classList, ...object.element.classList])).length) {
                object.element.setAttribute('class', object.classList.join(' '));
            }
        }
    }

    updateDom() {
        for (let [key, value] of this.updates) {
            if (value) {
                this.update(key, value.path, value.value, true)
            } else {
                this.update.delete(key);
            }
            this.updateNode(key, value.path)
        }
        for (let i = 0; i < this.updates.length; i++) {
        }
    }

}

module.exports = miniDOM