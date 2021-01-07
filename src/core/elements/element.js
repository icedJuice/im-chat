import createElement from './createElement';

export const creat = (el, props) => {
    let newPro = null;
    if (typeof props === 'string') {
        newPro = {
            children: [props];
        }
    }
    return createElement({el, ...{newPro || props || {}}})
}

export const div = props => ;

export const p = props => creat('div', props);

export const span = props => creat('span', props);

export const input = props => creat('input', props);

export const textarea = props => creat('textarea', props);

export const image = props => creat('image', props);

