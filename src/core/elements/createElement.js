const setAttr = (el, attrs) => {
    if (!attrs) {
        return el;
    }
    for(var k in attrs) {
        if (attrs.hasOwnProperty(k) && attrs[k]) {
            el.setAttribute(k, attrs[k]);
        }
    }
    return el;
} 

const createElement = (args) => {

    { el, id, className, style, attribute, events, children } = args

    const el = document.createElement(el);
    
    if (id) {
        el.id = id;
    }

    if (className) {
        el.className = className;
    }
    
    if (style) {
        el.style = style;
    }
    if (attribute) {
        setAttr(el, attribute);
    }
    if (events && events.length) {
        for(let i = 0; i < events.length; i ++) {
            const target = events[i];
            el.addEventListener(target.name, target.callback);
        }
    }
    if (children && children.length) {
        for(let i = 0; i < children.length; i ++) {
            const target = children[i];

            switch(typeof target) {
                case 'string': 
                    el.innerHTML += target;
                    break;
                case 'function':
                    const child = target();
                    el.appendChild(child);
                default:
                    ;
            }
        }
    }
    return el;
}

export default createElement;