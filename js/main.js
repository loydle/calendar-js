const CalendarInit = new Calendar(new Day(new Date()));
renderCalendar(
    document.getElementById('calendar'),
    CalendarInit
);

//----------------------------------------------------------
//----------------------------------------------------------

function renderCalendar(calendarNode, CalendarObj) {

    (function clearWeekViews() {
        var weeks = document.querySelectorAll('.week');
        for (var i = 0; i < weeks.length; i++) {
            weeks[i].innerHTML = ""
        }
    }())

    var next = calendarNode.querySelector('.next');
    var prev = calendarNode.querySelector('.prev');
    next.onclick = nextView;
    prev.onclick = prevView;

    function nextView(e) {
        var lastMonthDate = CalendarObj.date;
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() + 1);
        CalendarObj = new Calendar(new Day(lastMonthDate))
        renderCalendar(document.getElementById('calendar'), CalendarObj)

    }

    function prevView(e) {
        var lastMonthDate = CalendarObj.date;
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        CalendarObj = new Calendar(new Day(lastMonthDate))
        renderCalendar(document.getElementById('calendar'), CalendarObj);
    }
    renderDays(calendarNode, CalendarObj);
    renderTodayActiveDay(calendarNode, CalendarObj);
    renderTodayMonth(calendarNode, CalendarObj);
    renderDaysBehavior(calendarNode);



    function renderDays(calendarHTMLElm, CalendarObj) {
        for (let i = 1; i <= CalendarObj.days.length; i++) {
            var date = new Date(`${CalendarObj.month} ${i}, ${CalendarObj.year}`);
            var currentWeek = date.getDay();
            var template = document.querySelector('template').content;
            var dayView = template.querySelector('.day-view').cloneNode(true)
            var dayContainer = template.querySelector('.day').cloneNode(true)
            dayContainer.appendChild(dayView);
            dayContainer.dataset.day = date.getDate();
            dayContainer.dataset.date = date;
            dayView.innerHTML = date.getDate();
            calendarHTMLElm.querySelector('.days .current-month .week-' + currentWeek).appendChild(dayContainer);

            if (i == 1) {
                if (date.getDay() != 0) {
                    for (let i = 0; i < date.getDay(); i++) {
                        var dayView = template.querySelector('.day-view').cloneNode(true)
                        var dayContainer = template.querySelector('.day').cloneNode(true)

                        dayContainer.appendChild(dayView);
                        calendarHTMLElm.querySelector('.days .current-month .week-' + i).appendChild(dayContainer);
                    }
                }
            }
        }
        var row = calendarHTMLElm.querySelectorAll('.current-month .week')
        if (row.length) {
            for (let i = 0; i < row.length; i++) {
                // console.log(row[row.length - i])

                if (!row[i].querySelector('.day').dataset.date) {
                    // console.log(row[i])
                    var missingDay = daysInMonth(CalendarObj.date.getMonth(), CalendarObj.date.getFullYear(), 0) - i;
                    var newDate = new Date(CalendarObj.date.getFullYear(), CalendarObj.date.getMonth() - 1, missingDay);
                    var dayView = calendarHTMLElm.querySelector('.week-' + newDate.getDay() + ' .day .day-view');
                    var section = calendarHTMLElm.querySelector('.week-' + newDate.getDay() + ' .day')
                    section.classList.add('past');
                    dayView.innerHTML = newDate.getDate();
                }
            }
            var emptyCells = 0;


            // for (let i = 0; i < emptyDays.length; i++) {
            //         if (emptyDays[i] instanceof HTMLElement) {
            //             if (emptyDays[i].querySelector('.day-view') instanceof HTMLElement) {

            //                 if (emptyDays[i].querySelector('.day-view').innerHTML === "") {
            //                     emptyCells += 1;
            //                 }
            //             }
            //         }
            // }


            //     var year = CalendarObj.date.getFullYear();
            //     for (let i = 0; i < emptyCells; i++) {
            //         var date = new Date(`${getPastMonth(CalendarObj.date)} ${getDaysOfMonth(CalendarObj.date) - i}, ${year}`);
            //         try {
            //             var elm = calendarHTMLElm.querySelector('.week-' + date.getDay() + ' .day')
            //             elm.innerHTML = date.getDate()
            //             elm.classList.add('past')
            //             elm.dataset.day = date.getDate();
            //             elm.dataset.date = date;

            //         } catch (err) {
            //             console.error(err)
            //         }
            //     }
        }
    }

    function renderTodayActiveDay(calendarHTMLElm, Calendar) {
        if (Calendar.month === getMonth(new Date()) && Calendar.year === new Date().getFullYear()) {
            var daysNode = calendarHTMLElm.querySelectorAll('section.week .day');
            for (var i = 0; i < daysNode.length; i++) {
                if (daysNode[i].dataset.day == Calendar.today) {
                    daysNode[i].classList.add('today');

                } else {
                    daysNode[i].classList
                        .remove('today');
                }
            }
        }
    }

    function renderTodayMonth(calendarHTMLElm, Calendar) {
        var monthNode = calendarHTMLElm.querySelector('.month')
            .innerHTML = Calendar.year + '<br>' + Calendar.month;
    }
    console.log(CalendarObj);

}

