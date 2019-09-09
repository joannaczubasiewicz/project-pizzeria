/*global flatpickr */
import BaseWidget from '/js/components/BaseWidget.js';
import utils from '/js/utils.js';
import { select, settings } from '/js/settings.js';

class DatePicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date()));
    // const now = utils.dateToStr(newDate());
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();

  }


  initPlugin() {
    const thisWidget = this;
    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);
    const element = thisWidget.dom.input;
    const options = {
      'disable': [
        function(date) {

          return (date.getDay() === 1);

        }
      ],
      'locale': {
        'firstDayOfWeek': 1
      },
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      onChange: function(dateStr) {
        console.log('dateStr:', dateStr);
        thisWidget.value = dateStr;
      }
    };



    flatpickr(element, options);


  }

  parseValue(value) {
    return (value); // eslint-disable-line no-unused-vars
  }

  isValid(value) { // eslint-disable-line no-unused-vars
    return (true);
  }

  renderValue() {

  }

}
export default DatePicker;
