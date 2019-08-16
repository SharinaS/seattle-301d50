'use strict';


const allDogs = [];

const Dog = function (name, image_url, hobbies) {
  this.name = name;
  this.image_url = image_url;
  this.hobbies = hobbies;
  allDogs.push(this);
};

Dog.prototype.renderWithJquery = function(){
  // $() is a getter in this instance
  const $myTemplate = $('#dog-template');
  //.html() is a getter in this instance
  const myTemplateHtml = $myTemplate.html()
  
  // $('<section></section>) is used as a setter here
  const $newSection = $('<section></section>')
  // .html() is used as a setter here
  $newSection.html(myTemplateHtml);

  $newSection.find('h2').text(this.name);
  $newSection.find('p').text(this.hobbies);
  $newSection.find('img').attr('src', this.image_url);
  $('main').append($newSection); 
}


//AJAX 
const getAllDogsFromFile = () => {
  //function signature of function(data)
  $.get('data.json').then(dogs => {
    console.log('dogs from the .then', dogs);

    dogs.forEach(eachDog => {
      new Dog(eachDog.name, eachDog.image_url, eachDog.hobbies);
    })

    allDogs.forEach(dog => {
      dog.renderWithJquery();
    })

  })

  const myDogs = $.get('data.json');
  console.log('dogs from the console log', myDogs);

 
}

getAllDogsFromFile();
























Dog.prototype.renderWithVanilla = function() {
  const placeToGo = document.getElementById('vanilla-target-id');

  const sectionEl = document.createElement('section');
  const h2El = document.createElement('h2');
  const imgEl = document.createElement('img');
  const pEl = document.createElement('p');

  h2El.textContent = this.name;
  imgEl.src = this.image_url;
  pEl.textContent = this.hobbies;

  sectionEl.appendChild(h2El);
  sectionEl.appendChild(imgEl);
  sectionEl.appendChild(pEl);

  placeToGo.appendChild(sectionEl);
}

