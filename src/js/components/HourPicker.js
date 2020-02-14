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





  }

  tableCheck() {
    const thisWidget = this;
    // odczytac z JSON zareserwowane stoliki dla daty i godziny

    //licznik ustawiamy na 0
    let licznik = 0;

    const url = settings.db.url + '/' + settings.db.event;
    const url2 = settings.db.url + '/' + settings.db.booking;


    const bookings = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(),
    };



    fetch(url, bookings)
      .then(function(response) {
        return response.json();
      }).then(function(parsedResponse) {


        const events = parsedResponse;

        //szukanie po elemntach
        for (let ocupied of events) {
          //console.log('ocupied', ocupied);
          let ocupiedHour = utils.hourToNumber(ocupied.hour);


          let ocupiedDuration = ocupied.duration;


          let ocupiedDupa = ocupiedHour + ocupiedDuration;
          //console.log('suma ocupiedHour', ocupiedHour);
          //console.log('suma ocupied + duration', ocupiedDupa);
          //console.log('IF (' + ocupiedDupa + ' > ' + utils.hourToNumber(thisWidget.dom.output.value) + '>' + ocupiedHour + ' )');

          if ((ocupiedDupa > utils.hourToNumber(thisWidget.dom.output.value)) && (utils.hourToNumber(thisWidget.dom.output.value) > ocupiedHour)) {
            licznik++;
          }
          console.log('licznik', licznik);
        }


      });

    fetch(url2, bookings)
      .then(function(response) {
        return response.json();
      }).then(function(parsedResponse) {
        console.log('parsedResponse booking:', parsedResponse);

        const booked = parsedResponse;

        // ustalenie gdzie ma być zmieniany kolor




        //szuanie po elementach
        for (let book of booked) {

          let bookHour = utils.hourToNumber(book.hour);
          //console.log('bookHour', bookHour);

          let bookDuration = book.duration;
          //console.log('bookDuration', bookDuration);

          let bookDupa = bookHour + bookDuration;
          //console.log('suma booking i duration', bookDupa);


          if ((bookDupa > utils.hourToNumber(thisWidget.dom.output.value)) && (utils.hourToNumber(thisWidget.dom.output.value) > bookHour)) {
            licznik++;



          }
          thisWidget.hour = thisWidget.dom.output.value;
          //console.log('godzina Booking w hourPicker', thisWidget.hour);

          console.log('licznik 2for', licznik);
        }
        console.log('liczniki poza forX', licznik);

        let rangeSliderColour = document.getElementsByClassName('rangeSlider__fill')[0];


        /*if (licznik == 0) {
                    console.log('dupa w if1');
                    rangeSliderColour.style.background = 'green';

                }
                if (licznik == 1) {
                    console.log('dupa w if2');
                    rangeSliderColour.style.background = 'yellow';
                }
                if (licznik == 2) {
                    console.log('dupa w if3');
                    rangeSliderColour.style.background = 'red';
                }
                if (licznik == 3) {
                    rangeSliderColour.style.background = 'black';
                }*/

      });




  }

  initPlugin() {
    const thisWidget = this;


    console.log('dom', thisWidget.dom.input);

    const slider = document.getElementById('slider1');
    rangeSlider.create(thisWidget.dom.input, { polyfill: true });
    //https://github.com/Stryzhevskyi/rangeSlider/blob/master/README.md





    thisWidget.dom.input.addEventListener('input', function() {
      thisWidget.value = thisWidget.dom.input.value;


      //wywolac tables check
      thisWidget.tableCheck();

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
