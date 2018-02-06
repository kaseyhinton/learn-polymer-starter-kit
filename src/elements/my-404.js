import {Element} from '../../node_modules/@polymer/polymer/polymer-element.js';
import '../styles/my-shared-styles.js';

const html = (template) => template.toString();

export class My404 extends Element {
    static get template() {
        return html `
       <h1>404</h1>
    `;
    }
}

customElements.define('my-404', My404);