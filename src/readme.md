
# MiniDOM

To understand the concept of MiniDOM, we have to understand how virtual DOM works.

Virtual DOM creates a representation of real DOM and, whenever there is change, it compares the changes between and real and virtual DOM, have you ever thought, how would it compare those changes?

There could be two approaches to it.

    1. Check every node in the DOM, to do this they have to go to evry every available node and check there all properties against the real DOM and update if there is difference
    2. By converting it to the string and comparing the difference in string to update the dom.

I found the above two methods, really inefficient. To tackle the changes in node, I have divided DOM nodes to JSON nodes, and segregated nodes between dynamic node and static node. So whenever there is change in state, the dynamic nodes come into the scenes, checks for there values and if they found a change they will trigger update on themeselves.

Every update triggered, becomes a log and by using that log, the updateDOM function batches the changes and updates the DOM at a specific where change is triggered.

```
const container = document.createElement('div');
document.body.appendChild(container);

const component = new MiniComponent(container);

const clicks = component.useState(0)
const inputText = component.useState('')

component.createTemplate([
    {
        tagName: 'div',
        className: component.dynamic(() => `container mx-auto ${clicks.get() % 2 === 0 ? 'bg-red-100 text-white' : ''}x `),
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
                    },
                    {
                        text: 'component.dynamic(() => `I was clicked ${clicks.get()} time(s)`)'
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

```

This project is i it's early development phase and currently is solo project.

Contribution of ideas and code are welcomed!.
