import { LitElement, html, css } from "lit";

export class NasaImage extends LitElement {

  constructor() {
    super();
    this.title = '';
    this.source = '';
    this.alt = '';
    this.secondary_creator = '';
  }

  static get properties() {
    return {
      source: { type: String },
      title: { type: String },
      alt: { type: String },
      secondary_creator: { type: String }
    };
  }

  static get styles() {
    return css`
      .card {
        display: inline-block;
        width: 240px;
        height: 180px;
        border-radius: 8px;
        overflow: hidden;
        transition: background-color 0.3s ease;
        cursor: pointer;
        text-align: center;
        padding: 10px;
      }

      .card:hover {
        background-color: #f0f0f0;
      }

      .card:focus {
        outline: none;
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
    `;
  }

  render() {
    return html`
      <div
        class="card"
        tabindex="0"
        @click="${this.openImage}"
        @keyup="${this.onKeyup}"
      >
        <div class="image-container">
          <img src="${this.source}" alt="${this.alt}" />
        </div>
        <div class="info">${this.title}</div>
        <div class="secondary">${this.secondary_creator}</div>
      </div>
    `;
  }

  openImage() {
    window.open(this.source, '_blank');
  }

  onKeyup(e) {
    if (e.key === 'Enter') {
      this.openImage();
    }
  }


  static get tag() {
    return "nasa-image";
  }
}
customElements.define(NasaImage.tag, NasaImage);