document.addEventListener("DOMContentLoaded", () => {
    const first = document.querySelector('.week-log');
    const logs = first.querySelectorAll('.entry');
    if (logs.length < 1) {
        let empty = first.querySelector('.empty');
        empty.textContent = "";
        const food = document.createElement("button");
        const activity = document.createElement("button");
        empty.appendChild(food);
        empty.appendChild(activity);
        activity.textContent = "Log Activity";
        food.textContent = "Log Food";
        activity.classList.add("log");
        food.classList.add("log");
        food.addEventListener("click", () => {
            window.location.href = "/logfood";
        })
        activity.addEventListener("click", () => {
            window.location.href = "/activity";
        })
    }
    
    const entries = document.querySelectorAll(".entry");
    entries.forEach((entry) => {
        entry.addEventListener("click", () => {
            if (entry.classList.contains("activity-entry")) {
                const popupOverlay = document.querySelector('.activity-popup');
                popupOverlay.style.display = 'flex';
                const closePopupButton = document.querySelector('#activity-closePopup');
                const cancelPopupButton = document.getElementById('activity-cancelPopup');
                const deleteButton = document.querySelector('#activity-delete-entry');
                const saveButton = document.querySelector('#activity-save-entry');
                
                document.querySelector('#new-activity').value = entry.querySelector('.entry-name').textContent;
                document.querySelector('#new-activity-calories').value = entry.querySelector('.entry-calories').textContent.split(' ')[0];
                document.querySelector('#new-activity-date').value = entry.querySelector('.entry-date').textContent;
                document.querySelector('#new-activity-time').value = entry.querySelector('.entry-time').textContent;
                closePopupButton.addEventListener('click', () => {
                    popupOverlay.style.display = 'none';
                })
                cancelPopupButton.addEventListener("click", () => {
                    popupOverlay.style.display = 'none';
                })

                saveButton.addEventListener("click", () => {
                    const newName = document.querySelector('#new-activity').value;
                    const newDate = document.querySelector('#new-activity-date').value;
                    const newTime = document.querySelector('#new-activity-time').value;
                    const newCalories = document.querySelector('#new-activity-calories').value;
                    const id = Number(entry.querySelector('.entry-id').textContent);
                    const csrfToken = document.querySelector('#hiddencsrf').textContent;
                    fetch(`/editactivity/${id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken' : csrfToken
                        },
                        body: JSON.stringify({
                            newName: newName,
                            newDate : newDate,
                            newTime : newTime,
                            newCalories: newCalories
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Success:", data);
                    })
                    .catch((error) => {
                        console.log('Error:', error);
                    });
                    window.location.reload();
                })

                deleteButton.addEventListener("click", () => {
                    const id = Number(entry.querySelector('.entry-id').textContent);
                    const csrfToken = document.querySelector('#hiddencsrf').textContent;
                    console.log(id);
                    console.log(csrfToken);
                    fetch(`/deleteactivity/${id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken' : csrfToken
                        },
                        body: JSON.stringify({
                            x: "x"
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Success:", data);
                    })
                    .catch((error) => {
                        console.log('Error:', error);
                    });
                    window.location.reload()
                })

            } else {
                const popupOverlay = document.querySelector('.food-popup');
                popupOverlay.style.display = 'flex';
                const closePopupButton = document.querySelector('#food-closePopup');
                const cancelPopupButton = document.getElementById('food-cancelPopup');
                const deleteButton = document.querySelector('#food-delete-entry');
                const saveButton = document.querySelector('#food-save-entry');

                document.querySelector('#new-food').value = entry.querySelector('.entry-name').textContent;
                document.querySelector('#new-food-calories').value = entry.querySelector('.entry-calories').textContent.split(' ')[0];
                document.querySelector('#new-food-date').value = entry.querySelector('.entry-date').textContent;
                document.querySelector('#new-food-time').value = entry.querySelector('.entry-time').textContent;
                document.querySelector('#new-food-protein').value = entry.querySelector('.entry-protein').textContent;
                closePopupButton.addEventListener('click', () => {
                    popupOverlay.style.display = 'none';
                })
                cancelPopupButton.addEventListener("click", () => {
                    popupOverlay.style.display = 'none';
                })

                saveButton.addEventListener("click", () => {
                    const newName = document.querySelector('#new-food').value;
                    const newDate = document.querySelector('#new-food-date').value;
                    const newTime = document.querySelector('#new-food-time').value;
                    const newCalories = document.querySelector('#new-food-calories').value;
                    const newProtein = document.querySelector('#new-food-protein').value;
                    const id = Number(entry.querySelector('.entry-id').textContent);
                    const csrfToken = document.querySelector('#hiddencsrf').textContent;
                    fetch(`/editfood/${id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken' : csrfToken
                        },
                        body: JSON.stringify({
                            newName: newName,
                            newDate : newDate,
                            newTime : newTime,
                            newCalories: newCalories,
                            newProtein: newProtein
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Success:", data);
                    })
                    .catch((error) => {
                        console.log('Error:', error);
                    });
                    window.location.reload();
                })

                deleteButton.addEventListener("click", () => {
                    const id = Number(entry.querySelector('.entry-id').textContent);
                    const csrfToken = document.querySelector('#hiddencsrf').textContent;
                    console.log(id);
                    console.log(csrfToken);
                    fetch(`/deletefood/${id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken' : csrfToken
                        },
                        body: JSON.stringify({
                            x: "x"
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Success:", data);
                    })
                    .catch((error) => {
                        console.log('Error:', error);
                    });
                    window.location.reload()
                })
            }
        })
    })
})