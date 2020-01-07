import { select, templates, settings, classNames } from '/js/settings.js'; // eslint-disable-line no-unused-vars
import AmountWidget from '/js/components/AmountWidget.js';
import DatePicker from '/js/components/DatePicker.js';
import HourPicker from '/js/components/HourPicker.js';
import utils from '/js/utils.js';

class Booking {
  constructor(bookingContainer) {
    const thisBooking = this;
    thisBooking.render(bookingContainer);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.selectTable();
    thisBooking.submitBooking();


  }
  //pobranie danych o rezerwacji
  getData() {
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,


      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,

      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };


    const urls = {
      booking: settings.db.url + '/' + settings.db.booking +
                '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event +
                '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.event +
                '?' + params.eventsRepeat.join('&'),
    };


    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat)
    ]).then(function(allResponses) {
      const bookingsResponse = allResponses[0];
      const eventsCurrentResponse = allResponses[1];
      const eventsRepeatResponse = allResponses[2];
      return Promise.all([
        bookingsResponse.json(),
        eventsCurrentResponse.json(),
        eventsRepeatResponse.json(),
      ]);
    })
      .then(function([bookings, eventsCurrent, eventsRepeat]) {
        //console.log('bookings', bookings);
        //console.log('eventsCurrent', eventsCurrent);
        //console.log('eventsRepeat', eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);

      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {

          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }

      }
    }
    //console.log('thisBooking.booked', thisBooking.booked);

    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);


    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {

      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);

    }
  }

  updateDOM() {
    const thisBooking = this;


    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    //console.log('godzina Booking', thisBooking.hour);


    let allAvailable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined' ||
            typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ) {
      allAvailable = true;
    }
    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      table.classList.remove('picked');
      thisBooking.pickedTable = null;

      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);

      }
      if (!allAvailable && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)

      ) {
        table.classList.add(classNames.booking.tableBooked);

      } else {
        table.classList.remove(classNames.booking.tableBooked);

      }

    }

  }


  selectTable() {
    const thisBooking = this;
    const allTables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.pickedTable = 0;

    for (let presentTable of allTables) {

      presentTable.addEventListener('click', function() {

        const activeTable = thisBooking.dom.wrapper.querySelector(select.booking.tables + '.picked');
        if (activeTable) {
          activeTable.classList.remove('picked');
        }
        if (!presentTable.classList.contains('booked')) {
          presentTable.classList.add('picked');

          thisBooking.pickedTable = presentTable.getAttribute('data-table');
          console.log(thisBooking.pickedTable);
        }


      });

    }
    thisBooking.dom.wrapper.addEventListener('updated', function() {
      thisBooking.updateDOM();
    });

  }

  submitBooking() {
    const thisBooking = this;

    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form);
    //console.log('form', thisBooking.dom.form);
    thisBooking.dom.form.addEventListener('submit', function() {
      event.preventDefault();
      thisBooking.bookTable();

    });


  }


  bookTable() {
    const thisBooking = this;

    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
    thisBooking.hour = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    thisBooking.date = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.booking.starters);

    thisBooking.starters = [];
    for (let starter of thisBooking.dom.starters) {
      const value = starter.getAttribute('value');
      thisBooking.starters.push(value);

    }



    console.log('adres', thisBooking.dom.address.value);
    console.log('phone', thisBooking.dom.phone.value);
    console.log('people', thisBooking.peopleAmount.value);
    console.log('hours', thisBooking.hoursAmount.value);
    console.log('date', thisBooking.date.value);
    console.log('hour', thisBooking.hour.value);
    console.log('table', thisBooking.pickedTable);
    console.log('starters', thisBooking.starters);



    const url = settings.db.url + '/' + settings.db.booking; // eslint-disable-line no-unused-vars

    const payload = { // eslint-disable-line no-unused-vars

      date: thisBooking.date.value,
      hour: thisBooking.date.value,
      table: thisBooking.pickedTable,
      address: thisBooking.dom.address.value,
      phone: thisBooking.dom.phone.value,
      people: thisBooking.peopleAmount.value,
      duration: thisBooking.hoursAmount.value,
      starters: thisBooking.starters,




    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function(response) {
        return response.json();
      }).then(function(parsedResponse) {
        console.log('parsedResponse booking:', parsedResponse);
      });

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
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
  }


  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function() {
      thisBooking.updateDOM();
    });


  }




}

export default Booking;
