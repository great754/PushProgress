document.addEventListener("DOMContentLoaded", () => {
    const activity = document.querySelector('#activity_title');
    const box = document.querySelector('#activity_name');
    let calories = document.querySelector('#calories');
    activity.addEventListener('change', () => {
        if (activity.value === 'other') {
            box.style.display = 'block';
        } else {
            box.style.display = 'none';
        }
    });

    function getCal(query) {
        const box = document.querySelector('#activity_name');
        const duration = document.querySelector('#duration');
        const data = null;
        
        if (box.value === ''){
            query = 'Workout';
        }
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
    
        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === this.DONE) {
                let response = JSON.parse(this.responseText);
                if (response.length >= 1){
                    cph = response[0].calories_per_hour;
                    calories.value = Math.round((cph*duration.value)/60);
                }
            }
        });
    
        xhr.open('GET', 'https://calories-burned-by-api-ninjas.p.rapidapi.com/v1/caloriesburned?activity=' + query);
        xhr.setRequestHeader('x-rapidapi-key', 'ae718bd735mshaaf72048bd44c34p19e18djsn6883c76f7b39');
        xhr.setRequestHeader('x-rapidapi-host', 'calories-burned-by-api-ninjas.p.rapidapi.com');
    
        xhr.send(data);
    }

    dontknow = document.querySelector('#dontknow');
    dontknow.addEventListener("click", function() {
        getCal(box.value);
    })

    const form = document.querySelector('#form');
    form.addEventListener('submit', function() {
        if (box.value === '') {
            box.value = 'Workout';
        }
    })
});