function renderDaysBehavior(calendarNode) {
    var daysNodeList = calendarNode.querySelectorAll('.day');
    for (let i = 0; i < daysNodeList.length; i++) {
        daysNodeList[i].onclick = popupAction;
    }

    function popupAction(e) {
        var srcElement = e.srcElement;
        new Popup(srcElement);

    }
}

function Day(dayAsDateObj) {
    this.date = dayAsDateObj;
    this.tasks = getTasks(dayAsDateObj);

    function getTasks(dayAsDateObj) {
        return [new Task("11:00", "Meeting")]
    }
}

function Task(time, name) {
    this.time = time || "00:00";
    this.name = name || " ";
    return this;
}


function Calendar(Day) {
    this.date = Day.date;
    this.today = new Date().getDate();
    this.year = getYear(Day.date);
    this.month = getMonth(Day.date);
    this.year = Day.date.getFullYear();
    this.days = getDays(getDaysOfMonth(new Date(`${getMonth(Day.date)} 1, ${Day.date.getFullYear()}`)));
    // console.log(new Date(`${getMonth(Day.date)} 1, ${Day.date.getFullYear()}`).getDay())
    this.dayOfWeek = getDayOfWeek(Day.date);
    return this;
}

function getDaysOfMonth(date) {
    date.setMonth(date.getMonth())
        // console.log(new Date(`${getMonth(date)} 1,${date.getFullYear()}`))
        // console.log(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate())
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    // var d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // return d.getDate();
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

function getYear(dateObj) {
    return dateObj.getFullYear();
}

function getMonth(date) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    if (date) {
        return months[date.getMonth()];
    } else {
        var today = new Date();
        return months[today.getMonth()];
    }
}

function templateNode(classOrId, contentHTML, dataset) {
    if (document.querySelector('template').content) {
        var div = document.importNode(document.querySelector('template').content.querySelector(classOrId), true);
        if (contentHTML) {
            div.innerHTML = contentHTML;
        }
        if (dataset) {
            div.dataset.day = dataset;
        }
        return div;
    } else {
        var div = document.createElement('div');
        div.innerText = "error";
        return div;
    }
}

function renderDivOption(e) {
    let divDayOptions = new templateNode('.day-view-option');
    let divDayView = e.srcElement.querySelector('.day-view');
    if (divDayView instanceof HTMLElement) {

    }
    e.srcElement.appendChild(divDayOptions);
}

function removeDivOption(e) {
    let divDayView = e.srcElement.querySelector('.day-view');
    if (divDayView instanceof HTMLElement) {
        divDayView.style.display = "block";
    }

    var template = e.srcElement.querySelector('.day-view-option');
    if (template) {
        template.remove();
    }
}

function getPastMonth(refDate) {
    let monthNum = refDate.getMonth() - 1;
    if (monthNum < 0) {
        monthNum = 11;
    }
    let pastMonth = new Date().setMonth(monthNum);
    return getMonth(new Date(pastMonth));
}

function getNextMonth(refDate) {
    var monthNum = refDate.getMonth() + 1;
    if (monthNum > 11) {
        monthNum = 0;
    }
    var pastMonth = refDate.setMonth(monthNum);
    return getMonth(new Date(pastMonth));
}

function Popup(srcElement) {
    if (document.querySelector('.popup')) {
        var popupTemplate = document.querySelector('.popup');
        popupTemplate.style.display = "block";
        popupTemplate.style.opacity = "1";


    } else {
        var template = document.querySelector('template').content;
        var popupTemplate = template.querySelector('.popup');
        popupTemplate.onclick = close;

        function close(e) {
            if (e.srcElement.classList[0] === "popup") {
                e.srcElement.style.opacity = "0";
                setTimeout(() => {
                    popupTemplate.style.display = "none";
                }, 300);
            }
        }
        var li = document.createElement('li');
        li.innerHTML = 'view tasks';
        li.onclick = viewTasks;

        function viewTasks(e) {

        }
        popupTemplate.querySelector('ul').appendChild(li);
        document.body.appendChild(popupTemplate)
        return popupTemplate;
    }

}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}