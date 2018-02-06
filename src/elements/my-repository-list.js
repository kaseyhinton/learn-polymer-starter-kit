import {Element} from '../../node_modules/@polymer/polymer/polymer-element.js';
import {Debouncer} from '../../node_modules/@polymer/polymer/lib/utils/debounce.js';
import {timeOut} from '../../node_modules/@polymer/polymer/lib/utils/async.js';
import '../../node_modules/@polymer/polymer/lib/elements/dom-repeat.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/iron-image/iron-image.js';
import '../styles/my-shared-styles.js';

const html = (template) => template.toString();

export class MyRepositoryList extends Element {
    static get template() {
        return html `
        <style>
            a {
                display: block;
                text-decoration: none;
                color: var(--paper-grey-700);
                transition: .5s ease;
                padding: 8px 0;
            }

            a:hover {
                color: var(--paper-blue-500);
            }

            repository-owner-container {
                @apply --layout-horizontal;
                padding: 16px 0;
            }

            repository-owner {
                @apply --paper-font-title;
                @apply --layout-self-center;
                padding-left: 8px;
                color: var(--paper-blue-500);
            }

            error-message {
                padding: 16px 0;
                @apply --paper-font-title;
                color: var(--paper-red-500);
            }

            iron-image {
                width: 80px;
                height: 80px;
            }

            [hidden]{
                display: none;
            }
        </style>
        <paper-input label="Github Username" value="{{searchTerm}}"></paper-input>
        <error-message hidden$="[[!errorMessage]]">[[errorMessage]]</error-message>
        <repository-owner-container hidden$="[[errorMessage]]">
            <iron-image sizing="cover" src="[[owner.avatar_url]]"></iron-image>
            <repository-owner>[[owner.login]]</repository-owner>
        </repository-owner-container>
        <dom-repeat items="{{repositories}}">
            <template>
                <a href="[[item.html_url]]">[[_toLowerCase(item.full_name)]]</a>
            </template>
        </dom-repeat>
    `;
    }

    static get properties() {
        return {
            repositories: {
                type: Array,
                value: []
            },
            isLoading: {
                type: Boolean,
                notify: true
            },
            errorMessage: {
                type: String
            },
            searchTerm: {
                type: String
            },
            owner: {
                type: Object
            },
            _searchDebouncer: {
                type: Object
            }
        }
    }

    static get observers() {
        return ['_searchTermChanged(searchTerm)']
    }

    _reset(){
        this.errorMessage = undefined;
        this.owner = undefined;
        this.repositories = undefined;
    }

    _searchTermChanged(searchTerm) {
        if (!searchTerm) 
            return;
        this.isLoading = true;
        this._reset();
        // debounce searching so we don't spam githubs api
        this._searchDebouncer = Debouncer.debounce(this._searchDebouncer, timeOut.after(600), this._query.bind(this));
    }

    _query() {
        this.repositories = [];
        fetch(`https://api.github.com/users/${this.searchTerm}/repos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(res => {
                if (res.message === "Not Found") {
                    this.errorMessage = "Unable to find a user by that name";
                    this.isLoading = false;
                    return;
                }
                this.repositories = res;
                this.owner = res[0].owner;
                this.isLoading = false;
            });
    }

    _toLowerCase(str) {
        if (!str) 
            return;
        return str.toLowerCase();
    }

    connectedCallback() {
        super.connectedCallback();
        // do things after connected'
    }
}

customElements.define('my-repository-list', MyRepositoryList);