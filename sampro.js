var sampro = (function() {
  'use strict';
  
  const SETTINGS = {TEST_DATA_SIZE: 200000, CHISQ_CRITICAL_VALUE: 6.635, SAMPLING_METHOD: "SRS", OUTPUT_FORMAT: "R", POPULATION_PROPORTIONS: [0.01,0.05,0.10,0.20,0.30,0.40,0.50,0.60,0.70,0.80,0.90,0.95,0.99], POPULATION_MAP: [[0], [1], [2], [3], [4], [2, 4], [3, 4], [0, 1, 3, 5], [0, 1, 3, 5], [0, 1, 2, 4, 5], [0, 1, 3, 4, 5], [0, 2, 3, 4, 5], [1, 2, 3, 4, 5]], SP_NAMES: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", CERTAINTY: 0.99, REQUIRED_OBSERVATIONS: [30, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100]};
  
  // Goals -------------- //
  
  // I.  [ ] Generate probability distribution of N[A] given a specified total sample size N where
  //          C of x = (N of As)Cx * (N of Bs)C(N - x). Range of x is [0:MIN(N,N of As)].
  
  // II. [ ] Generate probability distribution of N[A] across range of total sample sizes
  
  
  // ---------------------------------------------------------------- //
  
   const Log = { text: "", session: generate_id(), initialized: new Date(), updated: null };
  
   Log.text += "SAMPRO (session '" + Log.session + "') initialized at: " + Log.initialized.toString() + " with settings:\n" + JSON.stringify(SETTINGS) + "\n\n";

   function update_Log(t) {
     let u = Date.now();
     Log.text += "@+" + ((u - Log.initialized)/1000).toFixed(2) +  " seconds: " + t + "\n\n";
     Log.updated = u;
   }
   
   function update_SETTINGS(k, v) {
     SETTINGS[k] = v;
     update_Log("SETTINGS updated..." + k + " = " + v)
   }
   
   function generate_id(){
     let id = "";
     for (var i = 0; i < 7; i++){
       id += String.fromCharCode(97 + Math.round((Math.random()*(122-97))));
     }
     return id;
   }
   
   // ---------------------------------------------------------------- //
   
   var Data = { array: [], metadata: {}, simulations: {} };
   generate_sample_frame();
   sanity_check();
   shuffle(Data.array);
  
   function generate_sample_frame(){
     let quotas = SETTINGS.POPULATION_PROPORTIONS.slice(0,5);
     quotas.push(0.34);
     for (let q = 0; q < quotas.length; q++){
       for (let sp_N = 0; sp_N < (Math.round(SETTINGS.TEST_DATA_SIZE * quotas[q])); sp_N++) {
         Data.array.push(q);
       }
     }
     update_Log("Simulated population generated with N = " + Data.array.length + ".");
   }
   
   function sanity_check(){
    var check = "Check Sub-groups in simulated population: \nSP.....N (%)\n";
    for (var c = 0; c <= 5; c++) {
      let sp_N = Data.array.filter(function(t){ return t === c; }).length;
      check += " " + c + "....." + sp_N + " (" + ((sp_N / Data.array.length) * 100).toFixed(1) + ")\n";
    }
    update_Log(check);
  }
  
  function shuffle(){ // from Mike Bostock. See https://bost.ocks.org/mike/shuffle/
    var m = Data.array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      t = Data.array[m];
      Data.array[m] = Data.array[i];
      Data.array[i] = t;
    }
    update_Log("Simulated population sorted");
  }
  
  function get_dataset(id){
    let name = Log.session + "_" + id;
    return "var " + name + " = " + JSON.stringify(Data.simulations[id]) + ";";
  }
  
  // ---------------------------------------------------------------- //
  function compare(a, b) { return a - b; }
  
  function simulate_sample(n){
    let pointer = Math.floor(Math.random() * (Data.array.length - n));
    let sample = Data.array.filter(function(r, index){ return (index >= pointer) && (index < (pointer + n)); });
    let counts = [0,0,0,0,0,0];
    for (var i = 0; i < sample.length; i++){
      for (var sg = 0; sg < 6; sg++){
        if (sample[i] == sg) {
          counts[sample[i]] += 1;
        }
      }
    }


      function sum_strings(a, b) {
        var zrx = /^0+/; // remove leading zeros
        a = a.replace(zrx, '').split('').reverse();
        b = b.replace(zrx, '').split('').reverse();

        var result = [], max = Math.max(a.length, b.length);
        for (var memo = 0, i = 0; i < max; i++) {
          var res = parseInt(a[i] || 0) + parseInt(b[i] || 0) + memo;
          result[i] = res % 10;
          memo = (res - result[i]) / 10;
        }

        if (memo) {
          result.push(memo);
        }

        return result.reverse().join('');
      }
      
      function subtract_strings(a, b) {
        let zrx = /^0+/; // remove leading zeros
        a = a.replace(zrx, '').split('').reverse();
        b = b.replace(zrx, '').split('').reverse();
        let res;
        let result = [], max = Math.max(a.length, b.length);
        for (var i = 0; i < max; i++) {
          if (parseInt(a[i] || 0) < parseInt(b[i] || 0)) {
            a[i+1] --;
            res = (10 + parseInt(a[i] || 0)) - parseInt(b[i] || 0);
          } else {
            res = parseInt(a[i] || 0) - parseInt(b[i] || 0);
          }
          result[i] = res;
        }
        return result.reverse().join('');
      }
      
      function less_than_strings(c1, c2){
        let zrx = /^0+/; // remove leading zeros
        c1 = c1.replace(zrx, '').split('').reverse();
        c2 = c2.replace(zrx, '').split('').reverse();
        if (c1.length < c2.length) {
          return true;
        } else if (c2.length < c1.length) {
          return false;
        } else {
          for (var digit = 0; digit < c1.length; digit++){
            if (parseInt(c1[digit]) < parseInt(c2[digit])) {
              return true;
            } else if (parseInt(c1[digit]) > parseInt(c2[digit])) {
              return false;
            }
          }
        }
        return false;
      }
      
      function multiply_strings(factor1, factor2){
        let zrx = /^0+/; // remove leading zeros
        factor1 = factor1.replace(zrx, '');
        factor2 = factor2.replace(zrx, '');
        let count = 0;
        let product = '0';
        for (var p = 0; less_than_strings(p.toString(), factor2); p++){
          product = sum_strings(product, factor1);
        }
        return product;
      }
      
      function divide_strings(dividend, divisor){
        let quotient;
        if (dividend == divisor) {
          quotient = '1';
        } else {
          quotient = '0';
          let test = '0';
          while ((test == dividend) || (less_than_strings(test, dividend))) {
            quotient = sum_strings(quotient, '1');
            test = multiply_strings(quotient, divisor);
          }
        }
        return quotient;
      }
      
 var D = Data, L = Log;
  
  return {
    
    D,
    
    L,
    
    show_log: function(){
      return Log.text;
    },
    
    settings: function(setting = "unspecified", value = "unspecified"){
      if (setting == "unspecified") {
        console.log(JSON.stringify(SETTINGS));
      } else if (value == "unspecified") {
        console.log(SETTINGS[setting]);
      } else {
        return update_SETTINGS(setting, value);
      }
    },
    
    show_data: function(dataset){
      return get_dataset(dataset);
    },
    
    user_update: function(user_text = "User updated the log."){
      return update_Log("FROM USER..." + user_text);
    },
    
    clear_simulations: function(){
      D.simulations.length = 0;
      update_Log("Cleaned out simulations data");
    },
    
    test: function(){
      return probability_of_sampling_at_least();
    }

  };
  
}());