/*global rangeSlider */
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
    thisWidget.value = thisWidget.dom.input.value;


  }

  initPlugin() {
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);

    thisWidget.dom.input.addEventListener('input', function() {
      thisWidget.value = thisWidget.dom.input.value;


    });

  }

  parseValue(value) {

    const numberHour = utils.numberToHour(value);


    return (numberHour);
  }

  isValid() { // eslint-disable-line no-unused-vars
    return (true);
  }

  renderValue() {
    const thisWidget = this;
    thisWidget.dom.output.value = thisWidget.value;
    thisWidget.dom.output.innerHTML = thisWidget.value;



  }

}
export default HourPicker;
