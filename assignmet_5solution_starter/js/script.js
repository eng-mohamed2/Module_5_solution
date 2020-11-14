$(function () { // same as document.addEventListener("DOMContentLoaded")

   // same as document.querySelector("navbarToggle").addEventListener("blur")
   $("#navbarToggle").blur(function (event) {
       var screenWidth = window.innerWidth;
       if (screenWidth < 768) {
           ("#collapsable-nav").collapse('hide');
       }
   });
});

(function (global) {

    var dc = {};

    var homehtml = "snippets/home-snippet.html";
    var allCategoriesUrl = 
        "http://davids-restaurant.herokuapp.com/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";

    // convinience function for inserting innerhtml for 'select'
    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

// show loading icon inside element identified by 'selector' 
   var showLoading = function (selector) {
       var html = "<div class='text-center'>";
       html += "<img src='images/ajax-loader.gif'></div>";
       insertHtml(selector, html);
   };

// return substitute of '{{propName}}'
// with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName +"}}";
    string = string
        .replace(new RegExp(propToReplace, "g"), propValue);
        return string;
}

 // on page load (before images or CSS) 
 document.addEventListener("DOMContentLoaded", function (event) { 

 // on first load, show home view
   showLoading("#main-content");
   $ajaxUtils.sendGetRequest(
       homehtml,
       function (responseText) {
           document.querySelector("#main-content")
           .innerHTML = responseText;
       },
         false);
     }); 

// load the menu categories view
dc.loadMenuCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
        allCategoriesUrl,
        buildAndShowCategoriesHTML);
};


// Builds HTML for the categories page based on the data 
// from the server 
function buildAndShowCategoriesHTML (categories) {
    // load title snippet of categories page 
    $ajaxUtils.sendGetRequest(
           categoriesTitleHtml,
           function (categoriesTitleHtml) {
               // retrieve single category snippet 
               $ajaxUtils.sendGetRequest(
                   categoryHtml,
                   function (categoryHtml) {
                     var categoriesViewHtml = 
                        buildCategoriesViewHtml (categories,
                            categoriesTitleHtml,
                            categoryHtml);
                    insertHtml("#main-content", categoriesViewHtml);
                   },
                false);
           },
        false);
}


// using categories data and snippets html
// build categories view html to be inserted into page
function buildCategoriesViewHtml(categories,
                       categoriesTitleHtml,
                       categoryHtml) {

    var finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>";

    // loop over categories 
    for (var i = 0; i < categories.length; i++) {
        // insert category values 
        var html = categoryHtml;
        var name = "" + categories[i].name;
        var short_name = categories[i].short_name;
        html =
            insertProperty(html, "name", name);
        html = 
            insertProperty(html,
                "short_name",
                short_name);
        finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }
     global.$dc = dc;
})(window);