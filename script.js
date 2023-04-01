import { miniComponent, miniDOM } from './src/index.js'

const doc = new miniDOM(document.body);
const component = new miniComponent();

// console.log(component.getAllStates());
// component.getAllStates()[0].update('Hi From Hello')

const hello = component.useState('Hello');

// console.log(hello.get())
// hello.update('Hi from new hello');
// console.log(hello.get())

component.createFunction('hello', () => { return hello.get() })
component.createFunction('onchange', (event) => { 
    hello.update(event.target.value)
 })

component.renderComponent([doc.miniDOM], `<div><input type='text' oninput='{{{onchange}}}' /><h1>hi {{{hello()}}} {{{hello()}}}</h1><div>`)

console.log(doc.miniDOM)