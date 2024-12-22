document.addEventListener("DOMContentLoaded", () => {
    let p_days = document.querySelectorAll('.days');
    let p_cals = document.querySelectorAll('.cals');
    let p_eaten = document.querySelectorAll('.eaten');
    const days = [];
    const cals = [];
    const eaten = [];

    for (let i = 0; i < p_days.length; i++){
        days.push(p_days[i].textContent);
    }
    
    for (let i = 0; i < p_cals.length; i++){
        cals.push(p_cals[i].textContent);
    }

    for (let i = 0; i < p_eaten.length; i++){
        eaten.push(p_eaten[i].textContent);
    }
    
    new Chart("myChart", {
        type: "line",
        data: {
            labels: days,
            datasets: [{
                fill: false,
                borderColor: "blue",
                data: cals,
                label: "Calories Burned",
            }, {
                data: eaten,
                borderColor: "red",
                label: "Calories Eaten",
            }]
        },
        options: {
            legend: {
                display: true,
                position: "top",
            },
            scales: {
                yAxes: [{
                    ticks: {min: 0, max: 5000},
                    scaleLabel: {
                        display: true,
                        labelString: "Calories (kCal)"
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Day"
                    }
                }]
            }
        }
    });
});
