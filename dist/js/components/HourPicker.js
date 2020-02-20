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

    tableCheck(godzina) {
        const thisWidget = this;
        // odczytac z JSON zareserwowane stoliki dla daty i godziny
        //console.log(godzina);

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

                    let ocupiedHour = utils.hourToNumber(ocupied.hour);
                    let ocupiedDuration = ocupied.duration;


                    let ocupiedDupa = ocupiedHour + ocupiedDuration;
                    //console.log("dupa", ocupiedDupa);

                    if ((ocupiedDupa > godzina) && (godzina > ocupiedHour)) {
                        licznik++;
                    }

                }

                console.log("licznik po 1 fech", licznik);

            });

        fetch(url2, bookings)
            .then(function(response) {
                return response.json();
            }).then(function(parsedResponse) {
                //console.log('parsedResponse booking:', parsedResponse);

                const booked = parsedResponse;



                //szuanie po elementach
                for (let book of booked) {

                    let bookHour = utils.hourToNumber(book.hour);
                    //console.log('bookHour', bookHour);

                    let bookDuration = book.duration;
                    // console.log('bookDuration', bookDuration);

                    let bookDupa = bookHour + bookDuration;
                    // console.log('suma booking i duration', bookDupa);


                    if ((bookDupa > godzina) && (godzina > bookHour)) {
                        licznik++;
                    }


                    //console.log('licznik 2for', licznik);
                }
                //console.log('liczniki poza forX', licznik);

                console.log("licznik po 2 fech", licznik);

            });

    }


    setColor() {
        const thisWidget = this;
        //let rangeSliderColour = document.getElementsByClassName('rangeSlider');
        console.log('Jestem w metodzie setcolor');
        let tableCount = [];
        //for (let i = 12; i < 24; i += 0.5) {
        //    tableCount.push(thisWidget.tableCheck(i));
        // }
        console.log("ala ma kota", thisWidget.tableCheck(13));



        /*for (let hour in hours) {

            if (licznik == 0) {
                console.log('dupa w if1');
                colors.push('green');
            } else if (licznik == 1) {
                console.log('dupa w if2');
                colors.push('yellow');
            } else if (licznik == 2) {
                console.log('dupa w if3');
                colors.push('red');
            } else if (licznik == 3) {
                colors.push('black');
            }
        }
        console.log('colors', colors);
        //rangeSliderColour.style.background = 'black';


        console.log('colors', colors);*/
        //}


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
