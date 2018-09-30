// Assignment 2. Save notes locally for News API
// Anders Rochester, february 2017, FWD16

//My date format, Swedish
function formatDate(date) {
    "use strict";
    var monthNames = ["januari", "februari", "mars",
            "april", "maj", "juni",
            "juli", "augusti", "september",
            "oktober", "november", "december"];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + " " + (monthNames[monthIndex]).slice(0, 3) + " " + year;
}

var today = formatDate(new Date());

// start a request
var xhr = new XMLHttpRequest();
var i;
var myIndex = 0;
var items = [];
var savedNews = [];
//presentation of the app
var presentationNotes = "Målet med denna applikation är att man skall kunna hämta nyheter från ett urval news api generera innehållet i en sida med hjälp av flex-card.  De huvudsakliga användningen utöver att visa nyheter är att man som användare kan spara anteckningar och spara dem lokalt och att de blir kvar där även om browsern uppdateras eller stängs av. I menyerna ovan finner du nyheter och sparade anteckningar<p class=line-1></p>";

//load the local storage
$(document).ready(function () {
    "use strict";
    // fallback if local storage is empty;
    if (localStorage.items !== undefined) {
        var savedItem = JSON.parse(localStorage.items);
        items = savedItem;
    }
    // start screen
    $(".card-wrapper").html("<div class='card-main card-main-start'><div class='card-header'><h2>Welcome to a newsfeed</h2><div class='delete delete-start'><img class='delete-img-start'src='images/x-small.svg'/></div></div><p class='card-body .card-body-start'>" + presentationNotes + " </p></div>");
});

// print out notes notes
// credits: next2u Stackowerflow

function printNotes(content) {
    "use strict";
    var newWin = window.open('', 'Print-Window');
    newWin.document.open();
    newWin.document.write('<html><body onload="window.print()">' + content + '</body></html>');
    newWin.document.close();
    setTimeout(function () {
        newWin.close();
    }, 10);
}


//display the todays date
$("header h1").html("Headlines - " + today);

//https://newsapi.org/v1/articles?source=ign&sortBy=top&apiKey=1ae4bb1455ff47a09d7eee51a689af04
//some chioce for the valuelist in header
var newsSource = [
    {name: "Die Zeit", source: "https://newsapi.org/v1/articles?source=die-zeit&sortBy=latest&apiKey=1ae4bb1455ff47a09d7eee51a689af04"},
    {name: "BBC", source: "https://newsapi.org/v1/articles?source=bbc-news&sortBy=top&apiKey=1ae4bb1455ff47a09d7eee51a689af04"},
    {name: "Independent", source: "https://newsapi.org/v1/articles?source=independent&sortBy=top&apiKey=1ae4bb1455ff47a09d7eee51a689af04"},
    {name: "ign", source: "https://newsapi.org/v1/articles?source=ign&sortBy=top&apiKey=1ae4bb1455ff47a09d7eee51a689af04"},
    {name: "TechCrunch", source: "https://newsapi.org/v1/articles?source=techcrunch&sortBy=top&apiKey=1ae4bb1455ff47a09d7eee51a689af04"},
    {name: "wired", source: "https://newsapi.org/v1/articles?source=wired-de&sortBy=top&apiKey=1ae4bb1455ff47a09d7eee51a689af04"},
    {name: "ars-technica", source: "https://newsapi.org/v1/articles?source=ars-technica&sortBy=top&apiKey=1ae4bb1455ff47a09d7eee51a689af04"}
];

//constructor for the valuelist
function addListItems(item, index) {
    $(".sourceList").append("<li class='api'>" + item.name + "</li>");
}
/*
function addNoteItems(item, index) {
    $(".sourceList").append("<li class='notes'>" + item.name + "</li>");
}
*/

newsSource.forEach(addListItems);

//hide the list of news
$("li").hide();

//toggle list of news
$(".sourceList").on("click", function () {
    $(".api").fadeToggle(600, "swing");
});

$("li").on("mouseover", function () {
    $(this).addClass("hover-color");
});

$("li").on("mouseout", function () {
    $(this).removeClass("hover-color");
});

/*------------------------------------------*/

//this is the core
//builds the site
function addNews(item) {
    "use strict";
    item.notes = "Your notes here...";
    $(".card-wrapper").append("<div class='card-main'><div class='card-header'><a href='" + item.url + "' target='_blank'><h2>" + item.title + "</h2></a><div class='delete-start'><img class='delete-img'src='images/x-small.svg'/></div></div><div class='line-1'></div><div class='card-body'><p>" + item.description + "</p> <img class='card-image' src='" + item.urlToImage + "' /></div><div class='button-wrap'><div class='save-button'><img class='save-img'src='images/floppy_disk_1.svg'/></div><div class='note-button'><img class='note-img'src='images/pen-15.svg'/></div><textarea class='card-notes' id='text'>" + item.notes + "</textarea></div></div></br>");
}

