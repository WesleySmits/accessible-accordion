import { getAbsoluteHeight } from './utils.js   ';

class Curtain extends HTMLDetailsElement {
    #summary = this.querySelector('summary');

    #content = this.querySelector('.curtain__content');

    #animation = null;
    
    connectedCallback() {
        this.#summary.addEventListener('click', this.#handleClick);
    }

    disconnectedCallback() {
        this.#summary.removeEventListener('click', this.#handleClick);
    }
    
    #handleClick = (event) => {
        event.preventDefault();
        if (event.target instanceof HTMLAnchorElement) {
            event.preventDefault();
            return;
        }

        if (this.open === false) {
            this.#open();
            return;
        }

        this.#close();
    };

    #open() {
        this.style.height = `${this.offsetHeight}px`;
        this.open = true;
        window.requestAnimationFrame(() => this.#expand());
    }

    #expand() {
        const startHeight = `${this.offsetHeight}px`;
        const endHeight = `${this.#summary.offsetHeight + getAbsoluteHeight(this.#content)}px`;

        if (this.#animation) {
            this.#animation.cancel();
        }

        this.#animation = this.animate(
            {
                height: [startHeight, endHeight]
            },
            {
                duration: 400,
                easing: 'ease-out'
            }
        );

        this.#animation.onfinish = () => this.#onAnimationFinish(true);
    }

    #close() {
        const startHeight = `${this.offsetHeight}px`;
        const endHeight = `${this.#summary.offsetHeight}px`;

        if (this.#animation) {
            this.#animation.cancel();
        }

        this.#animation = this.animate(
            {
                height: [startHeight, endHeight]
            },
            {
                duration: 400,
                easing: 'ease-out'
            }
        );

        this.#animation.onfinish = () => this.#onAnimationFinish(false);
    }

    #onAnimationFinish(open) {
        this.open = open;
        this.#animation = null;
        this.style.height = '';
    }
}

customElements.define('curtain-component', Curtain, { extends: 'details' });
