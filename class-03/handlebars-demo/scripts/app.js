'use strict';

//get the html
var source = document.getElementById("entry-template").innerHTML;
// make a function to actually build copies
var template = Handlebars.compile(source);

// get some data
var context = { title: "My New Post", body: "This is my first post!" };

// turn that data into html that matches our template
var html = template(context);

$('main').append(html);


// ========== Dog Stuff ===========

function Dog (dogObj) {
  this.name = dogObj.name;
  this.hobbies = dogObj.hobbies;
  this.image_url = dogObj.image_url;

  Dog.allDogs.push(this);
}

Dog.prototype.renderWithHandleBars = function(){
  const dogTemplateHtml = $('#dog-template').html();
  // make a function to actually build copies
  const renderDogWithHandlebars = Handlebars.compile(dogTemplateHtml);

  const dogHtml = renderDogWithHandlebars(this);
  $('#dogs').append(dogHtml);
}

Dog.allDogs = [];

//get the html

// get some data
dogsAndCats.forEach(dogOrCat => {
  new Dog(dogOrCat);
})
// turn that data into html that matches our template

Dog.allDogs.forEach(dog => {
  dog.renderWithHandleBars();
})


// ============ Neighborhood Stuff =================

/*
const neighborhoodDataSet = [
  {
    name:        'Fremont',
    city:        'Seattle',
    population:  '23,566',
    founded:     '1820',
    body:        '<p>This is example text to show you how <strong>HTML</strong> can be escaped using <em>Handlebars</em>.</p>'
  },
*/

neighborhoodDataSet.forEach(nh => {
  const nhHtml = $('#neigborhood-template').html();
  const neighborHoodTemplate = Handlebars.compile(nhHtml);
  // neighborHoodTemplate

  const soup = neighborHoodTemplate(nh);



  $('#neighborhoods').append(soup);
})

