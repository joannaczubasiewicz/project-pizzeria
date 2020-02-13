/* global Handlebars, utils */ // eslint-disable-line no-unused-vars
import { select, classNames, settings, templates } from '/js/settings.js';
/* eslint-disable no-unused-vars */
import AmountWidget from '/js/components/AmountWidget.js';
import CartProduct from '/js/components/CartProduct.js';
/* eslint-disable no-unused-vars */
import Cart from '/js/components/Cart.js';
import Product from '/js/components/Product.js';
import Booking from '/js/components/Booking.js';

//import { tns } from '/node_modules/tiny-slider/src/tiny-slider';







const app = {

  initPages: function() {
    const thisApp = this;
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    thisApp.mainLinks = document.querySelectorAll(select.nav.mainLinks);


    const idFromHash = window.location.hash.replace('#', '');


    let pageMatchingHash = thisApp.pages[0].id;

    for (let page in thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }

    }

    thisApp.activatePage(pageMatchingHash);

    for (let link of thisApp.mainLinks) {
      link.addEventListener('click', function(event) {

        event.preventDefault();


        const clickedElement = this;

        const id = clickedElement.getAttribute('href').replace('#', '');

        thisApp.activatePage(id);

        window.location.hash = '#/' + id;




      });

    }



    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function(event) {
        const clickedElement = this;
        event.preventDefault();

        /*get page id from href attribute */

        const id = clickedElement.getAttribute('href').replace('#', '');


        /*run thisApp.activePage with that id */
        thisApp.activatePage(id);


        /*change url hash */
        window.location.hash = '#/' + id;

        /*if (id == 'home') {
					thisapp.initSlider();
         }*/

      });
    }




  },
  activatePage: function(pageId) {
    const thisApp = this;
    /*add class "active to matching pages, remove from non-matching" */
    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    /*add class "active to matching links, remove from non-matching" */
    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#/' + pageId
      );
    }

  },

  initSlider: function() {
    const thisApp = this;

    thisApp.slider = document.querySelector('.my-slider');
    thisApp.slides = document.querySelector('.mySlides');
    //console.log('slider', thisApp.slider);

    /* eslint-disable */

        tns({ container: '.slider-container' });

        //dupa
        /*
                                    const slider = tns({
                                        container: '.my-slider',
                                        loop: true,
                                        items: 1,
                                        slideBy: 'page',
                                        nav: false,
                                        autoplay: true,
                                        speed: 100,
                                        autoplayButtonOutput: false,
                                        mouseDrag: true,
                                        lazyload: true,
                                        controlsContainer: '#customize-controls',
                                        responsive: {
                                            640: {
                                                items: 1,
                                            },

                                            768: {
                                                items: 1,
                                            }
                                        }

                                    });*/


        //       dupa koniec


        let slider = tns({

            container: '.slider-container',
            loop: true,
            items: 1,
            slideBy: 'page',
            nav: false,
            autoplay: true,
            speed: 100,
            autoplayButtonOutput: false,
            mouseDrag: true,
            navPosition: 'bottom',
            controlsPosition: 'bottom',

            responsive: {
                640: {
                    items: 1,
                },

                768: {
                    items: 1,
                }
            }

        });


        /* eslint-enable  */

  },

  initBooking: function() {
    const thisApp = this;
    /*find booking widget container */
    const bookingContainer = document.querySelector(select.containerOf.booking);

    /*create new booking  */
    thisApp.booking = new Booking(bookingContainer);


  },



  initMenu: function() {
    const thisApp = this;
    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id,
        thisApp.data.products[productData]);
    }
  },

  initData: function() {
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function(rawResponse) {
        return rawResponse.json();
      })
      .then(function(parsedResponse) {

        /*save parsedResponse as thisApp.data.products */

        thisApp.data.products = parsedResponse;

        /*execute initMenu method */
        thisApp.initMenu();

      });


  },





  initCart: function() {
    const thisApp = this;

    const cartEelem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartEelem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event) {
      app.cart.add(event.detail.product);
    });

  },

  init: function() {
    const thisApp = this;
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);

    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
    thisApp.initSlider();

  },


};

app.init();
