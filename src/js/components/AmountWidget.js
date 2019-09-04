import { select, settings } from '/js/settings.js';
import BaseWidget from '/js/components/BaseWidget.js';

class AmountWidget extends BaseWidget {
    constructor(element) {
        super(element, settings.amountWidget.defaultValue);

        const thisWidget = this;

        thisWidget.getElements(element);
        console.log('thisWidget', thisWidget);
        //thisWidget.value = settings.amountWidget.defaultValue; do usunięcia
        //thisWidget.setValue(thisWidget.dom.input.value); do usunięcia

        //add method to constructor
        thisWidget.initActions();
        console.log('AmountWidget:', thisWidget);





    }

    getElements(element) { // eslint-disable-line no-unused-vars
        const thisWidget = this;

        //thisWidget.dom.wrapper = element; do usunięcia

        thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
        thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
        thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);

    }




    isValid(value) {
        return !isNaN(value) &&
            value >= settings.amountWidget.defaultMin &&
            value <= settings.amountWidget.defaultMax;

    }

    renderValue() {
        const thisWidget = this;

        console.log('thisWidget.dom', thisWidget.dom);
        thisWidget.dom.input.value = thisWidget.value;

    }

    initActions() {
        const thisWidget = this;

        thisWidget.dom.input.addEventListener('change', function() {
            thisWidget.value(thisWidget.dom.input.value);
        });

        thisWidget.dom.linkDecrease.addEventListener('click', function() {
            event.preventDefault();
            thisWidget.setValue(thisWidget.value - 1);
        });

        thisWidget.dom.linkIncrease.addEventListener('click', function() {
            event.preventDefault();
            thisWidget.setValue(thisWidget.value + 1);
        });


    }



}
export default AmountWidget;
