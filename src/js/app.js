/* global Handlebars, utils */ // eslint-disable-line no-unused-vars
import { select, classNames, settings, templates } from '/js/settings.js';
/* eslint-disable no-unused-vars */
import AmountWidget from '/js/components/AmountWidget.js';
import CartProduct from '/js/components/CartProduct.js';
/* eslint-disable no-unused-vars */
import Cart from '/js/components/Cart.js';
import Product from '/js/components/Product.js';






const app = {

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
        console.log('parsedResponse:', parsedResponse);
        /*save parsedResponse as thisApp.data.products */

        thisApp.data.products = parsedResponse;

        /*execute initMenu method */
        thisApp.initMenu();

      });

    console.log('thisApp.data:', JSON.stringify(thisApp.data));
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

    thisApp.initData();
    thisApp.initCart();
  },


};

app.init();