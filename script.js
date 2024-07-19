let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();

const day = document.querySelector(".calendar-dates");
const currdate = document.querySelector(".calendar-current-date");
const selectedDateDisplay = document.querySelector(".selected-date");
const prenexIcons = document.querySelectorAll(".calendar-navigation span");

const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

let selectedDate = null;

const manipulate = () => {
    let dayone = new Date(year, month, 1).getDay();
    let lastdate = new Date(year, month + 1, 0).getDate();
    let dayend = new Date(year, month, lastdate).getDay();
    let monthlastdate = new Date(year, month, 0).getDate();
    let lit = "";

    for (let i = dayone; i > 0; i--) {
        lit += `<li class="inactive">${monthlastdate - i + 1}</li>`;
    }

    for (let i = 1; i <= lastdate; i++) {
        let isToday = i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear() ? "today" : "";
        let isPast = new Date(year, month, i).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) ? "inactive" : "";
        lit += `<li class="${isToday} ${isPast}" data-date="${i}">${i}</li>`;
    }

    for (let i = dayend; i < 6; i++) {
        let nextMonthDate = new Date(year, month + 1, i - dayend + 1);
        let isFuture = nextMonthDate > new Date() ? "" : "inactive";
        lit += `<li class="${isFuture}" data-next-month-date="${i - dayend + 1}">${i - dayend + 1}</li>`;
    }

    currdate.innerText = `${months[month]} ${year}`;
    day.innerHTML = lit;

    document.querySelectorAll('.calendar-dates li:not(.inactive)').forEach(dateElem => {
        dateElem.addEventListener('click', function () {
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                selectedDate = null;
                bubble_fn_date(""); // Send empty string when deselected
                selectedDateDisplay.innerText = "Selected Date: None";
            } else {
                document.querySelectorAll('.calendar-dates li').forEach(li => li.classList.remove('active'));
                this.classList.add('active');
                if (this.hasAttribute('data-next-month-date')) {
                    selectedDate = new Date(year, month + 1, this.getAttribute('data-next-month-date'));
                } else {
                    selectedDate = new Date(year, month, this.getAttribute('data-date'));
                }

                
                const timezone = document.getElementById('timezone-input').value;

                const dateTimeString = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}T00:00:00`;
                const localDateTime = moment.tz(dateTimeString, timezone);
                const isoDateTime = localDateTime.format();

                document.getElementById('date-input').value = localDateTime.format('YYYY-MM-DD');
                document.getElementById('result').textContent = `Selected ISO 8601: ${isoDateTime}`;

                const time = document.getElementById('time-input').value;

                if (time) {
                    const [hours, minutes] = time.split(':');
                    const dateTimeString = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}T${hours}:${minutes}:00`;
                    const localDateTime = moment.tz(dateTimeString, timezone);
                    const isoDateTime = localDateTime.format();

                    document.getElementById('date-input').value = localDateTime.format('YYYY-MM-DD');
                    document.getElementById('result').textContent = `Selected ISO 8601: ${isoDateTime}`;
                } 


                // const localDate = moment.tz(selectedDate.toISOString().split('T')[0], timezone);
                // document.getElementById('date-input').value = localDate.format('YYYY-MM-DD');
                // bubble_fn_date(localDate); // Send ISO 8601 formatted date
                //selectedDateDisplay.innerText = `Selected Date: ${isoDateTime.format('dddd, MMMM Do YYYY')}`;
            }
            document.getElementById('calendar-container').style.display = 'none'; // Hide calendar after selection
        });
    });

    // Disable prev button if previous month is in the past
    if (new Date(year, month, 1) <= new Date(new Date().getFullYear(), new Date().getMonth(), 1)) {
        document.getElementById("calendar-prev").classList.add("disabled");
    } else {
        document.getElementById("calendar-prev").classList.remove("disabled");
    }
}

manipulate();

prenexIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        if (icon.classList.contains("disabled")) return;

        month = icon.id === "calendar-prev" ? month - 1 : month + 1;

        if (month < 0 || month > 11) {
            date = new Date(year, month, new Date().getDate());
            year = date.getFullYear();
            month = date.getMonth();
        } else {
            date = new Date();
        }

        manipulate();
    });
});

document.getElementById('date-input').addEventListener('click', () => {
    document.getElementById('calendar-container').style.display = 'flex';
});

document.addEventListener('click', function (e) {
    const calendar = document.getElementById('calendar-container');
    const dateInput = document.getElementById('date-input');
    if (!calendar.contains(e.target) && e.target !== dateInput) {
        calendar.style.display = 'none';
    }
});

document.getElementById('time-input').addEventListener('click', function () {
    const dropdown = document.getElementById('time-input-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('time-input-dropdown').addEventListener('click', function (e) {
    if (e.target.tagName === 'DIV') {
        document.getElementById('time-input').value = e.target.textContent;
        this.style.display = 'none';
        updateDateTime();
    }
});

document.addEventListener('click', function (e) {
    const dropdown = document.getElementById('time-input-dropdown');
    if (!dropdown.contains(e.target) && e.target.id !== 'time-input') {
        dropdown.style.display = 'none';
    }
});

function updateDateTime() {
    const time = document.getElementById('time-input').value;
    const timezone = document.getElementById('timezone-input').value;

    if (selectedDate && time) {
        const [hours, minutes] = time.split(':');
        const dateTimeString = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}T${hours}:${minutes}:00`;
        const localDateTime = moment.tz(dateTimeString, timezone);
        const isoDateTime = localDateTime.format();

        document.getElementById('date-input').value = localDateTime.format('YYYY-MM-DD');
        document.getElementById('result').textContent = `Selected ISO 8601: ${isoDateTime}`;
    } else {
        document.getElementById('result').textContent = '';
    }
}

function bubble_fn_date(localDate) {
    if (localDate) {
        console.log("Selected date:", localDate.format());
        updateDateTime();
    } else {
        console.log("Deselected date");
        document.getElementById('result').textContent = '';
    }
}

// Populate time dropdown
const timeDropdown = document.getElementById('time-input-dropdown');
for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const minute = m.toString().padStart(2, '0');
        const timeDiv = document.createElement('div');
        timeDiv.textContent = `${hour}:${minute}`;
        timeDropdown.appendChild(timeDiv);
    }
}
