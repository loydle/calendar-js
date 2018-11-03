function calendar() {

    // default value;
    this.today = new Date().getDate();
    this.year = getYear();
    this.month = getMonth();
    this.days = getDays(getDaysOfMonth(this.month));


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

renderToday(document.getElementById('calendar'));
renderDays(document.getElementById('calendar'), new calendar());

function renderDays(calendarHTMLElm, calendarObj) {
    for (let i = 1; i <= calendarObj.days.length; i++) {
        let div = document.createElement('div');
        div.innerText = i;
        div.classList.add('day')
        calendarHTMLElm.querySelector('section.days').appendChild(div);
    }
}

function renderToday(calendarHTMLElm) {
    // var daysNode = querySelectorAll('')
}