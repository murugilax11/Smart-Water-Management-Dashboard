// ===== INITIAL DATA =====
const waterData = {
    totalUsage: 300,
    greyWater: 150,
    kitchen: 80,
    bathroom: 150,
    garden: 70
};

// ===== CALCULATE EFFICIENCY =====
function calculateEfficiency() {
    return ((waterData.greyWater / waterData.totalUsage) * 100).toFixed(1);
}

// ===== UPDATE UI =====
function updateUI() {

    const efficiency = calculateEfficiency();

    document.getElementById("totalUsage").innerText = waterData.totalUsage + " L";
    document.getElementById("greyWater").innerText = waterData.greyWater + " L";
    document.getElementById("efficiency").innerText = efficiency + "%";

    const statusElement = document.getElementById("status");

    if (efficiency > 60) {
        statusElement.innerText = "Excellent";
        statusElement.style.color = "green";
    } 
    else if (efficiency > 40) {
        statusElement.innerText = "Good";
        statusElement.style.color = "orange";
    } 
    else {
        statusElement.innerText = "Needs Improvement";
        statusElement.style.color = "red";
    }
}


// ===== CREATE CHART =====
const ctx = document.getElementById("waterChart").getContext("2d");

const waterChart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: ["Kitchen", "Bathroom", "Garden"],
        datasets: [{
            label: "Water Usage (Liters)",
            data: [
                waterData.kitchen,
                waterData.bathroom,
                waterData.garden
            ],
            backgroundColor: [
                "#0ea5e9",
                "#0284c7",
                "#0369a1"
            ],
            borderRadius: 8
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});


// ===== SIMULATE SENSOR DATA =====
function updateWaterData() {

    waterData.kitchen = Math.floor(Math.random() * 120);
    waterData.bathroom = Math.floor(Math.random() * 180);
    waterData.garden = Math.floor(Math.random() * 100);

    waterData.totalUsage =
        waterData.kitchen +
        waterData.bathroom +
        waterData.garden;

    waterData.greyWater = Math.floor(waterData.totalUsage * 0.5);

    // update UI
    updateUI();

    // update chart values
    waterChart.data.datasets[0].data = [
        waterData.kitchen,
        waterData.bathroom,
        waterData.garden
    ];

    waterChart.update();
}


// ===== INITIAL LOAD =====
updateUI();


// ===== AUTO UPDATE EVERY 5s =====
setInterval(updateWaterData, 5000);


// ===== THEME TOGGLE =====
const themeBtn = document.getElementById("themeToggle");

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});