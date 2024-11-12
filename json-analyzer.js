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
        align-items: center; /* Centered the contents vertically */
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

      button {
        background-color: #007bff; /* Button background color */
        color: white; /* Button text color */
        border: none; /* No border */
        border-radius: 5px; /* Rounded corners */
        padding: 10px 15px; /* Padding for the button */
        font-size: 16px; /* Font size for the button */
        cursor: pointer; /* Pointer cursor on hover */
        margin-right: 10px; /* Space between button and input */
        transition: background-color 0.3s ease; /* Transition for background color */
      }

      button:hover {
        background-color: #0056b3; /* Darker blue on hover */
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

  static get properties() {
    return {
      url: { type: String }
    };
  }

  constructor() {
    super();
    this.url = 'https://haxtheweb.org/site.json';
  }

  render() {
    if (this.url == ''){this.url = 'https://haxtheweb.org/site.json';}
    else if (!this.url || !this.url.endsWith('/site.json')) {this.url+='/site.json'}
    
    return html`
      <div class="search-container">
        
        <div class="search-icon"><button @click="${this._analyze}">Analyze 🔍</button></div>
        <input
          class="search-input"
          type="text"
          placeholder="${this.url} (Place URL Here To Override)"
          @input="${this._updateUrl}"
          list="url-options"
        />
        <datalist id="url-options">
          <option value="https://btopro.com" />
          <option value="https://haxtheweb.org" />
        </datalist>
      </div>
      
      <hax-search .jsonUrl="${this.url}"></hax-search>
    `;
  }

  _updateUrl(event) {
    this.url = event.target.value;
  }

  async _analyze() {
    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      try {
        const data = await response.json();
        console.log(data);
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
      }
    } catch (error) {
      console.error('Error fetching JSON:', error);
      alert('Error fetching JSON\n' + error);
    }
  }
}

customElements.define('json-analyzer', JsonAnalyzer);
