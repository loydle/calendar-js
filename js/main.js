'use strict';

const CalendarInit = new Calendar(new Day(new Date()));
const template = document.querySelector('template').content.cloneNode(true);

renderCalendar(
    document.getElementById('calendar'),
    CalendarInit,
    template
);
//----------------------------------------------------------
//----------------------------------------------------------

function renderCalendar(calendarNode, CalendarObj, template) {

    clearWeekViews(calendarNode);
    prevNextBtnClickEvent(calendarNode, CalendarObj);
    renderDays(calendarNode, CalendarObj, template);
    renderMonthAndYearTitle(calendarNode, CalendarObj);

    // ---------
    // ---------

    function clearWeekViews(calendarNode) {
        try {

            if (calendarNode instanceof HTMLElement) {
                let weeksArray = nodeListToArray(calendarNode.querySelectorAll('.week'));
                weeksArray.map(w => w.innerHTML = '');
            }
        } catch (err) {
            // fallback
        }
    }

    function prevNextBtnClickEvent(calendarNode, CalendarObj) {
        let next = calendarNode.querySelector('.next');
        let prev = calendarNode.querySelector('.prev');

        next.onclick = changeView;
        prev.onclick = changeView;

        //---
        //---

        function changeView(e) {
            let newDate = CalendarObj.date;
            newDate.setDate(1);
            if (e.srcElement.classList.value.match(/next/)) {
                newDate.setMonth(
                    newDate.getMonth() + 1
                );
            } else if (e.srcElement.classList.value.match(/prev/)) {
                newDate.setMonth(
                    newDate.getMonth() - 1
                );
            }
            renderCalendar(
                calendarNode,
                new Calendar(new Day(newDate)),
                template);
        }
    }

    function renderDays(calendarHTMLElm, CalendarObj, template) {
        for (let i = 1; i <= CalendarObj.days.length; i++) {
            const day = new Day(
                new Date(`
                ${CalendarObj.month} ${i}, ${CalendarObj.year} 00:00`)
            );
            const dayView = template.querySelector('.day-view').cloneNode(true);
            const dayContainer = template.querySelector('.day').cloneNode(true);
            const weekContainer = calendarHTMLElm.querySelector('.days .current-month .week-' + day.week);
            if (
                dayView instanceof HTMLElement &&
                dayContainer instanceof HTMLElement &&
                weekContainer instanceof HTMLElement
            ) {
                dayContainer.dataset.id = day.date;
                dayContainer.dataset.day = day.day;
                dayContainer.dataset.date = day.date;
                dayView.innerHTML = day.day;
                dayContainer.appendChild(dayView);
                weekContainer.appendChild(dayContainer);

                (function renderPastWeek(i) {
                    if (i === 1) {
                        if (day.week != 0) {
                            for (let i = 0; i < day.week; i++) {
                                const dayView = template.querySelector('.day-view').cloneNode(true);
                                const dayContainer = template.querySelector('.day').cloneNode(true);
                                dayContainer.appendChild(dayView);
                                calendarHTMLElm.querySelector('.days .current-month .week-' + i).appendChild(dayContainer);
                            }
                        }
                    }


                }(i));
            } else {
                console.error('not an HTML element');
            }
        }

        let row = calendarHTMLElm.querySelectorAll('.current-month .week');
        if (row.length) {
            for (let i = 0; i < row.length; i++) {
                if (row[i].querySelector('.day') instanceof HTMLElement) {
                    if (!row[i].querySelector('.day').dataset.day) {

                        let missingDay = daysInMonth(CalendarObj.date.getMonth(), CalendarObj.date.getFullYear(), 0) - i;
                        let newDate = new Date(CalendarObj.date.getFullYear(), CalendarObj.date.getMonth() - 1, missingDay);
                        let dayView = calendarHTMLElm.querySelector('.week-' + newDate.getDay() + ' .day .day-view');
                        let section = calendarHTMLElm.querySelector('.week-' + newDate.getDay() + ' .day');
                        section.dataset.date = newDate;
                        section.dataset.id = newDate;
                        section.classList.add('past');
                        dayView.innerHTML = newDate.getDate();
                    }
                }

            }
        }
        renderTodayActiveDay(calendarNode, CalendarObj);
        renderDaysBehavior(calendarNode);


        function renderTodayActiveDay(calendarHTMLElm, CalendarObj) {
            if (
                CalendarObj.month === monthToString(new Date()) &&
                CalendarObj.year === new Date().getFullYear()
            ) {
                const daysNode = calendarHTMLElm.querySelectorAll('section.week .day');
                for (let i = 0; i < daysNode.length; i++) {
                    if (new Date(daysNode[i].dataset.date).getDate() == new Date().getDate()) {
                        daysNode[i].classList.add('today');
                    } else {
                        daysNode[i].classList
                            .remove('today');
                    }
                }
            }
        }

        function renderDaysBehavior(calendarNode) {
            let daysArray = nodeListToArray(calendarNode.querySelectorAll('.day'));

            daysArray.forEach(elm => elm.onclick = popupAction);


            function popupAction(e) {
                let srcElement = e.srcElement;
                let id;
                if (e.srcElement instanceof HTMLElement) {
                    if (e.srcElement.classList.value.match(/day-view/)) {
                        srcElement = e.srcElement.parentNode;
                    }
                }
                if (srcElement.dataset.id) {
                    id = srcElement.dataset.id;
                }
                console.trace({ id: hashString(id) });
            }
        }


    }


    function renderMonthAndYearTitle(calendarHTMLElm, Calendar) {
        let monthNode = calendarHTMLElm.querySelector('.month');
        if (monthNode instanceof HTMLElement) {
            monthNode.innerHTML = Calendar.year + '<br>' + Calendar.month;
        }
    }
}

function Day(dayAsDateObj) {
    this.id = hashString(String(dayAsDateObj));
    this.date = dayAsDateObj;
    this.day = dayAsDateObj.getDate();
    this.week = dayAsDateObj.getDay();
    this.month = dayAsDateObj.getMonth();
    this.year = dayAsDateObj.getFullYear();
    return this;
}

function Calendar(Day) {
    this.date = Day.date;
    this.today = new Date().getDate();
    this.year = getYear(Day.date);
    this.month = monthToString(Day.date);
    this.year = Day.date.getFullYear();
    this.days = getArrayOfDays(getNmbOfDaysInMonth(this.date));
    this.dayOfWeek = dayToString(Day.date);

    //----
    //----

    function getYear(dateObj) {
        return dateObj.getFullYear();
    }

    function getArrayOfDays(nbOfDays) {
        let days = [];
        for (let i = 1; i <= nbOfDays; i++) {
            days.push(i);
        }
        return days;
    }

    function getNmbOfDaysInMonth(date) {
        try {
            return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        } catch (err) {
            console.trace(err);
        }
    }

    return this;
}

function dayToString(dateObj) {
    try {
        let daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return daysOfWeek[dateObj.getDay()];
    } catch (err) {
        console.trace(err);
    }
}


function monthToString(date) {
    try {
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        if (date) {
            return months[date.getMonth()];
        } else {
            let today = new Date();
            return months[today.getMonth()];
        }
    } catch (err) {
        // fallback
    }
}



// ------
// UTILS 
// -----

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function nodeListToArray(nodeList) {
    try {
        if (nodeList[0] instanceof HTMLElement) {
            return [].slice.call(nodeList);
        } else {
            return [document.createElement('div')];
        }
    } catch (err) {
        return [document.createElement('div')];
    }
}

function hashString(s) {
    return s.split('').reduce(function(a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
}