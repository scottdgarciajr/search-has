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
        border-radius: var(--ddd-radius-xl); 
        overflow: hidden;
        padding: var(--ddd-spacing-x-3); 
        background-color: #f9f9f9;
        box-shadow: var(--ddd-boxShadow-md); 
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        cursor: pointer;
        outline: none;
        /* Height for golden ratio (approx. 1.618) */
        height: 512px;
        box-sizing: border-box;
      }
  
      /* Hover and Focus Effects */
      .card:hover, .card:focus {
        transform: translateY(-4px);
        box-shadow: var(--ddd-boxShadow-lg); 
        background-color: var(--global-hex-color, #e1f5fe);
      }
  
      /* Image Styling */
      .image-container {
        width: 100%;
        aspect-ratio: 1.618; /* Golden ratio for a balanced aspect */
        overflow: hidden;
        border-radius: var(--ddd-radius-rounded); 
        background-color: #ddd;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--ddd-spacing-x-4); /* Equivalent to 16px */
      }
  
      img {
        width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: var(--ddd-radius-rounded); /* Replaced with DDD border-radius class */
        transition: transform 0.3s ease;
      }
  
      .card:hover img {
        transform: scale(1.05);
      }
  
      /* Typography and Text Styling */
      .info {
        margin-top: var(--ddd-spacing-x-2); /* Equivalent to 10px */
        font-size: 20px;
        font-weight: var(--ddd-font-weight-medium); /* Replaced with DDD font-weight class */
        color: #333;
        text-align: center;
        line-height: var(--ddd-lh-140); /* Replaced with DDD line-height class */
      }
  
      .secondary {
  font-size: 16px;
  color: #555;
  margin-top: var(--ddd-spacing-x-1); /* Equivalent to 6px */
  line-height: var(--ddd-lh-140); /* Replaced with DDD line-height class */
  text-align: center;
  overflow: hidden; /* Hides the overflowing text */
  text-overflow: ellipsis; /* Adds ellipsis (...) for overflowing text */
  display: -webkit-box; /* Allows multi-line truncation */
  -webkit-line-clamp: 5; /* Limits to 5 lines, adjust the number for more lines */
  -webkit-box-orient: vertical; /* Ensures vertical box behavior */
}

  
      .metadata {
        font-size: 12px;
        color: #777;
        margin-top: var(--ddd-spacing-x-2); /* Equivalent to 8px */
        font-style: italic;
        line-height: var(--ddd-lh-120); /* Replaced with DDD line-height class */
        text-align: center;
      }
  
      /* Accessibility and Responsive */
      @media (max-width: 600px) {
        .card {
          width: 100%;
          max-width: 100%;
          padding: var(--ddd-spacing-x-3); /* Equivalent to 12px */
          height: auto; /* Flexible height for smaller screens */
        }
      }
    `;
  }
  

  render() {
    let logoURL = '';
    if (this.logo == '') {
      logoURL = "lib/no-image.jpg"; // Default image for empty strings
    } else {
      logoURL = this.baseURL + '/' + this.logo;
    }
  
    // Display dates as plain strings if they exist, otherwise show a fallback message
    const formattedCreated = this.created || 'No Date Available';
    const formattedUpdated = this.lastUpdated || 'No Date Available';
  
    console.log("Created: ", formattedCreated);  // For debugging
    console.log("Updated: ", formattedUpdated);  // For debugging
  
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
        <div class="metadata">Created: ${formattedCreated}</div>
        <div class="metadata">Updated: ${formattedUpdated}</div>
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
