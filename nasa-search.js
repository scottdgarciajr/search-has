import { LitElement, html, css } from 'lit';
import "./nasa-image.js";
export class NasaSearch extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      loading: { type: Boolean, reflect: true },
      items: { type: Array, },
      value: { type: String },
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
        color: #202124;
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
        background: url("https://c.tenor.com/bQvEhQcSGmEAAAAC/tenor.gif") no-repeat center center;
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


  constructor() {
    super();
    this.value = null;
    this.title = '';
    this.loading = false;
    this.items = [];
  }

  render() {
    return html`
      <h2>${this.title}</h2>
      <details open>
        <summary>Search the Stars</summary>
        <div class="search-container">
          <div class="search-icon">
            <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="20px" width="20px">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </svg>
          </div>
          <input 
            id="input" 
            class="search-input" 
            placeholder="Search NASA images" 
            @input="${this.inputChanged}" 
          />
        </div>
      </details>
      <div class="results">
        ${this.items.map((item, index) => html`
          <nasa-image
            source="${item.links[0].href}"
            title="${item.data[0].title}"
            alt="${item.data[0].description}"
            secondary_creator="${item.data[0].secondary_creator}"
          ></nasa-image>
        `)}
      </div>
    `;
  }

  inputChanged(e) {
    this.value = this.shadowRoot.querySelector('#input').value;
  }
  // life cycle will run when anything defined in `properties` is modified
  updated(changedProperties) {
    // see if value changes from user input and is not empty
    if (changedProperties.has('value') && this.value) {
      this.updateResults(this.value);
    }
    else if (changedProperties.has('value') && !this.value) {
      this.items = [];
    }
    // @debugging purposes only
    if (changedProperties.has('items') && this.items.length > 0) {
      console.log(this.items);
    }
  }

  updateResults(value) {
    this.loading = true;
    fetch(`https://images-api.nasa.gov/search?media_type=image&q=${value}`).then(d => d.ok ? d.json(): {}).then(data => {
      if (data.collection) {
        this.items = [];
        this.items = data.collection.items;
        this.loading = false;
      }  
    });
  }

  static get tag() {
    return 'nasa-search';
  }
}
customElements.define(NasaSearch.tag, NasaSearch);