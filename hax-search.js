import { LitElement, html, css } from 'lit';
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "./hax-card.js";

export class HaxSearch extends LitElement {
  
  constructor() {
    super();
    this.value = '';
    this.title = '';
    this.loading = false;
    this.items = [];
    this.jsonUrl = 'https://haxtheweb.org/site.json'; // Default URL, can be overridden
    this.jsonBaseUrl = this.extractBaseUrl(this.jsonUrl);
  }
  
  extractBaseUrl(url) {
    return url.replace(/\/?[^\/]*\.json$/, '');
  }

  static get properties() {
    return {
      title: { type: String },
      loading: { type: Boolean, reflect: true },
      items: { type: Array },
      value: { type: String },
      jsonUrl: { type: String }, 
      baseUrl: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .search-container {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        border-radius: 24px;
        border: 1px solid #dfe1e5;
        padding: 5px 10px;
        box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        transition: box-shadow 0.3s ease;
      }

      .search-container:hover {
        box-shadow: 0 1px 8px rgba(32, 33, 36, 0.35);
      }

      .search-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        color: #9aa0a6;
        font-size: 24px;
        cursor: pointer;
      }

      .search-input {
        flex: 1;
        font-size: 16px;
        line-height: 24px;
        border: none;
        outline: none;
      }

      .search-input::placeholder {
        color: #9aa0a6;
      }

      .search-input:focus {
        outline: none;
      }

      .results {
        visibility: visible;
        height: 100%;
        opacity: 1;
        transition-delay: 0.5s;
        transition: 0.5s all ease-in-out;
      }

      details {
        margin: 16px;
        padding: 16px;
        background-size: cover;
        background-attachment: fixed;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      }

      summary {
        font-size: 24px;
        padding: 8px;
        color: white;
        font-size: 42px;
      }

      input {
        font-size: 20px;
        line-height: 40px;
        width: 100%;
      }
    `;
  }

  

  render() {
    return html`
      <h2>${this.title}</h2>
      <details open>
        <summary>Search the HaxWeb!</summary>
        <div class="search-container">
          <div class="search-icon">
            <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="20px" width="20px">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </svg>
          </div>
          <input 
            id="input" 
            class="search-input" 
            placeholder="Search HaxWeb content" 
            @input="${this.inputChanged}" 
          />
        </div>
        <div class="results">
        ${this.items.map((item) => {
          const created = item.metadata ? new Date(parseInt(item.metadata.created) * 1000).toLocaleDateString() : '';
          const updated = item.metadata ? new Date(parseInt(item.metadata.updated) * 1000).toLocaleDateString() : '';
          const logo = item.metadata && item.metadata.files && item.metadata.files[0] ? item.metadata.files[0].url : '';

          return html`
            <hax-card
              created="${created}"
              lastUpdated="${updated}"
              title="${item.title}"
              description="${item.description}"
              logo="${logo}"
              slug="${item.slug}"
              baseURL="${this.jsonBaseUrl}"
            ></hax-card>
          `;
        })}
      </div>
      </details>
      
    `;
  }

  inputChanged(e) {
    this.value = this.shadowRoot.querySelector('#input').value;
  }

  updated(changedProperties) {
    if (changedProperties.has('value')) {
      this.updateResults(this.value);
    } else if (changedProperties.has('value') && !this.value) {
      this.items = [];
    }

    if (changedProperties.has('items') && this.items.length > 0) {
      console.log(this.items);
    }
  }

  updateResults(value) {
    this.loading = true;
    this.jsonBaseUrl = this.extractBaseUrl(this.jsonUrl);
    fetch(this.jsonUrl) // Use the jsonUrl property
      .then(response => response.ok ? response.json() : {})
      .then(data => {
        if (data && Array.isArray(data.items)) {
          this.items = data.items.filter(item => 
            item.title.toLowerCase().includes(value.toLowerCase()) ||
            item.description.toLowerCase().includes(value.toLowerCase())
          );
        }

        this.updateGlobalHexColor(data);
        this.loading = false;
      });
  }

  updateGlobalHexColor(data) {
    if (data.metadata && data.metadata.theme && data.metadata.theme.variables) {
      const hexCode = data.metadata.theme.variables.hexCode;
      console.log('Hex Code:', hexCode);
      document.documentElement.style.setProperty('--global-hex-color', hexCode);
    } else {
      console.log('Hex Code not found');
    }
  }

  static get tag() {
    return 'hax-search';
  }
}

customElements.define(HaxSearch.tag, HaxSearch);
