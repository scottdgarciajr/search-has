import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

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
        color: var(--ddd-theme-default-slateMaxLight);        ;
        background: url("https://c.tenor.com/bQvEhQcSGmEAAAAC/tenor.gif") no-repeat center center;
        background-size: cover;
        background-attachment: fixed;
      }
      
      .card:hover .secondary {
        color: --ddd-theme-default-slateMaxLight; /* Change secondary text color on hover */
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
    // Create a new image element for the GIF
  const gif = document.createElement('img');
  gif.src = "https://media1.tenor.com/m/LH6VcfpgfaAAAAAd/warp-space.gif";
  gif.alt = "a black background with white lines that looks like a star burst";

  
  gif.style.position = 'fixed'; 
  gif.style.top = '0'; 
  gif.style.left = '0'; 
  gif.style.width = '100vw'; 
  gif.style.height = '100vh'; 
  gif.style.objectFit = 'cover'; 
  gif.style.zIndex = '9999'; 
  document.body.appendChild(gif); 

  // Delay for 0.5 seconds
  setTimeout(() => {
    // Remove the GIF after displaying
    document.body.removeChild(gif);
    // Open the image
    window.open(this.source, '_blank'); 
  }, 500);
    
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