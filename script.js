// ===== LOAD DATA FROM LOCAL STORAGE =====
let waterData = JSON.parse(localStorage.getItem("waterData"));

if (!waterData) {
    waterData = {
        totalUsage: 300,
        greyWater: 150,
        kitchen: 80,
        bathroom: 150,
        garden: 70
    };
}

function toggleSidebar() {

const sidebar = document.querySelector(".sidebar");
const overlay = document.getElementById("overlay");

sidebar.classList.toggle("active");
overlay.classList.toggle("active");

}

function closeSidebar(){

const sidebar = document.querySelector(".sidebar");
const overlay = document.getElementById("overlay");

sidebar.classList.remove("active");
overlay.classList.remove("active");

}
// ===== STORE LAST 5 MIN DATA =====
let usageHistory = [];

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

// ===== CREATE BAR CHART =====
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
        maintainAspectRatio: false,
        animation: {
            duration: 2000,
            easing: "easeOutBounce"
        }
    }
});


// ===== WEEKLY TREND CHART =====
const trendData = [220, 260, 240, 300, 280, 320, 290];

const trendCtx = document.getElementById("trendChart").getContext("2d");

const trendChart = new Chart(trendCtx, {
    type: "line",
    data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
            label: "Daily Usage (Liters)",
            data: trendData,
            borderColor: "#0284c7",
            backgroundColor: "rgba(2,132,199,0.2)",
            tension: 0.4,
            fill: true
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

    // store history
    usageHistory.push({
        time: new Date().toLocaleTimeString(),
        kitchen: waterData.kitchen,
        bathroom: waterData.bathroom,
        garden: waterData.garden,
        total: waterData.totalUsage
    });

    // keep last 60 entries (~5 mins)
    if (usageHistory.length > 60) {
        usageHistory.shift();
    }

    // save to localStorage
    localStorage.setItem("waterData", JSON.stringify(waterData));

    // update UI
    updateUI();

    // update chart
    waterChart.data.datasets[0].data = [
        waterData.kitchen,
        waterData.bathroom,
        waterData.garden
    ];

    waterChart.update();
}


// ===== INITIAL LOAD =====
updateUI();


// ===== AUTO UPDATE EVERY 5 SEC =====
setInterval(updateWaterData, 5000);


// ===== DARK MODE TOGGLE =====
const themeBtn = document.getElementById("themeToggle");

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
    });
}


// ===== EXCEL DOWNLOAD =====
const excelBtn = document.getElementById("downloadExcel");

if (excelBtn) {
    excelBtn.addEventListener("click", () => {

        const worksheet = XLSX.utils.json_to_sheet(usageHistory);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Water Data");

        XLSX.writeFile(workbook, "Water_Data.xlsx");
    });
}


// ===== GRAPH DOWNLOAD =====
const graphBtn = document.getElementById("downloadGraph");

if (graphBtn) {

    graphBtn.addEventListener("click", () => {

        const link = document.createElement("a");
        link.href = waterChart.toBase64Image();
        link.download = "water_usage_chart.png";
        link.click();

    });

}