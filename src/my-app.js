// Import Polymer
import {Element} from '../node_modules/@polymer/polymer/polymer-element.js';

/* Import the webcomponents we would like to use.
Can be installed by typing 'npm install --save @polymer/app-location@next' */
import '../node_modules/@polymer/app-route/app-location.js';
import '../node_modules/@polymer/app-route/app-route.js';
import '../node_modules/@polymer/app-layout/app-header/app-header.js';
import '../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js';
import '../node_modules/@polymer/iron-pages/iron-pages.js';
import '../node_modules/@polymer/paper-progress/paper-progress.js';

/* Import our custom elements. */
import './elements/my-repository-list.js';
import './elements/my-404.js';

/* Import our shared styles. Typography, Colors, and Flex Layout. */
import './styles/my-shared-styles.js';

// Uses this instead of lit-html for simplicity
const html = (template) => template.toString();

export class MyApp extends Element {
    static get template() {
        // using html before our interpolated string gives us linting from our editor
        // plugin lit-html
        return html `
        <style>
            /* Use of semantic elements are useful with code readability.
            you could also make a div with a class of .app-container. */
            app-container {
                /* Iron-flex-layout mixin imported in shared-styles
                other common values are --layout-horizontal and --layout-center */
                @apply --layout-vertical;
            }

            paper-progress {
                width: 100%;
                /* These are variables exposed to us from paper-progress api for overriding default styling */
                --paper-progress-active-color: var(--paper-blue-500);
                --paper-progress-container-color: var(--paper-blue-200);
            }

            /* This is one way bound to [[isLoading]] on paper-progress.
            This will hide the paper-progress loader when we are not loading anything.
            Another option to use here would be [hidden] { display: none } but the element
            would be taken out of the dom and the user would see shifting on the page. */
            [invisible] {
                visibility: hidden;
            }

            app-toolbar {
                /* This is from material design colors. This is imported from paper-styles => colors
                A complete list of colors are available here https://material.io/guidelines/style/color.html. */
                background-color: var(--paper-blue-500);
                color: white;
            }

            iron-pages {
                padding: 16px;
            }
        </style>
        <!-- app-location provides us with our route -->
        <app-location route="{{route}}"></app-location>

        <!-- app-route gives us pattern matching on the URL which is then used for determining if this view is active via the isActive property.
        app-route also gives us variables from the URL via the routeData property. Research app-route api on webcomponents.org for more information -->
        <app-route
            route="{{route}}"
            pattern="/:page"
            data="{{routeData}}"
            active="{{isActive}}">
        </app-route>

        <!-- app-layout component for easily creating a toolbar -->
        <app-header reveals>
            <app-toolbar>
                <div main-title>Learn Polymer</div>
                <!-- 
                    indeterminate means the paper-progress bar will animate forever.
                    It is a property that paper-progress gives us. We use the invisible attribute
                    to hide this progress bar if we are not loading anything. We must provide the $
                    to tell polymer that we want this as an attribute on the DOM and not a property that
                    is just passed into paper-progress.
                -->
                <paper-progress invisible$="[[!isLoading]]" indeterminate bottom-item></paper-progress>
            </app-toolbar>
        </app-header>
        <app-container>
            <!-- This is where we have a various view components. Whenever the route changes it will attempt to select a page from the iron-pages and render the component
             where the name matches. -->
            <iron-pages selected="[[page]]" attr-for-selected="name">
                <!-- bind isLoading into our view two way so our view can modify it. When we set up this property in my-repository-list
                we will set it up with notify: true so that my-app is notified when it gets changed. Also note that we must tell describe the property in hyphen case
                to our view. Polymer will camelcase the property for us. -->
                <my-repository-list is-loading="{{isLoading}}" name="repository-list"></my-repository-list>
                <my-404 name="404"></my-404>
            </iron-pages>
        </app-container>
    `;
    }

    // Polymer Properties
    static get properties() {
        return {
            page: {
                type: String,
                reflectToAttribute: true
            },
            isLoading: {
                type: Boolean,
                value: false
            },
            isActive: {
                type: Boolean
            }
        }
    }

    // Alternative method for declaring observers in polymer.
    static get observers() {
        return ['_routePageChanged(routeData.page)', '_isActiveChanged(isActive)'];
    }

    // Triggered whenever isActive changes
    _isActiveChanged(isActive) {
        console.log('isActive', isActive);
        if (!isActive) {
            // route is not active
            return;
        }
        // route is active
    }

    // Triggered whenever routePage changes
    _routePageChanged(page) {
        const routes = ['repository-list'];
        this.page = page || 'repository-list'; // defaults to home route if no page

        // if we are trying to access anything other than / or /repository-list return 404 page
        if (routes.indexOf(this.page) === -1){
            this.page = '404';
        }
    }
}

customElements.define('my-app', MyApp);