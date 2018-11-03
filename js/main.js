function calendar() {

    // default value;
    var date = new Date();
    this.today = date.getDate();
    this.year = getYear();
    this.month = getMonth();
    this.days = getDays(getDaysOfMonth(this.month));
    this.dayOfWeek = getDayOfWeek(date);

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

console.log(new calendar());
var calendar = new calendar();
renderDays(document.getElementById('calendar'), calendar);
renderTodayActiveDay(document.getElementById('calendar'), calendar);
renderTodayMonth(document.getElementById('calendar'), calendar);

function renderDays(calendarHTMLElm, calendarObj) {
    for (let i = 1; i <= calendarObj.days.length; i++) {
        let div = document.createElement('div');
        div.dataset.day = i;
        div.innerText = div.dataset.day;
        div.classList.add('day');
        calendarHTMLElm.querySelector('section.days').appendChild(div);
    }
}

function renderTodayActiveDay(calendarHTMLElm, calendarObj) {
    var daysNode = calendarHTMLElm.querySelectorAll('div.day');
    for (var i = 0; i < daysNode.length; i++) {
        if (daysNode[i].dataset.day == calendarObj.today) {
            daysNode[i].classList.add('today');
        } else {
            daysNode[i].classList.remove('today');
        }
    }

}

function renderTodayMonth(calendarHTMLElm, calendarObj) {
    var monthNode = calendarHTMLElm.querySelector('.month').innerHTML = calendarObj.year + '<br>' + calendarObj.month;
}