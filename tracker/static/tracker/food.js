document.addEventListener("DOMContentLoaded", () => {

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


    let totalcals = 0;
    function getCal(food_id, button_id, box_id, serving_id) {
        let button = document.querySelector(button_id);
        let box = document.querySelector(box_id);
        button.onclick = () => {
            let food = document.querySelector(food_id).value;
            let servings = document.querySelector(serving_id).value;
            $.ajax({
            method: 'GET',
            url: 'https://api.calorieninjas.com/v1/nutrition?query=' + food,
            headers: { 'X-Api-Key': '0A4UID/vDwQwBEgxYj5rsw==et2WzgYuUeN89gMV'},
            contentType: 'application/json',
            success: function(result) {
                console.log(result);
                items = result.items;
                let calories = 0;
                let protein = 0;
                if (items.length > 1) {
                    for (let i = 0; i < items.length; i++){
                        calories += items[i].calories * servings;
                        protein += items[i].protein_g * servings;
                        console.log(calories)
                    }
                } else if (items.length === 1) {
                    console.log(items[0]);
                    calories = items[0].calories * servings;
                    protein = items[0].protein_g;
                }

                else {
                    calories = 0;
                }
                box.value = Math.round(calories);
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
        }
    }
    
    getCal('input[name="breakfast"]', "#breakfastdontknow", 'input[name="breakfast_calories"]', 'input[name="breakfast_servings"]');
    getCal('input[name="lunch"]', "#lunchdontknow", 'input[name="lunch_calories"]', 'input[name="lunch_servings"]');
    getCal('input[name="dinner"]', "#dinnerdontknow", 'input[name="dinner_calories"]', 'input[name="dinner_servings"]');
    getCal('input[name="snacks"]', "#snacksdontknow", 'input[name="snacks_calories"]', 'input[name="snacks_servings"]');

    
    
    document.querySelector('#lunch_div').style.display = 'none';
    document.querySelector('#dinner_div').style.display = 'none';
    document.querySelector('#snacks_div').style.display = 'none';
    
    document.querySelector('#decoy1').onclick = () => {
        let calories = document.querySelector('input[name="breakfast_calories"]').value;
        totalcals = totalcals + Number(calories);
        //getCal(document.querySelector('input[name="breakfast"]').value);
        document.querySelector('#breakfast_div').style.display = 'none';
        document.querySelector('#lunch_div').style.display = 'block';
    }
    document.querySelector('#decoy2').onclick = () => {
        let calories = document.querySelector('input[name="lunch_calories"]').value;
        totalcals = totalcals + Number(calories);
        document.querySelector('#lunch_div').style.display = 'none';
        document.querySelector('#dinner_div').style.display = 'block';
    }
    document.querySelector('#decoy3').onclick = () => {
        let calories = document.querySelector('input[name="dinner_calories"]').value;
        totalcals = totalcals + Number(calories);
        document.querySelector('#dinner_div').style.display = 'none';
        document.querySelector('#snacks_div').style.display = 'block';
    }
    
    document.querySelector('#submit_button').onclick = () => {
        let calories = document.querySelector('input[name="snacks_calories"]').value;
        totalcals = totalcals + Number(calories);
        fetch('/getfood/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken' : csrfToken
            },
            body: JSON.stringify({
                totalcals: totalcals
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        document.querySelector('form').onsubmit = function() {
            return true;
        }
        document.querySelector('form').submit();
    }
});