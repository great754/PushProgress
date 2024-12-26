document.addEventListener("DOMContentLoaded", () => {
    let totalCals = 0;
    let breakfastTimes = 1;
    let lunchTimes = 1;
    let dinnerTimes = 1;
    let snackTimes = 1;


    const breakfastNext = document.querySelector('#decoysubmit1');
    const lunchNext = document.querySelector('#decoysubmit2');
    const lunchPrev = document.querySelector('#previous1');
    const dinnerNext = document.querySelector('#decoysubmit3');
    const dinnerPrev = document.querySelector('#previous2');
    const snacksSubmit = document.querySelector('#submit-button');
    const snacksPrev = document.querySelector('#previous3');

    breakfastNext.addEventListener("click", () => {
        document.querySelector('#breakfast-form').style.display = 'none';
        document.querySelector('#lunch-form').style.display = 'block';
    })

    lunchNext.addEventListener("click", () => {
        document.querySelector('#lunch-form').style.display = 'none';
        document.querySelector('#dinner-form').style.display = 'block';
    })

    lunchPrev.addEventListener("click", () => {
        document.querySelector('#breakfast-form').style.display = 'block';
        document.querySelector('#lunch-form').style.display = 'none';
    })

    dinnerNext.addEventListener("click", () => {
        document.querySelector('#snacks-form').style.display = 'block';
        document.querySelector('#dinner-form').style.display = 'none';
    })

    dinnerPrev.addEventListener("click", () => {
        document.querySelector('#lunch-form').style.display = 'block';
        document.querySelector('#dinner-form').style.display = 'none';
    })

    snacksPrev.addEventListener("click", () => {
        document.querySelector('#dinner-form').style.display = 'block';
        document.querySelector('#snacks-form').style.display = 'none';
    })

    snacksSubmit.addEventListener("click", () => {
        const calories = document.querySelectorAll('.calories');
        for (let i = 0; i < calories.length; i++){
            const calorie = Number(calories[i].value);
            totalCals += calorie; 
        }
        document.querySelector('#old-calories').value = totalCals;
        document.querySelector('#hidden-form').submit();
    })

    // function that fetches calories and sets the box to it
    function getCal(food, calBox, servings) {
        $.ajax({
            method: 'GET',
            url: 'https://api.calorieninjas.com/v1/nutrition?query=' + food,
            headers: { 'X-Api-Key': '0A4UID/vDwQwBEgxYj5rsw==et2WzgYuUeN89gMV'},
            contentType: 'application/json',
            success: function(result) {
                console.log(result);
                let items = result.items;
                let calories = 0;
                let protein = 0;
                if (items.length > 1) {
                    for (let i = 0; i < items.length; i++) {
                        calories += items[i].calories * servings;
                        protein += items[i].protein_g * servings;
                    }
                } else if (items.length === 1) {
                    calories = items[0].calories * servings;
                    protein = items[0].protein_g * servings;
                } else {
                    calories = 0;
                }
                calBox.value = Math.round(calories);
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
    }


    function modifyBreakfastCount(value) {
        breakfastTimes = value;
    }

    function modifyLunchCount(value) {
        lunchTimes = value;
    }

    function modifyDinnerCount(value) {
        dinnerTimes = value;
    }

    function modifySnacksCount(value) {
        snackTimes = value;
    }

    // function that creates a new div, and adds the name element, servings, and calories.
    // it takes the class names...
    function addDiv(meal, divId, mealCount){
        const bigDiv = document.querySelector(divId);


        const newDiv = document.createElement("div");
        const inputLabel = document.createElement("label");
        const newInput = document.createElement("input");
        const servingsLabel = document.createElement("label");
        const newServings = document.createElement("input");
        const caloriesLabel = document.createElement("label");
        const newCalories = document.createElement("input");
        const dontKnow = document.createElement("a");

        bigDiv.appendChild(newDiv);             // add the new div to the original div
        newDiv.appendChild(inputLabel);
        newDiv.appendChild(newInput);
        newDiv.appendChild(servingsLabel);
        newDiv.appendChild(newServings);
        newDiv.appendChild(caloriesLabel);
        newDiv.appendChild(newCalories);
        newDiv.appendChild(dontKnow);
        
        newDiv.classList.add(meal + "-div");
        newDiv.id = meal + "-div" + mealCount;
        newInput.classList.add(meal + "-name");
        newInput.id = meal + "-name" + mealCount;
        newInput.name=meal + "-name";
        //inputLabel.for = meal + "-name";
        inputLabel.textContent = "Food name";
        servingsLabel.textContent = "Servings";
        caloriesLabel.textContent = "Calories";
        newCalories.id = meal + "-calories" + mealCount;
        newCalories.type = "number";
        newCalories.value = 0;
        newServings.type = "number";
        newServings.value = 1;
        dontKnow.classList.add('dontknow');
        dontKnow.id = 'dontknow' + mealCount;
        dontKnow.textContent = "Don't Know?";
        newCalories.classList.add('calories');
        
        if (meal === 'breakfast'){
            modifyBreakfastCount(breakfastTimes+1);
        } else if (meal === 'lunch') {
            modifyLunchCount(lunchTimes+1);
        } else if (meal == 'dinner') {
            modifyDinnerCount(dinnerTimes+1);
        } else {
            modifySnacksCount(snackTimes+1);
        }

        dontKnow.addEventListener("click", () => {
            getCal(newInput.value, newCalories, newServings.value);
        });
    };


    function removeDiv(divId, meal, mealCount) {
        let divs = document.querySelectorAll(divId);
        if (divs.length > 0) {
            divs[divs.length - 1].remove();

            if (meal === 'breakfast'){
                modifyBreakfastCount(breakfastTimes-1);
            } else if (meal === 'lunch') {
                modifyLunchCount(lunchTimes-1);
            } else if (meal == 'dinner') {
                modifyDinnerCount(dinnerTimes-1);
            } else {
                modifySnacksCount(snackTimes-1);
            }
        }
    }



////////////////////////////////   BREAKFAST   ///////////////////////////////////////////////////////
    const breakfast_add = document.querySelector('#breakfastaddmore');      // button
    breakfast_add.addEventListener("click", () => {
        if (breakfastTimes < 4) {
            addDiv("breakfast", "#breakfast-form", breakfastTimes);
        }
    });


    const breakfast_remove = document.querySelector('#breakfastremove');
    breakfast_remove.addEventListener("click", () => {
        removeDiv('.breakfast-div', "breakfast", breakfastTimes);
    });


    document.querySelector("#breakfastdontknow").addEventListener("click", () => {
        getCal(document.querySelector('#breakfast-name0').value, document.querySelector('#breakfast-calories0'), document.querySelector('#breakfast-servings0').value);
    });


////////////////////////////   LUNCH   ////////////////////////////////////
    const lunch_add = document.querySelector('#lunchaddmore');      // button
    lunch_add.addEventListener("click", () => {
        if (lunchTimes < 4) {
            addDiv("lunch", "#lunch-form", lunchTimes);
        }
    });


    const lunch_remove = document.querySelector('#lunchremove');
    lunch_remove.addEventListener("click", () => {
        removeDiv('.lunch-div', "lunch", lunchTimes);
    });


    document.querySelector("#lunchdontknow").addEventListener("click", () => {
        getCal(document.querySelector('#lunch-name0').value, document.querySelector('#lunch-calories0'), document.querySelector('#lunch-servings0').value);
    });


///////////////////////////   DINNER   ///////////////////////////////////////////////////

    const dinner_add = document.querySelector('#dinneraddmore');      // button
    dinner_add.addEventListener("click", () => {
        if (dinnerTimes < 4) {
            addDiv("dinner", "#dinner-form", dinnerTimes);
        }
    });


    const dinner_remove = document.querySelector('#dinnerremove');
    dinner_remove.addEventListener("click", () => {
        removeDiv('.dinner-div', "dinner", dinnerTimes);
    });


    document.querySelector("#dinnerdontknow").addEventListener("click", () => {
        getCal(document.querySelector('#dinner-name0').value, document.querySelector('#dinner-calories0'), document.querySelector('#dinner-servings0').value);
    });

    //////////////////////////////   SNACKS   /////////////////////////////////////
    const snacks_add = document.querySelector('#snacksaddmore');      // button
    snacks_add.addEventListener("click", () => {
        if (snackTimes < 4) {
            addDiv("snacks", "#snacks-form", snackTimes);
        }
    });


    const snacks_remove = document.querySelector('#snacksremove');
    snacks_remove.addEventListener("click", () => {
        removeDiv('.snacks-div', "snacks", snackTimes);
    });


    document.querySelector("#snacksdontknow").addEventListener("click", () => {
        getCal(document.querySelector('#snacks-name0').value, document.querySelector('#snacks-calories0'), document.querySelector('#snacks-servings0').value);
    });
});