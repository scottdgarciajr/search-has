import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";


export class HaxCard extends LitElement {

  constructor() {
    super();
    this.title = '';
    this.description = '';
    this.created = '';
    this.lastUpdated = '';
    this.logo = '';
    this.slug = 'google.com';
    this.baseURL = 'google.com';
  }

  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
      created: { type: String },
      lastUpdated: { type: String },
      logo: { type: String },
      slug: { type: String },
      baseURL: { type: String }
    };
  }

  static get styles() {
    return css`
      /* Root Card Styles */
      .card {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 320px;
        border-radius: 12px;
        overflow: hidden;
        padding: 16px;
        background-color: #f9f9f9;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        cursor: pointer;
        outline: none;
        /* Height for golden ratio (approx. 1.618) */
        height: 512px;
        padding: 8px; /* adds padding inside each card to create spacing on left and right */
        box-sizing: border-box; /* ensures padding doesn't affect card width */
      }
  
      /* Hover and Focus Effects */
      .card:hover, .card:focus {
        transform: translateY(-4px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        background-color: var(--global-hex-color, #e1f5fe);
      }
  
      /* Image Styling */
      .image-container {
        width: 100%;
        aspect-ratio: 1.618; /* Golden ratio for a balanced aspect */
        overflow: hidden;
        border-radius: 8px;
        background-color: #ddd;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
      }
  
      img {
        width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: 8px;
        transition: transform 0.3s ease;
      }
  
      .card:hover img {
        transform: scale(1.05);
      }
  
      /* Typography and Text Styling */
      .info {
        margin-top: 10px;
        font-size: 20px;
        font-weight: 600;
        color: #333;
        text-align: center;
        line-height: 1.5;
      }
  
      .secondary {
        font-size: 16px;
        color: #555;
        margin-top: 6px;
        line-height: 1.4;
        text-align: center;
      }
  
      .metadata {
        font-size: 12px;
        color: #777;
        margin-top: 8px;
        font-style: italic;
        line-height: 1.3;
        text-align: center;
      }
  
      /* Accessibility and Responsive */
      @media (max-width: 600px) {
        .card {
          width: 100%;
          max-width: 100%;
          padding: 12px;
          height: auto; /* Flexible height for smaller screens */
        }
      }
    `;
  }
  

  render() {
    const createdDate = new Date(parseInt(this.created) * 1000).toLocaleDateString();
    const updatedDate = new Date(parseInt(this.lastUpdated) * 1000).toLocaleDateString();
    let logoURL = '';
    if (this.logo == '') {
      logoURL = "lib/no-image.jpg";//This changes the default image for empty strings
  }
  else {
    logoURL=this.baseURL+'/'+this.logo
  }
  

    return html`
      <div
        class="card"
        tabindex="0"
        @click="${this.openSlug}"
        @keyup="${this.onKeyup}"
      >
        <div class="image-container">
          <img src="${logoURL}" alt="${this.title}" />
        </div>
        <div class="info">${this.title}</div>
        <div class="secondary">${this.description}</div>
        <div class="metadata">Created: ${createdDate}</div>
        <div class="metadata">Updated: ${updatedDate}</div>
      </div>
    `;
  }

  openSlug() {
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
      window.open((this.baseURL+'/'+this.slug), '_blank'); 
    }, 2000);
  }

  onKeyup(e) {
    if (e.key === 'Enter') {
      this.openSlug();
    }
  }

  static get tag() {
    return "hax-card";
  }
}

customElements.define(HaxCard.tag, HaxCard);
