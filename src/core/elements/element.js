import createElement from './createElement';


export const div = props => createElement({el: 'div', ...props});

export const p = props => createElement({el: 'p', ...props});

export const span = props => createElement({el: 'span', ...props});

export const input = props => createElement({el: 'input', ...props});

export const textarea = props => createElement({el: 'textarea', ...props});

export const image = props => createElement({el: 'image', ...props});

