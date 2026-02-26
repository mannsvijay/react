function customRender(reactElement, container) {
        const domELement = document.createElement(reactElement.type)
        domELement.innerHTML = reactElement.children
        domELement.setAttribute('href',reactElement.props.href)
        domELement.setAttribute('target',reactElement.props.target)

        container.appendChild(domELement);

    }

const reactElement = {
    type : 'a',
    props: {
        href : 'https://www.google.com',
        target : '_blank'
    },
    children : "google"
} 

const mainContainer = document.querySelector('#root');

customRender(reactElement, mainContainer)