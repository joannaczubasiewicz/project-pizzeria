import { select, templates } from '/js/settings.js'; // eslint-disable-line no-unused-vars
import AmountWidget from '/js/components/AmountWidget.js';
import DatePicker from '/js/components/DatePicker.js';
import HourPicker from '/js/components/HourPicker.js';

class Booking {
  constructor(bookingContainer) {
    const thisBooking = this;
    thisBooking.render(bookingContainer);
    thisBooking.initWidgets();

  }


  render(bookingContainer) {
    const thisBooking = this;

    /*generate HTML with templates.bookingWidget */
    const generatedHTML = templates.bookingWidget();

    /*create empty object thisBooking.dom */
    thisBooking.dom = {};

    /*add wrapper property do  thisBooking.dom */
    thisBooking.dom.wrapper = bookingContainer;

    /*change wrapper content to HTML generated from template*/
    bookingContainer.innerHTML = generatedHTML;

    /* create thisBooking.dom.peopleAmount property and write the correct selector in it  */
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);

    /* create thisBooking.dom.hoursAmount property and write the correct selector in it  */
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    //console.log('thisBooking.dom', thisBooking.dom)

    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
  }


  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.houtPicker = new HourPicker(thisBooking.dom.hourPicker);


  }




}

export default Booking;
