var samplex = (function() {
  'use strict';
  
  const SETTINGS = {TEST_DATA_SIZE: 200000, CHISQ_CRITICAL_VALUE: 6.635, SAMPLING_METHOD: "SRS", OUTPUT_FORMAT: "R", POPULATION_PROPORTIONS: [0.01,0.05,0.10,0.20,0.30,0.40,0.50,0.60,0.70,0.80,0.90,0.95,0.99], POPULATION_MAP: [[0], [1], [2], [3], [4], [2, 4], [3, 4], [0, 1, 3, 5], [0, 1, 3, 5], [0, 1, 2, 4, 5], [0, 1, 3, 4, 5], [0, 2, 3, 4, 5], [1, 2, 3, 4, 5]], SP_NAMES: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", CERTAINTY: 0.99, REQUIRED_OBSERVATIONS: [30, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100]};
  
  // Goals -------------- //
  
  // I.   [X] Generate a test population of SETTINGS.TEST_DATA_SIZE with [0:5] distinct values
  //           based on SETTINGS.POPULATION_PROPORTIONS[A] and SETTINGS.POPULATION_MAP[A]. Sanity check.
  
  // II.  [X] Generate a simulated sampling distribution for number of A's sampled given
  //          SETTINGS.REQUIRED_OBSERVATIONS[A].
  
  // III. [X] Chi-Squared distribution for number of As in sample of N
  
  // IV.  [X] Generate probability distribution of N[A] given a specified total sample size N where
  //          C of x = (N of As)Cx * (N of Bs)C(N - x). Range of x is [0:MIN(N,N of As)]. REQUIRES Big.js.
  
  // Other TODOs ------------ //
  
  
  // 1. Function for downloading log -- default
  
  // 2. Function for downloading data -- R or Py, json is available with show_data
  
  // 3. Add setting and function for choosing output data format
  
  // ---------------------------------------------------------------- //
  
   const Log = { text: "", session: generate_id(), initialized: new Date(), updated: null };
  
   Log.text += "SAMPLEX (session '" + Log.session + "') initialized at: " + Log.initialized.toString() + " with settings:\n" + JSON.stringify(SETTINGS) + "\n\n";

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
   
   function download_log() {
     let element = document.createElement('a');
	   element.setAttribute('href', ('data:text/plain;charset=utf-8,' + encodeURIComponent(Log.text)));
	   element.setAttribute('download', ('samplex_log_' + Log.session + ".txt"));
	   element.style.display = 'none';
	   document.body.appendChild(element);
	   element.click();
	   document.body.removeChild(element);
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
  /*
  function download_data(data_id = dataset){
     let filename = 'samplex_' + Log.session + '_' + dataset_id;
     let result = '';
     if (SETTINGS.OUTPUT_FORMAT == 'R')  {
       let mime = 'text/plain';
       const types = {"number": "numeric","string":"character", "boolean":"logical"};
       result = "# Samplex Simulation Results (session = " + Log.session + ")\nsetwd('/Working/Directory')\n" + dataset + " <- data.frame(";";
        for (var k in Data.simulations[dataset]){
          result += Data.simulations[dataset][k].map(function(k) { return  k + " = "  + types[typeof( Data.simulations[dataset][k]] + "(" + Data.simulations[dataset][k].length + ")" }).join(", ") + ")\n";
        result_printR += Object.keys(json_lo1[0]).map(function(v) { return dfName + "$" + v + " <- c(" + json_lo1.map(function(r) { if (types[typeof(r[v])] == "character") { return "'" + r[v] + "'"; } else { return r[v];} }).join(", ") + ")\n" });
     } else if (SETTINGS.OUTPUT_FORMAT == 'Python') {
       let mime = 'text/plain';
     }
     
     let element = document.createElement('a');
	   element.setAttribute('href', ('data:' + mime + ';charset=utf-8,' + encodeURIComponent(text)));
	   element.setAttribute('download', filename);
	   element.style.display = 'none';
	   document.body.appendChild(element);
	   element.click();
	   document.body.removeChild(element);
   }
  */
  
  
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
    return counts;
  }
  
  function probability_of_sampling_at_least(target, at_least = 30){
    let results = { "sample_size": Data.simulations[target].sample_size, "number_of_samples": Data.simulations[target].counts.length, "at_least": at_least, "number_with_at_least": [],  "percentage_with_at_least" : []};
    let dataset = generate_id();
    for (var sg = 0; sg < SETTINGS.POPULATION_PROPORTIONS.length; sg++){
      results.number_with_at_least.push(0);
      let map = SETTINGS.POPULATION_MAP[sg];
      for (var i = 0; i < Data.simulations[target].counts.length; i++){
        let check = 0;
        for (var m = 0; m < map.length; m++){
          check += Data.simulations[target].counts[i][map[m]];
        }
        if (check >= at_least) {
          results.number_with_at_least[sg] += 1;
        }
      }
      results["percentage_with_at_least"].push((results.number_with_at_least[sg]) / results.number_of_samples).toFixed(4);
    }
    Data.simulations[dataset] = results;
    update_Log("Ran empirical probability distribution for samples of " + results.samples_size + "including at least " + at_least + " observations from As. Dataset ID = '" + dataset + "'.");
    console.log("-> " + dataset);
  }
  
  // ---------------------------------------------------------------- //
  
  function chisquare(sample_size = 100){
    let results = { "sample_size": [], "subgroup": [], "subgroup_n": [], "chisquare": [], "yates": [] };
    let dataset = generate_id();
    let pop = SETTINGS.TEST_DATA_SIZE;
    for (let a = 0; a < SETTINGS.POPULATION_PROPORTIONS.length; a++){
     let As = Math.round(pop * SETTINGS.POPULATION_PROPORTIONS[a]);
     let notAs = pop - As;
     for (let b = 0; b <= sample_size; b ++){
       let e1 = (sample_size/pop) * As;
       let e2 = (sample_size/pop) * notAs;
       let e3 = (As - e1);
       let e4 = (notAs - e2);
       let o1 = b;
       let o2 = Math.abs(sample_size - b);
       let o3 = Math.abs(As - o1);
       let o4 = notAs - o2;
       let chsq = ((e1-o1)*(e1-o1))/e1;
       chsq += ((e2-o2)*(e2-o2))/e2;
       chsq += ((e3-o3)*(e3-o3))/e3;
       chsq += ((e4-o4)*(e4-o4))/e4;
       let yates = ((Math.abs(o1-e1)-0.5)*(Math.abs(o1-e1)-0.5))/e1;
       yates += ((Math.abs(o2-e2)-0.5)*(Math.abs(o2-e2)-0.5))/e2;
       yates += ((Math.abs(o3-e3)-0.5)*(Math.abs(o3-e3)-0.5))/e3;
       yates += ((Math.abs(o4-e4)-0.5)*(Math.abs(o4-e4)-0.5))/e4;
       results.subgroup.push(SETTINGS.POPULATION_PROPORTIONS[a]);
       results.subgroup_n.push(b);
       results.chisquare.push(Number(chsq.toFixed(2)));
       results.yates.push(Number(yates.toFixed(2)));
       result.sample_size.push(sample_size)
     }
   }
   Data.simulations[dataset] = results;
   update_Log("Ran Chi-Squared distribution for sample size = " + sample_size + ". Dataset ID = '" + dataset + "'.");
   console.log("-> " + dataset);
  }
  
  
  // ---------------------------------------------------------------- //
  // ---------------------------------------------------------------- //
  // ---------------------------------------------------------------- //
  
  
  
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
    
    download: function(what = null){
      if (what === null) {
        return download_log();
      } else {
        console.log("Download data selected");
        //return download_data(what);
      }
    },
    
    user_update: function(user_text = "User updated the log."){
      return update_Log("FROM USER..." + user_text);
    },
    
    simulate_sampling_distribution: function(sample_size = 100, iterations = 10){
      let results = {"sample_size": sample_size, "counts": [] };
      for (var iteration = 0; iteration < iterations; iteration ++){
        results.counts.push(simulate_sample(sample_size));
      }
      let dataset = generate_id();
      D.simulations[dataset] = results;
      update_Log("Ran sampling distribution simulation with n = " + sample_size + " and iterations = " + iterations + ". Dataset ID = " + dataset + ".");
      console.log("-> " + dataset);
    },
    
    chisq_at_sample_size: function(n){
      return chisquare(n);
    },
    
    clear_simulations: function(){
      D.simulations.length = 0;
      update_Log("Cleaned out simulations data");
    },
    
    empirical_probability_at_least: function(id, min){
      return probability_of_sampling_at_least(id, min)
    },
    
    test: function(){
      return probability_of_sampling_at_least();
    }

  };
  
}());