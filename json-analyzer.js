import { LitElement, html, css } from 'lit-element';
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "./hax-search.js";

class JsonAnalyzer extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }
  
      .search-container {
        display: flex;
        align-items: center;
        background-color: var(--ddd-theme-default-white);
        border-radius: 24px;
        border: 1px solid var(--ddd-theme-default-limestoneGray);
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
        color: var(--ddd-theme-default-slateGray);
        font-size: 24px;
        cursor: pointer;
      }
  
      .search-input {
        flex: 1;
        font-size: 16px;
        line-height: 24px;
        border: none;
        outline: none;
        color: var(--ddd-theme-default-info);
        background: transparent; /* Ensure no background color on input */
      }
  
      .search-input::placeholder {
        color: var(--ddd-theme-default-slateGray);
      }
  
      .search-input:focus {
        outline: none;
      }
  
      button {
        background-color: var(--ddd-theme-default-beaverBlue);
        color: var(--ddd-theme-default-white, white);
        border: none;
        border-radius: 5px;
        padding: 10px 15px;
        font-size: 16px;
        cursor: pointer;
        margin-right: 10px;
        transition: background-color 0.3s ease;
      }
  
      button[disabled] {
        background-color: var(--ddd-theme-default-slateLight, #ccc);
        cursor: not-allowed;
      }
  
      button:not([disabled]):hover {
        background-color: var(--ddd-theme-default-navy70, #0056b3);
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
        color: var(--ddd-theme-default-white, white);
        font-size: 42px;
      }
  
      input {
        font-size: 20px;
        line-height: 40px;
        width: 100%;
        background: transparent; /* Ensure no background color */
      }
  
      .error-message {
        color: var(--ddd-theme-default-roarGolden, red);
        text-align: center;
        margin-top: 10px;
      }
  
      .loading {
        text-align: center;
        margin-top: 10px;
        font-style: italic;
      }
    `;
  }

  
  
  
  static get properties() {
    return {
      url: { type: String },
      currentUrl: { type: String },
      isValidJson: { type: Boolean },
      isValidUrl: { type: Boolean },
      errorMessage: { type: String },
      isLoading: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.url = ''; // No default URL
    this.currentUrl = ''; // Empty to require user input
    this.isValidJson = false; // Only true if valid JSON is fetched
    this.isValidUrl = false; // True if the input is a valid URL format
    this.errorMessage = ''; // To display validation errors
    this.isLoading = false; // To indicate loading state
  }

  render() {
    return html`
      <div class="search-container">
        <div class="search-icon">
          <button 
            @click="${this._analyze}" 
            ?disabled="${!this.isValidUrl || this.isLoading}"
            title="${!this.isValidUrl ? 'Enter a valid URL to enable' : 'Analyze JSON'}"
          >
            ${this.isLoading ? 'Loading...' : 'Analyze 🔍'}
          </button>
        </div>
        <input
          class="search-input"
          type="text"
          placeholder="Enter a base URL here"
          @input="${this._onInputChange}"
          list="url-options"
          .value="${this.currentUrl}" <!-- Bind currentUrl to the input -->
        />
        <datalist id="url-options">
          <option value="https://btopro.com" />
          <option value="https://haxtheweb.org" />
          <option value="https://btopro.com/" />
          <option value="https://haxtheweb.org/" />
        </datalist>
      </div>

      ${this.errorMessage
        ? html`<div class="error-message">${this.errorMessage}</div>`
        : ''
      }

      ${this.isLoading
        ? html`<div class="loading">Validating URL...</div>`
        : ''
      }

      <!-- Pass only url to hax-search if valid JSON is found -->
      ${this.isValidJson && !this.isLoading 
        ? html`<hax-search .jsonUrl="${this.url}"></hax-search>` 
        : ''
      }
    `;
  }

  /**
   * Handles input changes, validates the URL, and updates the state accordingly.
   * @param {Event} event - The input event.
   */
  _onInputChange(event) {
    const inputValue = event.target.value.trim();
    this.currentUrl = inputValue;
    this.errorMessage = '';
  
    // Validate URL without resetting JSON validity
    if (this._validateUrl(inputValue)) {
      this.isValidUrl = true;
    } else {
      this.isValidUrl = false;
      if (inputValue !== '') {
        this.errorMessage = 'Please enter a valid URL.';
      }
    }
  }
  
  async _analyze() {
    if (!this.isValidUrl) {
      this.errorMessage = 'Cannot analyze. The URL is invalid.';
      return;
    }
  
    // Construct the JSON URL
    this.url = this.currentUrl.endsWith('/site.json')
      ? this.currentUrl
      : `${this.currentUrl.replace(/\/+$/, '')}/site.json`; // Remove trailing slashes before appending
  
    this.errorMessage = '';
    this.isLoading = true;
  
    try {
      const response = await fetch(this.url);
      if (!response.ok) throw new Error(`Network response was not ok (Status: ${response.status})`);
      
      const data = await response.json();
      console.log('Fetched JSON:', data);
      this.isValidJson = true; // Set to true only if JSON is valid
    } catch (error) {
      console.error('Error fetching JSON:', error);
      this.errorMessage = `Error fetching JSON: ${error.message}`;
      // Only set isValidJson to false on an actual fetch error
      this.isValidJson = false;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Validates whether the input string is a properly formatted URL.
   * @param {string} urlString - The URL string to validate.
   * @returns {boolean} - True if valid, false otherwise.
   */
  _validateUrl(urlString) {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  }

}

customElements.define('json-analyzer', JsonAnalyzer);
