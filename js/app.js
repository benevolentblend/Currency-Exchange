(function() {
  /**
   * Throws an error if there was a problem with the request
   * @return {Sting} The status text from the response
   */
  var handleRequestErrors = function(res) {
    if(!res.ok) {
      throw Error(res.statusText);
    }
    return res;
  }

  /**
   * returns true of the value passed is a valid string.
   *  Conditions for valid string:
   *  - value must be a string
   *  - value must not be ""
   *  - value be a number
   * @param  {String/Number}  s value to test
   * @return {Boolean}   if the value was a valid string
   */
  var isValidString = function (s) {
    if(typeof s !== "string")
      false;
    else if(s == "")
      return false;
    else
      return !isNaN(s);
  }

  var fullNames = {
    "AUD": "Australian Dollar",
    "BRL": "Brazilian Real",
    "GBP": "British Pound Sterline",
    "BGN": "Bulgarian Lev",
    "CAD": "Canadian Dollar",
    "CNY": "Chinese Yuan Renminbi",
    "HRK": "Croatian Kuna",
    "CZK": "Czech Koruna",
    "DKK": "Danish Krone",
    "EUR": "Euro",
    "HKD": "Hong Kong Dollar",
    "HUF": "Hungarian Forint",
    "ISK": "Icelandic Krona",
    "IDR": "Indonesian Rupiah",
    "INR": "Indian Rupee",
    "ILS": "Israeli Shekel",
    "JPY": "Japanese Yen",
    "MYR": "Malaysian Ringgit",
    "MXN": "Mexican Peso",
    "NZD": "New Zealand Dollar",
    "NOK": "Norwegian Krone",
    "PHP": "Philippine Peso",
    "PLN": "Polish Zloty",
    "RON": "Romanian Leu",
    "RUB": "Russian Rouble",
    "SGD": "Singapore Dollar",
    "ZAR": "South African Rand",
    "KRW": "South Korean Won",
    "SEK": "Swedish Krona",
    "CHF": "Swiss Franc",
    "THB": "Thai Baht",
    "TRY": "Turkish Lira",
    "USD": "US Dollar"
  };

  // initialize Vue object
  var app = new Vue({
    el: "#app",
    data: {
      display: "",
      val1: 1,
      val2: undefined,
      cur1: "USD",
      cur2: "EUR",
      requestDate: "",
      currencies:[],
      rates: []
    },
    created() {
      fetch("https://api.exchangeratesapi.io/latest?base=USD")
        .then(handleRequestErrors)
        .then(res => res.json())
        .then(res => {
          this.rates = res.rates;

          // Store date as a moment object for formatting
          this.requestDate = moment(res.date);

          for(var i in this.rates) {
            // Ignore rates that are 0 or negative
            if(this.rates[i] > 0)
              this.currencies.push(i);
          }

          // Update val2 using requested rates
          this.updateVal2();
        })
        .catch(error => {
          this.display = "There was a problem connecting to the API. Please try again later.";
          console.error("Problem with API Request: ", error);
        })
    },
    computed: {
      formattedDate() {
        if(this.requestDate !== "")
          return "As of " + this.requestDate.format("MMM, Do YYYY");
      }
    },
    methods: {
      /**
       * Converts a value from one currency to another using requested rates
       * @param  {number} value Original value to convert
       * @param  {string} from  Currency of original value
       * @param  {string} to    Currency to convert to
       * @return {number}       value in new currency
       */
      convert(value, from, to) {
        return value / this.rates[from] * this.rates[to];
      },

      /**
       * calculates val2 using val1 and both currencies. If val1 is a negative
       * number, set val2 to undefined
       *
       */
      updateVal2() {

        // If val1 is not defined or the currencies are not loaded,
        // do not update anything
        if(typeof this.val2 === undefined || this.currencies.length == 0)
          return;

        // If val1 is an Invalid string or negative number, clear val2
        if(typeof this.val1 !== "number" && !isValidString(this.val1) || this.val1 < 0) {
          this.val2 = undefined;
        }

        else {
          this.val2 = this.convert(this.val1, this.cur1, this.cur2).toFixed(2);
          this.updateDisplay();
        }
      },
      /**
       * calculates val2 using val1 and both currencies. If val1 is a negative
       * number, set val2 to undefined
       *
       */
      updateVal1() {

        // If val1 is not defined or the currencies are not loaded,
        // do not update anything
        if(typeof this.val2 === undefined || this.currencies.length == 0)
          return;

        // If val2 is an Invalid string or negative number, clear val1
        if(typeof this.val2 !== "number" && !isValidString(this.val2) || this.val2 < 0) {
          this.val1 = undefined;
        }
        // convert val1 as a fixed number to the 2nd decimal place
        else {
          this.val1 = this.convert(this.val2, this.cur2, this.cur1).toFixed(2);
          this.updateDisplay();
        }
      },

      fullRateName(rate) {
        if(fullNames[rate] !== undefined)
          return fullNames[rate];
        else
          return rate;
      },

      /**
       * Updates the conversion line
       */
      updateDisplay() {
        this.display = `${this.val1} ${this.cur1} equals ${this.val2} ${this.cur2}`;
      }
    }
  });
})();
