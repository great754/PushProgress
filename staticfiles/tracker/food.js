document.addEventListener("DOMContentLoaded", () => {
    
    const screenWidth = window.innerWidth;

    if (screenWidth < 559) {
        document.querySelector('.navbar').style.width = '559px';
    }

    window.addEventListener("resize", () => {
        if (screenWidth < 508) {
            document.querySelector('.navbar').style.width = '559px';
        }
        else {
            document.querySelector('.navbar').style.width = '100%';
        }
    })

    
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
                if (items.length >= 1) {
                    calories += items[0].calories * servings;
                    protein += items[0].protein_g * servings;
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
        const newInput = document.createElement("input");
        const newServings = document.createElement("input");
        const newCalories = document.createElement("input");
        const dontKnow = document.createElement("i");
        const dontKnowDiv = document.createElement("div");
        const hover = document.createElement("span");
        
        bigDiv.appendChild(newDiv);             // add the new div to the original div
        void newDiv.offsetWidth;
        newDiv.appendChild(newInput);
        newDiv.appendChild(newServings);
        newDiv.appendChild(newCalories);
        newDiv.appendChild(dontKnowDiv);
        dontKnowDiv.appendChild(dontKnow);
        dontKnowDiv.appendChild(hover);
        
        hover.classList.add("popuptext");
        hover.textContent = "Approximate Calories, provided by CalorieNinjas";
        newDiv.classList.add(meal + "-div");
        newDiv.classList.add("fade-in");
        newDiv.id = meal + "-div" + mealCount;
        newInput.classList.add(meal + "-name");
        newInput.classList.add("text-box");
        newInput.style.marginRight = "5px";
        newServings.style.marginRight = "5px";
        newCalories.style.marginRight = "5px";
        dontKnowDiv.style.marginRight = "8.5px";
        newCalories.classList.add("text-box");
        newServings.classList.add("text-box");
        newCalories.style.width = "100px";
        newServings.style.width = "80px";
        newInput.style.width = "240px";
        newInput.id = meal + "-name" + mealCount;
        newInput.name=meal + "-name";
        newCalories.id = meal + "-calories" + mealCount;
        newCalories.type = "number";
        newCalories.value = 0;
        newServings.type = "number";
        newServings.value = 1;
        dontKnow.classList.add('dontknow');
        dontKnowDiv.classList.add("popup");
        dontKnowDiv.id = 'dontknow' + mealCount;
        dontKnow.classList.add("fa-question-circle");
        dontKnow.classList.add("fa");
        dontKnow.ariaHidden = "true";
        newCalories.classList.add('calories');

        newDiv.addEventListener("animationend", () => {
            newDiv.classList.remove("fade-in");
        });
        
        if (meal === 'breakfast'){
            modifyBreakfastCount(breakfastTimes+1);
            if (breakfastTimes > 1 && breakfastTimes < 4) {
                document.querySelector('#breakfastremove').style.display = 'inline-block';
            } else if (breakfastTimes > 3) {
                document.querySelector('#breakfastaddmore').style.display = 'none';
            }
        } else if (meal === 'lunch') {
            modifyLunchCount(lunchTimes+1);
            if (lunchTimes > 1 && lunchTimes < 4) {
                document.querySelector('#lunchremove').style.display = 'inline-block';
            } else if (lunchTimes > 3) {
                document.querySelector('#lunchaddmore').style.display = 'none';
            }
        } else if (meal == 'dinner') {
            modifyDinnerCount(dinnerTimes+1);
            if (dinnerTimes > 1 && dinnerTimes < 4) {
                document.querySelector('#dinnerremove').style.display = 'inline-block';
            } else if (dinnerTimes > 3) {
                document.querySelector('#dinneraddmore').style.display = 'none';
            }
        } else {
            modifySnacksCount(snackTimes+1);
            if (snackTimes > 1 && snackTimes < 4) {
                document.querySelector('#snacksremove').style.display = 'inline-block';
            } else if (snackTimes > 3) {
                document.querySelector('#snacksaddmore').style.display = 'none';
            }
        }


        dontKnow.addEventListener("click", () => {
            getCal(newInput.value, newCalories, newServings.value);
        });
    };


    function removeDiv(divId, meal, mealCount) {
        const divs = document.querySelectorAll(divId);
        if (divs.length > 0) {
            const lastDiv = divs[divs.length - 1];
            lastDiv.classList.add("fade-out");
    
            // Delay removal to allow the animation to play
            lastDiv.addEventListener("animationend", () => {
                lastDiv.remove();

            if (meal === 'breakfast'){
                modifyBreakfastCount(breakfastTimes-1);
                if (breakfastTimes < 4 && breakfastTimes > 2) {
                    document.querySelector('#breakfastaddmore').style.display = 'inline-block';
                } else if (breakfastTimes < 2) {
                    document.querySelector('#breakfastremove').style.display = 'none';
                }
            } else if (meal === 'lunch') {
                modifyLunchCount(lunchTimes-1);
                if (lunchTimes < 4 && lunchTimes > 2) {
                    document.querySelector('#lunchaddmore').style.display = 'inline-block';
                } else if (lunchTimes < 2) {
                    document.querySelector('#lunchremove').style.display = 'none';
                }
            } else if (meal == 'dinner') {
                modifyDinnerCount(dinnerTimes-1);
                if (dinnerTimes < 4 && dinnerTimes > 2) {
                    document.querySelector('#dinneraddmore').style.display = 'inline-block';
                } else if (dinnerTimes < 2) {
                    document.querySelector('#dinnerremove').style.display = 'none';
                }
            } else {
                modifySnacksCount(snackTimes-1);
                if (snackTimes < 4 && snackTimes > 2) {
                    document.querySelector('#snacksaddmore').style.display = 'inline-block';
                } else if (snackTimes < 2) {
                    document.querySelector('#snacksremove').style.display = 'none';
                }
            }
        });
    }
    }



////////////////////////////////   BREAKFAST   ///////////////////////////////////////////////////////
    const breakfast_add = document.querySelector('#breakfastaddmore');      // button
    breakfast_add.addEventListener("click", () => {
        if (breakfastTimes < 4) {
            addDiv("breakfast", "#breakfast", breakfastTimes);
            div = document.querySelector('#breakfast-form');
            div.style.height = (parseInt(getComputedStyle(div).height) + 90) + "px";
        }
    });


    const breakfast_remove = document.querySelector('#breakfastremove');
    breakfast_remove.addEventListener("click", () => {
        removeDiv('.breakfast-div', "breakfast", breakfastTimes);
            div = document.querySelector('#breakfast-form');
            console.log(breakfastTimes);
            if (breakfastTimes >= 1) {
                div.style.height = (parseInt(getComputedStyle(div).height) - 90) + "px"};
    });


    document.querySelector("#breakfastdontknow").addEventListener("click", () => {
        getCal(document.querySelector('#breakfast-name0').value, document.querySelector('#breakfast-calories0'), document.querySelector('#breakfast-servings0').value);
    });


////////////////////////////   LUNCH   ////////////////////////////////////
    const lunch_add = document.querySelector('#lunchaddmore');      // button
    lunch_add.addEventListener("click", () => {
        if (lunchTimes < 4) {
            addDiv("lunch", "#lunch", lunchTimes);
            div = document.querySelector('#lunch-form');
            div.style.height = (parseInt(getComputedStyle(div).height) + 90) + "px";
        }
    });


    const lunch_remove = document.querySelector('#lunchremove');
    lunch_remove.addEventListener("click", () => {
        removeDiv('.lunch-div', "lunch", lunchTimes);
        div = document.querySelector('#lunch-form');
        if (lunchTimes >= 1) {
            div.style.height = (parseInt(getComputedStyle(div).height) - 90) + "px"};
    });


    document.querySelector("#lunchdontknow").addEventListener("click", () => {
        getCal(document.querySelector('#lunch-name0').value, document.querySelector('#lunch-calories0'), document.querySelector('#lunch-servings0').value);
    });


///////////////////////////   DINNER   ///////////////////////////////////////////////////

    const dinner_add = document.querySelector('#dinneraddmore');      // button
    dinner_add.addEventListener("click", () => {
        if (dinnerTimes < 4) {
            addDiv("dinner", "#dinner", dinnerTimes);
            div = document.querySelector('#dinner-form');
            div.style.height = (parseInt(getComputedStyle(div).height) + 90) + "px";
        }
    });


    const dinner_remove = document.querySelector('#dinnerremove');
    dinner_remove.addEventListener("click", () => {
        removeDiv('.dinner-div', "dinner", dinnerTimes);
        div = document.querySelector('#dinner-form');
        if (dinnerTimes >= 1) {
            div.style.height = (parseInt(getComputedStyle(div).height) - 90) + "px"};
    });


    document.querySelector("#dinnerdontknow").addEventListener("click", () => {
        getCal(document.querySelector('#dinner-name0').value, document.querySelector('#dinner-calories0'), document.querySelector('#dinner-servings0').value);
    });

    //////////////////////////////   SNACKS   /////////////////////////////////////
    const snacks_add = document.querySelector('#snacksaddmore');      // button
    snacks_add.addEventListener("click", () => {
        if (snackTimes < 4) {
            addDiv("snacks", "#snacks", snackTimes);
            div = document.querySelector('#snacks-form');
            div.style.height = (parseInt(getComputedStyle(div).height) + 90) + "px";
        }
    });


    const snacks_remove = document.querySelector('#snacksremove');
    snacks_remove.addEventListener("click", () => {
        removeDiv('.snacks-div', "snacks", snackTimes);
        div = document.querySelector('#snacks-form');
        if (snackTimes >= 1) {
            div.style.height = (parseInt(getComputedStyle(div).height) - 90) + "px"};
    });


    document.querySelector("#snacksdontknow").addEventListener("click", () => {
        getCal(document.querySelector('#snacks-name0').value, document.querySelector('#snacks-calories0'), document.querySelector('#snacks-servings0').value);
    });
});