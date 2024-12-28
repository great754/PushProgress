document.addEventListener("DOMContentLoaded", () => {
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

        const goalValues = [];
        goals.forEach(checkbox => {
            goalValues.push(checkbox.value);
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
                goals: goalValues
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