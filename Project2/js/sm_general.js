$(document).ready(function() {
  
  // initialize popups
  $('.ui-popup').popup();
  
  // initialize tabs
  $('.menu .item').tab();
  
  // enable bottom sidebar
  $('.sidebar').sidebar('setting', 'transition', 'overlay');  
  $('.sidebar').first().sidebar('attach events', '.sm-overlay'); 
  
  // highlight code
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
  
  // redirect to CodeCanyon
  $('#buynow').on('click', function() {
    window.location.href = 'http://codecanyon.net/item/stock-market-widgets/11667244';
  });
});


/*
 * Yahoo stock symbol autocomplete
 */

"use strict";

var YAHOO = {};
YAHOO.util = {};
YAHOO.util.ScriptNodeDataSource = {};

YUI({
    filter: "raw"
}).use("datasource", "autocomplete", "highlight", function (Y) {
    var oDS, acNode = Y.one("#stock-symbol");

    oDS = new Y.DataSource.Get({
        source: "http://d.yimg.com/aq/autoc?query=",
        generateRequestCallback: function (id) {
            YAHOO.util.ScriptNodeDataSource.callbacks =
                YUI.Env.DataSource.callbacks[id];
            return "&callback=YAHOO.util.ScriptNodeDataSource.callbacks";
        }
    });
    oDS.plug(Y.Plugin.DataSourceJSONSchema, {
        schema: {
            resultListLocator: "ResultSet.Result",
            resultFields: ["symbol", "name", "exch", "type", "exchDisp"]
        }
    });

    acNode.plug(Y.Plugin.AutoComplete, {
        maxResults: 10,
        resultTextLocator: "symbol",
        resultFormatter: function (query, results) {
            return Y.Array.map(results, function (result) {
                var asset = result.raw,
                    text =  asset.symbol + ' (' + asset.name + ', ' + asset.exchDisp + ')';
                return Y.Highlight.all(text, query);
            });
        },
        requestTemplate:  "{query}&region=US&lang=en-US",
        source: oDS
    });

    acNode.ac.on("select", function (e) {
      var selector = '#stock-symbol-search-target';

      $(selector).removeClass('visible');
      $(selector).addClass('hidden');
      $(selector).data('symbol', e.result.raw.symbol);
      $(selector).addClass('sm-widget-quote-'+e.result.raw.symbol);
      smYqlRunQuery('yahoo.finance.quotes', 'symbol = "'+e.result.raw.symbol+'"');
    });
});