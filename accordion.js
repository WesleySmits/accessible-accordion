class AccordionElement extends HTMLElement {
    #curtains = [];

    connectedCallback() {
        this.#curtains = Array.from(this.querySelectorAll('details'));

        this.#curtains.forEach((curtain) => {
            curtain.addEventListener('toggle', () => {
                if (!curtain.open) {
                    return;
                }

                this.#closeOtherCurtains(curtain);
            });
        });
    }

    #closeOtherCurtains(curtain) {
        const otherCurtains = this.#curtains.filter((c) => curtain !== c);
        otherCurtains.forEach((otherCurtain) => {
            const curtainElement = otherCurtain;
            curtainElement.open = false;
        });
    }
}

customElements.define('custom-accordion', AccordionElement);