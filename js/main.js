var Calendar =
    new Calendar(new Day(new Date()));

renderCalendar(
    document.getElementById('calendar'),
    Calendar
);


function renderCalendar(calendarNode, CalendarObj) {

    renderDays(calendarNode, CalendarObj);
    renderTodayActiveDay(calendarNode, CalendarObj);
    renderTodayMonth(calendarNode, CalendarObj);

    function renderDays(calendarHTMLElm, Calendar) {
        for (let i = 1; i <= Calendar.days.length; i++) {
            let div = document.createElement('div');
            div.dataset.day = i;
            div.innerText = div.dataset.day;
            div.classList.add('day');
            calendarHTMLElm.querySelector('section.days').appendChild(div);
        }
    }

    function renderTodayActiveDay(calendarHTMLElm, Calendar) {
        var daysNode = calendarHTMLElm.querySelectorAll('div.day');
        for (var i = 0; i < daysNode.length; i++) {
            if (daysNode[i].dataset.day == Calendar.today) {
                daysNode[i].classList.add('today');
            } else {
                daysNode[i].classList.remove('today');
            }
        }

    }

    function renderTodayMonth(calendarHTMLElm, Calendar) {
        var monthNode = calendarHTMLElm.querySelector('.month').innerHTML = Calendar.year + '<br>' + Calendar.month;
    }
}

function Day(dayAsDateObj) {
    this.date = dayAsDateObj;
    this.tasks = getTasks(dayAsDateObj);

    function getTasks(dayAsDateObj) {
        return [new Task("11:00", "Meeting")]
    }
    console.log(this);
}

function Task(time, name) {
    this.time = time || "00:00";
    this.name = name || " ";
    console.log(this);
    return this;
}


function Calendar(Day) {
    // default value;
    var date = Day.date;
    this.date = date;
    this.today = date.getDate();
    this.year = getYear();
    this.month = getMonth();
    this.days = getDays(getDaysOfMonth(this.month));
    this.dayOfWeek = getDayOfWeek(date);
    console.log(this);
    return this;
}

function getDaysOfMonth(month) {
    var month = month || [];
    if (month === 'February') {
        return function getDaysOfFebruary() {
            //
        }
    } else if (
        ['January', 'March', 'May', 'July', 'August', 'October', 'December']
        .filter(m => m === month)[0]
    ) {
        return 31;
    } else {
        return 30;
    }
};

function getDays(numDays) {
    var days = [];
    for (let i = 1; i <= numDays; i++) {
        days.push(i);
    };
    return days;
};

function getDayOfWeek(dateObj) {
    var daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    return daysOfWeek[dateObj.getDay()];
}

function getYear() {
    var today = new Date();
    return today.getFullYear();
}

function getMonth() {
    var today = new Date();
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return months[today.getMonth()];
}