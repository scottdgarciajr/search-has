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
        align-items: center;
        background-color: var(--ddd-theme-default-white, #fff);
        border-radius: 24px;
        border: 1px solid var(--ddd-theme-default-slateGray, #dfe1e5);
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
        color: var(--ddd-theme-default-coalyGray, #9aa0a6);
        font-size: 24px;
        cursor: pointer;
      }
  
      .search-input {
        flex: 1;
        font-size: 16px;
        line-height: 24px;
        border: none;
        outline: none;
        background: transparent;
        color: var(--ddd-theme-default-textColor, #000);
      }
  
      .results {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--ddd-spacing-4, 16px);
        max-width: 1200px;
        margin: 0 auto;
      }
  
      /* Center the summary card and add hover style using global color */
      .summary-card {
      display: flex;
      flex-direction: column;
      align-items: center; /* Center the content */
      width: 100%;
      max-width: 320px;
      border-radius: 8px;
      padding: 16px;
      background-color: #f3f4f6;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease, background-color 0.2s ease;
      margin: 20px auto; /* Center the card within the container */
      padding: var(--ddd-spacing-x-3);
      }
  
      .summary-card:hover {
        transform: translateY(-4px);
        background-color: var(--global-hex-color, #e0f7fa); /* Use the global color on hover */
      }
  
      .summary-card h3 {
        margin: 0;
        font-size: 24px;
        color: #333;
      }
  
      .summary-card p {
        margin: 8px 0;
        font-size: 16px;
        color: #555;
        line-height: 1.5;
      }
  
      .summary-card strong {
        color: #222;
      }
    `;
  }
  


  

  render() {
    // Deconstruct metadata, theme, and title, ensuring correct structure
    const { description = 'N/A', metadata = {}, title = 'N/A' } = this.cachedData || {};
    
    // Adjust paths to `created` and `updated` based on nested structure
    const created = metadata.site?.created ? 
        new Date(parseInt(metadata.site.created) * 1000).toLocaleDateString() : 'N/A';
    const updated = metadata.site?.updated ? 
        new Date(parseInt(metadata.site.updated) * 1000).toLocaleDateString() : 'N/A';
  
    // Access the `theme` data from metadata, then variables if present
    const themeName = metadata.theme?.name || 'N/A';
  
    return html`
      <h2>${title}</h2>
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
        
        <!-- Static Summary Card -->
        <div class="summary-card">
          <h3>Summary</h3>
          <p><strong>Title:</strong> ${title}</p> <!-- Display the title from JSON -->
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Date Created:</strong> ${created}</p>
          <p><strong>Last Updated:</strong> ${updated}</p>
          <p><strong>Theme:</strong> ${themeName}</p>
        </div>
        
        <!-- Search Results as Individual Cards -->
        <div class="results">
          ${this.items.map((item) => {
            const itemMetadata = item.metadata || {};
            const itemCreated = itemMetadata.site?.created ? 
                new Date(parseInt(itemMetadata.site.created) * 1000).toLocaleDateString() : 'N/A';
            const itemUpdated = itemMetadata.site?.updated ? 
                new Date(parseInt(itemMetadata.site.updated) * 1000).toLocaleDateString() : 'N/A';
            const logo = itemMetadata.files && itemMetadata.files[0] ? itemMetadata.files[0].url : '';
    
            return html`
              <hax-card
                created="${itemCreated}"
                lastUpdated="${itemUpdated}"
                title="${item.title}"
                description="${item.description || 'N/A'}"
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
    this.value = e.target.value;
  }

  updated(changedProperties) {
    if (changedProperties.has('value')) {
      this.updateResults(this.value);
    } else if (changedProperties.has('value') && !this.value) {
      this.items = [];
    }

    if (changedProperties.has('jsonUrl')) {
      this.updateResults(this.value);
    }
  }

  async updateResults(value) {
    this.loading = true;
    this.jsonBaseUrl = this.extractBaseUrl(this.jsonUrl);

    try {
      const response = await fetch(this.jsonUrl);
      if (response.ok) {
        const data = await response.json();
        this.cachedData = data; // Cache the full data for `render`
        
        if (Array.isArray(data.items)) {
          this.items = data.items.filter(item => 
            item.title.toLowerCase().includes(value.toLowerCase()) ||
            item.description.toLowerCase().includes(value.toLowerCase())
          );
        }

        this.updateGlobalHexColor(data);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.loading = false;
    }
  }

  updateGlobalHexColor(data) {
    if (data.metadata && data.metadata.theme && data.metadata.theme.variables) {
      const hexCode = data.metadata.theme.variables.hexCode;
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