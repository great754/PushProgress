document.addEventListener("DOMContentLoaded", () => {
    let text = document.querySelector('#workoutDays').textContent;
    text = text.slice(0, text.length - 2) + '.';
    document.querySelector('#workoutDays').textContent = text;
    let p_days = document.querySelectorAll('.days');
    let p_weights = document.querySelectorAll('.weights');
    const days = [];
    const weights = [];
    for (let i = 0; i < p_days.length; i++){
        days.push(p_days[i].textContent.split(' ')[0]);
    }
    
    for (let i = 0; i < p_weights.length; i++){
        weights.push(Number(p_weights[i].textContent));
    }
    
    const xValues = days;
    const yValues = weights;
    
    new Chart("myChart", {
        type: "line",
        data: {
            labels: xValues,  // Make sure these are Date objects
            datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: "rgba(0,0,255,1.0)",
                borderColor: "rgba(0,0,255,0.1)",
                data: yValues
            }]
        },
        options: {
            legend: { display: false },
            scales: {
                x: {
                    ticks: {
                        callback: function(value, index, values) {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`; // Show MM/DD format
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Days",
                    },
                },
                y: {
                    ticks: { min: weights[0] - 50, max: weights[0] + 50 },
                    scaleLabel: {
                        display: true,
                        labelString: "Weight (lbs)",
                    },
                }
            }
        }
    });
    
    
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const popupOverlay = document.getElementById('popupOverlay');
    const openPopupButton = document.getElementById('update-stats');
    const closePopupButton = document.getElementById('closePopup');
    const cancelPopupButton = document.getElementById('cancelPopup');
    const saveStats = document.getElementById('save-stats');
    const height = Number(document.querySelector('#height').textContent);
    let height_ft = document.getElementById('new_height_ft');
    let height_in = document.getElementById('new_height_in');
    height_ft.value = Math.floor(height/12);
    height_in.value = Math.floor(height % 12);
    
    // opening the stats popup
    openPopupButton.addEventListener('click', () => {
        popupOverlay.style.display = 'flex';
    });
    
    // closing the stats popup
    closePopupButton.addEventListener('click', () => {
        popupOverlay.style.display = 'none';
    });
    
    // canceling, same as closing
    cancelPopupButton.addEventListener('click', () => {
        popupOverlay.style.display = 'none';
    });
    
    saveStats.addEventListener('click', () => {
        
        const weight = document.getElementById('new_weight').value;
        const weight_goal = document.getElementById('new_weight_goal').value;
        const new_height = (Number(height_ft.value) * 12) + (Number(height_in.value));
        const goals = document.querySelectorAll('input[name="goal"]:checked');
        const days = document.querySelectorAll('input[name="day"]:checked');
        
        const goalValues = [];
        goals.forEach(checkbox => {
            goalValues.push(checkbox.value);
        });
        
        const dayValues = [];
        days.forEach(checkbox => {
            dayValues.push(checkbox.value);
        });
        
        fetch('/update_stats/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken' : csrfToken
            },
            body: JSON.stringify({
                weight: weight,
                weight_goal : weight_goal,
                new_height : new_height,
                goals: goalValues,
                days: dayValues
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Success:", data);
        })
        .catch((error) => {
            console.log('Error:', error);
        });
        location.reload();
    })
})