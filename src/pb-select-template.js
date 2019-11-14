import { LitElement, html, css } from 'lit-element';
import { pbMixin } from './pb-mixin.js';
import "@polymer/paper-listbox";
import "@polymer/paper-item";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "@polymer/iron-ajax";

/**
 * `pb-select-template`: Switch between available page templates.
 * It loads the list of templates from `components-list-templates.xql`.
 * Emits a page reload on selection.
 *
 * @customElement  pb-select-template
 * @polymer
 * @demo demo/pb-select-odd.html
 * @appliesMixin pbMixin
 */
export class PbSelectTemplate extends pbMixin(LitElement) {
    static get properties() {
        return {/** The label to show on top of the dropdown menu */
            label: {
                type: String,
                value: 'Template'
            },
            /** Currently selected ODD. If this property is set, the component
             * will immediately load the list of ODDs from the server and select
             * the given ODD.
             */
            template: {
                type: String
            },
            _templates: {
                type: Array
            },
            ...super.properties
        };
    }

    constructor() {
        super();
        this.label = 'Template';
        this._templates = [];
    }

    firstUpdated() {
        PbSelectTemplate.waitOnce('pb-page-ready', (options) => {
            this.template = options.template;
            const loader = this.shadowRoot.getElementById('getTemplates');
            loader.url = options.endpoint + "/modules/lib/components-list-templates.xql";
            loader.generateRequest();
        });
    }

    render() {
        return html`
            <paper-dropdown-menu id="menu" label="${this.label}" name="${this.name}">
                <paper-listbox id="templates" slot="dropdown-content" class="dropdown-content" 
                    selected="${this.template}" attr-for-selected="value"
                    @selected-item-changed="${this._selected}">
                ${this._templates.map((item) => html`<paper-item value="${item.name}">${item.title}</paper-item>`)}
                </paper-listbox>
            </paper-dropdown-menu>

            <iron-ajax id="getTemplates"
                handle-as="json" @response="${this._handleTemplatesResponse}"
                method="GET"></iron-ajax>
        `;
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
        `;
    }

    _selected() {
        const newTemplate = this.shadowRoot.getElementById('templates').selected;
        if (newTemplate === this.template) {
            return;
        }
        this.setParameter('template', newTemplate);
        window.location = this.getUrl().toString();
    }

    _handleTemplatesResponse() {
        const loader = this.shadowRoot.getElementById('getTemplates');
        this._templates = loader.lastResponse;
    }
}
customElements.define('pb-select-template', PbSelectTemplate);