document.addEventListener("DOMContentLoaded", () => {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const apiKey = "{{ api_key }}";

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


    let button = document.querySelector('#dontknow');
    let box = document.querySelector('#calories');
    let proteinbox = document.querySelector('#protein');

    let totalcals = 0;
    let totalprotein = 0;
    function getCal() {
        button.onclick = () => {
            let food = document.querySelector('#food').value;
            let servings = document.querySelector('#servings').value;
            $.ajax({
            method: 'GET',
            url: 'https://api.calorieninjas.com/v1/nutrition?query=' + food,
            headers: { 'X-Api-Key': '0A4UID/vDwQwBEgxYj5rsw==et2WzgYuUeN89gMV'},
            contentType: 'application/json',
            success: function(result) {
                let calories = 0;
                let protein = 0;
                items = result.items;
                if (items.length >= 1) {
                    calories = items[0].calories * servings;
                    protein = items[0].protein_g * servings;
                }
                box.value = Math.round(calories);
                proteinbox.value = Math.round(protein);
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
        }
    }

    getCal();

    const form = document.getElementById("form");

    form.addEventListener('submit', function(event) {
        let time = document.querySelector('#time').value;
        let totalfood = document.querySelector('#food').value;
        totalcals = Number(box.value);
        totalprotein = Number(proteinbox.value);
        document.querySelector('#hidden-food').value = totalfood;
        document.querySelector('#hidden-calories').value = totalcals;
        document.querySelector('#hidden-protein').value = totalprotein;
        document.querySelector('#hidden-time').value = time;
        console.log('submitted');
        console.log(totalfood);
        event.preventDefault();
        const form2 = document.querySelector('#hidden-form');
        form2.submit();
        //form.submit();
    })
})