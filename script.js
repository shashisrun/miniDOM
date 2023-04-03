import { MiniComponent } from './src/index.js'

const container = document.createElement('div');
document.body.appendChild(container);

const component = new MiniComponent(container);

const clicks = component.useState(0)
const inputText = component.useState('')

component.createTemplate([
    {
        tagName: 'div',
        className: component.dynamic(() => `container mx-auto ${clicks.get() % 2 === 0 ? 'bg-danger text-white' : ''}x `),
        onclick: function () {
            clicks.update(clicks.get() + 1)
            console.log(`I was clicked ${clicks.get()} time(s)`)
        },
        childNodes: [
            {
                tagName: 'h1',
                className: 'text-3xl',
                childNodes: [
                    {
                        text: component.dynamic(() => `I was clicked ${clicks.get()} time(s)`)
                    }
                ]
            },
            {
                tagName: 'h2',
                className: 'text-xl',
                childNodes: [
                    {
                        text: 'Kaise Ho tum'
                    }
                ]
            }
        ]
    },
    {
        tagName: 'div',
        className: 'container',
        childNodes: [
            {
                tagName: 'div',
                className: 'text-3xl',
                childNodes: [
                    {
                        tagName: 'input',
                        placeholder: `What's your name?`,
                        value: component.dynamic(() => inputText.get()),
                        oninput: (event) => {
                            inputText.update(event.target.value)
                        }
                    }
                ]
            },
            {
                tagName: 'h1',
                className: 'text-xl',
                childNodes: [
                    {
                        text: component.dynamic(() => inputText.get() == '' ? 'Naam to batao' :`Kaise Ho ${inputText.get()}?`)
                    }
                ]
            }
        ]
    }
])

component.render()

console.log(component.miniDOM)