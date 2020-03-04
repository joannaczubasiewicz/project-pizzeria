/*global rangeSlider */

import BaseWidget from '/js/components/BaseWidget.js';
import { select, settings } from '/js/settings.js';
import utils from '/js/utils.js';
/* eslint-disable no-unused-vars */
import Booking from '/js/components/Booking.js';

class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input.value;
    thisWidget.hours = {};
  }

  setHours(data) {
    const thisWidget = this;
    thisWidget.hours = data;

    thisWidget.setColor();
  }

  tablesAmount(hour) {
    const thisWidget = this;
    const presentHour = thisWidget.hours[hour];
    if (presentHour) return presentHour.length;
    else return 0;
  }

  setColor() {
    const thisWidget = this;
    thisWidget.dom.wrapper.querySelector('.rangeSlider').style.background = thisWidget.generateBackgroundString();
  }

  getHourColor(amount) {
    const colors = ['green', 'yellow', 'red', 'black'];
    return colors[amount];
  }

  generateBackgroundString() {

    const thisWidget = this;

    const colors = [];
    for (let i = settings.hours.open; i < settings.hours.close; i += 0.5) {
      colors.push(thisWidget.getHourColor(thisWidget.tablesAmount(i)));
    }

    let avg = Math.round(100 / colors.length);
    const auxiliary = avg;
    let begin = 0;

    const linearStyle = [];
    for (let color of colors) {
      linearStyle.push(`${color} ${begin}% ${avg}%`);
      begin += auxiliary;
      avg += auxiliary;
    }

    const colorStyle = linearStyle.join(', ');
    return `linear-gradient(to right, ${linearStyle.join(', ')})`;

  }

  initPlugin() {
    const thisWidget = this;


    console.log('dom', thisWidget.dom.input);

    const slider = document.getElementById('slider1');
    rangeSlider.create(thisWidget.dom.input, { polyfill: true });
    //https://github.com/Stryzhevskyi/rangeSlider/blob/master/README.md






    /*thisWidget.dom.input.addEventListener('input', function() {
                        thisWidget.value = thisWidget.dom.input.value;


                        //wywolac tables check
                        thisWidget.tableCheck();

                    });*/

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
