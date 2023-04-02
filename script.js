import { MiniComponent, MiniDOM } from './src/index.js'

const container = document.createElement('div');
document.body.appendChild(container);

const component = new MiniComponent(container);

const clicks = component.useState(0)

component.createTemplate([
    {
        tagName: 'div',
        className: 'container mx-auto',
        childNodes: [
            {
                tagName: 'h1',
                onclick: function () {
                    clicks.update(clicks.get() + 1)
                    console.log(`I was clicked ${clicks.get()} time(s)`)
                },
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
                tagName: 'h1',
                className: 'text-3xl',
                childNodes: [
                    {
                        text: 'Ankit Sharma'
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
    }
])

component.render()