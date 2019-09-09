import BaseWidget from '/js/components/BaseWidget.js';
import { select, settings } from '/js/settings.js';
import utils from '/js/utils.js';


class HourPicker extends BaseWidget {
    constructor(wrapper) {
        super(wrapper, settings.hours.open);
        const thisWidget = this;

        thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
        thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
        thisWidget.initPlugin();
        thisWidget.dom.input = thisWidget.value;

    }

    initPlugin() {
        const thisWidget = this;

        rangeSlider.create(thisWidget.dom.input);

        thisWidget.dom.input.addEventListener('input', function() {
            thisWidget.dom.input = thisWidget.value;

        });

    }

    parseValue(value) {
        const numberHour = utils.numberToHour(value);
        console.log('numberHour', numberHour);

        return (numberHour);
    }

    isValid(value) { // eslint-disable-line no-unused-vars
        return (true);
    }

    renderValue() {
        const thisWidget = this;
        thisWidget.dom.output = thisWidget.value;

    }

}
export default HourPicker;
