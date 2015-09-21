var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var stream = fs.createWriteStream("colors.md");

var url = 'https://www.google.com/design/spec/style/color.html#color-color-palette';

request(url, function(error, response, html){
  if(!error){
    var $ = cheerio.load(html);

    $(".color-group").each(function( index ) {
      var prefix =  $(this).find(".name").text().replace(' ', '_' ).toLowerCase();
      if (prefix === "") return false;

      var title = '### ' + prefix + '\n\n';
      stream.write(title);

      stream.write('```\n\n');

      $(this).find(".color").each(function () {
        var colorTitle = $(this).find(".shade").text().toLowerCase();;
        var colorHex = $(this).find(".hex").text();
        if (!$(this).hasClass("main-color")) {
          stream.write('<color name="' + prefix + "_" + colorTitle + '">' + colorHex + '</color>\n');
        }
      });
      stream.write('```\n\n');
    });
  }
});
