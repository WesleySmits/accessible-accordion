class Curtain extends HTMLDetailsElement {
    #summary = this.querySelector('summary');

    #content = this.querySelector('.curtain__content');

    #animation = null;

    get open() {
        return this.hasAttribute('open');
    }

    set open(value) {
        this.toggleAttribute('open', value);
    }
    
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
        const endHeight = `${this.#summary.offsetHeight + this.#getAbsoluteHeight(this.#content)}px`;

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
        this.classList.add('closing');

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
        this.#animation.oncancel = () => {
            this.classList.remove('closing');
        };
    }

    #onAnimationFinish(open) {
        this.open = open;
        this.#animation = null;
        this.classList.remove('closing');

        this.style.height = '';

        this.dispatchEvent(new Event('toggle'));
    }

    #getAbsoluteHeight(el) {
        const styles = window.getComputedStyle(el);
        const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
    
        return Math.ceil(el.offsetHeight + margin);
    }
}

customElements.define('curtain-component', Curtain, { extends: 'details' });