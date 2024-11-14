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
    this.cachedData = null; // Cache for fetched JSON data
    this.jsonUrl = 'https://haxtheweb.org/site.json';
    this.jsonBaseUrl = this.extractBaseUrl(this.jsonUrl);
    this.updateResults(this.value);
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
      cachedData: { type: Array }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
  
      .search-container {
        display: flex;
        align-items: center; /* Centered the contents vertically */
        background-color: #fff; /* Default background color */
        border-radius: 24px; /* Custom radius for the search container */
        border: 1px solid #dfe1e5; /* Custom border */
        padding: 5px 10px; /* Custom padding */
        box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28); /* Custom box shadow */
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        transition: box-shadow 0.3s ease;
      }
  
      .search-container:hover {
        box-shadow: 0 1px 8px rgba(32, 33, 36, 0.35); /* Custom hover shadow */
      }
  
      .search-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px; /* Custom margin */
        color: #9aa0a6; /* Custom icon color */
        font-size: 24px; /* Custom font size */
        cursor: pointer;
      }
  
      .search-input {
        flex: 1;
        font-size: 16px; /* Default font size */
        line-height: 24px; /* Default line height */
        border: none;
        outline: none;
      }
  
      .search-input::placeholder {
        color: #9aa0a6; /* Custom placeholder color */
      }
  
      .search-input:focus {
        outline: none;
      }
  
      button {
        background-color: var(--color-primary); /* DDD default primary button color */
        color: var(--color-white); /* DDD default white text color */
        border: none;
        border-radius: var(--radius-sm); /* DDD default small border-radius */
        padding: var(--space-sm) var(--space-md); /* DDD default button padding */
        font-size: var(--font-size-md); /* DDD default button font size */
        cursor: pointer;
        margin-right: var(--space-sm); /* DDD default margin */
        transition: background-color 0.3s ease; /* DDD default transition */
      }
  
      button[disabled] {
        background-color: var(--color-disabled); /* DDD disabled button color */
        cursor: not-allowed;
      }
  
      button:not([disabled]):hover {
        background-color: var(--color-primary-dark); /* DDD primary dark hover color */
      }
  
      .results {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--ddd-spacing-4); /* DDD default space for grid items */
        max-width: 1200px;
        margin: 0 auto;
      }
  
      details {
        margin: var(--space-md); /* DDD default margin */
        padding: var(--space-md); /* DDD default padding */
        background-size: cover;
        background-attachment: fixed;
        border-radius: var(--radius-md); /* DDD default border-radius */
        box-shadow: var(--shadow-sm); /* DDD default box-shadow */
      }
  
      summary {
        font-size: var(--font-size-lg); /* DDD default summary font size */
        padding: var(--space-md); /* DDD default padding */
        color: var(--color-white); /* DDD default text color */
        font-size: var(--font-size-xl); /* DDD large font size */
      }
  
      input {
        font-size: var(--font-size-lg); /* DDD default input font size */
        line-height: var(--line-height-lg); /* DDD default line height */
        width: 100%;
      }
  
      .error-message {
        color: var(--color-error); /* DDD error color */
        text-align: center;
        margin-top: var(--space-sm); /* DDD default margin */
      }
  
      .loading {
        text-align: center;
        margin-top: var(--space-sm); /* DDD default margin */
        font-style: italic;
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

    if (changedProperties.has('jsonUrl')) {
      console.log('jsonUrl has changed to:', this.jsonUrl);
      this.updateResults(this.value);  // Reload data when the URL changes
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