function addNotes(item) {
    "use strict";
    $(".card-wrapper").append("<div class='card-main'><div class='card-header'><a href='" + item.url + "' target='_blank'><h2>" + item.title + "</h2></a><div class='delete-start'><img class='delete-img'src='images/x-small.svg'/></div></div><p class='card-body'>" + item.description + "</p> <textarea id='text' class='card-notes'>" + item.notes + "</textarea><div class='button-wrap'><div class='save-button-notes'><img class='save-img'src='images/floppy_disk_1.svg'/></div><div class='print-button'><img class='print-img'src='images/printer-6.svg'/></div><div class='trash-button'><img class='trash-img'src='images/trash.svg'/></div></div></div></br>");
}
/*------------------------------------------*/

//show the saved notes on body

$(".noteList").on("click", function () {
    $(".api").hide();
    $(".card-main").remove();
    items.forEach(addNotes);
    $(".card-notes").addClass("card-notes-notes");
    $(".card-header").css({"font-size": "20px", "weight": "400"});
    $(".card-body").css({"font-size": "16px"});
    $(".card-main").css({"justify-content": "space-between", "background-color": "#dedede"});
});


// delete a note card forever

$("body").on("click", ".trash-button", function () {
    "use strict";
    var index = $(".trash-button").index(this);
    items.splice(index, 1);
    localStorage.items = JSON.stringify(items);
    $(this).parent().parent().remove();
});

// save updates sacved a copy and delete the old one

$("body").on("click", ".save-button-notes", function () {
    "use strict";
    $(this).removeClass("saved");
    myIndex = $(".save-button-notes").index(this);

    //gets the textcontent.
    var currentContent = $(this).parent().prev().val();

    //change locally stored object notes
    items[myIndex].notes = currentContent;
    localStorage.items = JSON.stringify(items);
    $(this).addClass("saved");
});

//delete any card temporary

$("body").on("click", ".delete-img", function () {
    "use strict";
    $(this).parent().parent().parent().remove();
});

//print out content from notes
$("body").on("click", ".print-button", function () {
    "use strict";
    var notesContent = $(this).parent().prev().val();
    $(this).parent().prev().on("click", printNotes(notesContent));
});


//change color on delete x
$("body").on("mouseover", ".delete-img", function () {
    "use strict";
    $(this).addClass("delete-img-hover");
}).on("mouseout", ".delete-img", function () {
    "use strict";
    $(this).removeClass("delete-img-hover");
});


//gets the specific API from newsSource:
// Index | Name
// 0     | Die Zeit
// 1     | BBC
// 2     | Independent
// 3     | TechCrunch
// 4     | wired
// 5     | ars-technica

// --------------------

function startUp(sourceIndex) {
    "use strict";
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var newsObject = JSON.parse(xhr.responseText);
            $("header h1").html(newsObject.source.toUpperCase() + "  -  " + today);
            newsObject.articles.forEach(addNews);
            $(".card-notes").hide();
            $(".save-button").hide();

            // take notes and show the note-pad
            $(".note-button").on("click", function (event) {
                var $this = $(this);
                var newPositonX = (event.pageX + 30);
                $this.next().fadeToggle(1000).css("left", newPositonX);
                $this.fadeOut(400);
                $this.prev().delay(400).fadeIn(400);
            });

            $(".save-button").on("click", function () {
                // save notes
                var $this = $(this);
                var index = $(".save-button").index(this);
                var styling = "\n - anteckningar - " + today + "\n\n";
                var localNotes = newsObject.source + "\n" + newsObject.articles[index].title + "\n" + newsObject.articles[index].description + styling + $(this).parent().find("textarea").val();
                newsObject.articles[index].notes = localNotes;
                items.push(newsObject.articles[index]);

                //save to local storage
                localStorage.items = JSON.stringify(items);

                $this.parent().find("textarea").fadeOut(500);
                $this.delay(500).fadeOut(500);
                $this.next().delay(1100).fadeIn();
                $this.next().addClass("saved");
            });
        }
    };
    var newsSourceChoice = newsSource[sourceIndex].source;
    xhr.open("GET", newsSourceChoice, true);
    xhr.send(null);
}

// delete the start card and load BBC

$("body").on("click", ".delete-img-start", function () {
    "use strict";
    $(this).parent().parent().parent().remove();
    //BBC has index 1 in newsSourceChoice
    startUp(1);
});

$(".sourceList").on("click", "li", function () {
    "use strict";
    var index = $("li").index(this);
    $(".card-main").remove();
    startUp(index);
});