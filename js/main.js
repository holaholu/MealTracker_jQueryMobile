$(document).ready(function(){
  $('#mealForm').on('submit', function(e){
    let meal = {
      id: guidGenerator(),
      tagline: $('#tagline').val(),
      type: $('#type').val(),
      date: $('#date').val(),
      calories: $('#calories').val(),
      description: $('#description').val(),
    }

    addMeal(meal);

    e.preventDefault();
  });
});

// Before Homepage Loads
$(document).on('pagebeforeshow', '#home', function(){
  getMeals();
  getCalories();
});

// Before Details Loads
$(document).on('pagebeforeshow', '#meal', function(){
  getMeal();
});

// Generate ID
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

// Save Meal to LS
function addMeal(meal){
  if(localStorage.getItem('meals') === null){
    let meals = [];
    meals.push(meal);
    localStorage.setItem('meals', JSON.stringify(meals));
  } else {
    let meals = JSON.parse(localStorage.getItem('meals'));
    meals.push(meal);
    localStorage.setItem('meals', JSON.stringify(meals));
  }
  // Clear Fields
  $('#tagline').val('');
  $('#date').val('');
  $('#calories').val('');
  $('#description').val('');
  $.mobile.changePage('#home');
}

// Get Meals From LS
function getMeals(){
  let output= '';
  if(localStorage.getItem('meals') == null || localStorage.getItem('meals') == '[]'){
    output = '<li>No Meals Found</li>';
    $('#meals').html(output).listview('refresh');
  } else{
    let meals = JSON.parse(localStorage.getItem('meals'));
    $.each(meals, function(index, meal){
      output += `
        <li>
          <a onclick="mealClicked('${meal.id}')">${meal.tagline}</a>
        </li>
      `;
    });
    $('#meals').html(output).listview('refresh');
  }
}

function mealClicked(mealId){
  sessionStorage.setItem('mealId', mealId);
  $.mobile.changePage('#meal');
}

// Get Meal Details
function getMeal(){
  if(sessionStorage.getItem('mealId') === null){
    $.mobile.changePage('#home');
  } else {
    let meals = JSON.parse(localStorage.getItem('meals'));
    $.each(meals, function(index, meal){
      if(meal.id === sessionStorage.getItem('mealId')){
        let output = `
          <h1>${meal.tagline}</h1>
          <small>${meal.type} On ${meal.date}</small>
          <p>${meal.description}</p>
          <p><strong>Calories: </strong>${meal.calories}</p>
          <button onclick="deleteMeal('${meal.id}')" class="ui-btn">Delete Meal</a>
        `;
        $('#mealDetails').html(output);
      }
    });
  }
}

// Delete Meal From LS
function deleteMeal(mealId){
  let meals = JSON.parse(localStorage.getItem('meals'));
  $.each(meals, function(index, meal){
    if(meal.id === mealId){
      meals.splice(index, 1);
    }
  });
  localStorage.setItem('meals', JSON.stringify(meals));
  $.mobile.changePage('#home');
}

// Get Calorie Count
function getCalories(){
  let output = '';
  if(localStorage.getItem('meals') === null){
    output = '<li style="text-align:center">Total Calores: 0</li>';
    $('#calorieDisplay').html(output).listview('refresh');
  } else {
    let meals = JSON.parse(localStorage.getItem('meals'));
    let calories = 0;
    $.each(meals,function(index, meal){
      calories = calories + parseInt(meal.calories);
    });
    output = '<li style="text-align:center">Total Calores: '+calories+'</li>';
    $('#calorieDisplay').html(output).listview('refresh');
  }
}
