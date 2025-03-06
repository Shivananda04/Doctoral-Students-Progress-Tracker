document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.getElementById("menu-btn");
    const closeBtn = document.getElementById("close-btn");
    const sidebar = document.getElementById("sidebar");

    menuBtn.addEventListener("click", function () {
        sidebar.style.width = "250px";
    });

    closeBtn.addEventListener("click", function () {
        sidebar.style.width = "0";
    });

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const monthName = document.querySelector(".month-name");
    const daysContainer = document.querySelector(".days");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    let date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();

    function renderCalendar(month, year) {
        daysContainer.innerHTML = "";

        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        monthName.innerText = `${monthNames[month]} ${year}`;

        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement("div");
            emptyDiv.classList.add("day", "empty");
            daysContainer.appendChild(emptyDiv);
        }

        for (let i = 1; i <= totalDays; i++) {
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("day");
            dayDiv.innerText = i;

            if (
                i === date.getDate() &&
                month === date.getMonth() &&
                year === date.getFullYear()
            ) {
                dayDiv.classList.add("today");
            }

            daysContainer.appendChild(dayDiv);
        }
    }

    prevBtn.addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    nextBtn.addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    renderCalendar(currentMonth, currentYear);
});
