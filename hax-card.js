import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

export class HaxItem extends LitElement {

  constructor() {
    super();
    this.title = '';
    this.description = '';
    this.created = '';
    this.lastUpdated = '';
    this.logo = '';
  }

  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
      created: { type: String },
      lastUpdated: { type: String },
      logo: { type: String }
    };
  }

  static get styles() {
    return css`
      .card {
        display: inline-block;
        width: 240px;
        height: auto;
        border-radius: 8px;
        overflow: hidden;
        transition: background-color 0.3s ease;
        cursor: pointer;
        text-align: center;
        padding: 10px;
        background-color: #f9f9f9;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .card:hover {
        background-color: #e0e0e0;
      }

      .image-container {
        position: relative;
        width: 100%;
        height: 140px;
        overflow: hidden;
      }

      img {
        width: 240px;
        height: 140px;
        object-fit: cover;
        border-radius: 4px;
      }

      .info {
        margin-top: 5px;
        font-size: 14px;
        font-weight: bold;
      }

      .secondary {
        font-size: 12px;
        color: #555;
      }

      .metadata {
        font-size: 10px;
        color: #777;
        margin-top: 5px;
      }
    `;
  }

  render() {
    const createdDate = new Date(parseInt(this.created) * 1000).toLocaleDateString();
    const updatedDate = new Date(parseInt(this.lastUpdated) * 1000).toLocaleDateString();

    return html`
      <div
        class="card"
        tabindex="0"
        @click="${this.openImage}"
        @keyup="${this.onKeyup}"
      >
        <div class="image-container">
          <img src="${this.logo}" alt="${this.title}" />
        </div>
        <div class="info">${this.title}</div>
        <div class="secondary">${this.description}</div>
        <div class="metadata">Created: ${createdDate}</div>
        <div class="metadata">Updated: ${updatedDate}</div>
      </div>
    `;
  }

  openImage() {
    const gif = document.createElement('img');
    gif.src = "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExazA4eXV5cDlhaTJoY2x4dW1tb3VwMTUxNWp4NHZ5bmVmemtwZmlzMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aUPfvs5MOXpxm/200.gif";
    gif.alt = "a black background with white lines that looks like a star burst";

    gif.style.position = 'fixed'; 
    gif.style.top = '0'; 
    gif.style.left = '0'; 
    gif.style.width = '100vw'; 
    gif.style.height = '100vh'; 
    gif.style.objectFit = 'cover'; 
    gif.style.zIndex = '9999'; 
    document.body.appendChild(gif); 

    setTimeout(() => {
      document.body.removeChild(gif);
      window.open(this.logo, '_blank'); 
    }, 2000);
  }

  onKeyup(e) {
    if (e.key === 'Enter') {
      this.openImage();
    }
  }

  static get tag() {
    return "hax-item";
  }
}

customElements.define(HaxItem.tag, HaxItem);
