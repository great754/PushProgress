document.addEventListener("DOMContentLoaded", () => {
    let p_days = document.querySelectorAll('.days');
    let p_cals = document.querySelectorAll('.cals');
    let p_eaten = document.querySelectorAll('.eaten');
    const days = [];
    const cals = [];
    const eaten = [];

    const bigDivs = document.querySelectorAll('.hasProgress');
    bigDivs.forEach((div) => {
        info = div.querySelector('.info');
        bar = div.querySelector('.progress');
        prog = div.querySelector('.progress-bar');
        const num = Number(info.textContent.split('/')[0]);
        const den = Number(info.textContent.split('/')[1].split(' ')[0]);
        const frac = (num/den) * 100;
        if (frac >= 100) {
            bar.style.width = `${frac}%`
            bar.style.background = "green";
        } else {
            bar.style.width = `${frac}%`
        }
        prog.querySelector('.perc').textContent = `${Math.round(frac)}%`;
    })

    stats = document.querySelectorAll('.stat');
    stats.forEach((stat) => {
        stat.addEventListener("click", () => {
            window.location.href = stat.querySelector('.box-url').textContent;
        })
    })
       


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
