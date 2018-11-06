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
        if (calendarNode instanceof HTMLElement) {
            let weeksArray = nodeListToArray(calendarNode.querySelectorAll('.week'));
            weeksArray.map(w => w.innerHTML = '');
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

            }

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

            }(i));
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
        console.trace(err);
    }
}

// function Popup(srcElement, selector) {
//     let template = document.querySelector('template').content;
//     if (srcElement.classList[0] === 'day-view') {
//         srcElement = srcElement.parentNode;
//     }
//     let parentDataset = srcElement.dataset;
//     let canvas = template.querySelector(selector) || document.querySelector('.popup ' + selector);
//     canvas.width = 400;
//     canvas.height = 528;
//     let popupTemplate = template.querySelector('.popup') || document.querySelector('.popup');
//     let config = {
//         backgroundColor: 'rgba(255,255, 255,0.9)',
//     };
//     let ctx = canvas.getContext('2d');

//     let data = [{
//             y: 45,
//             content: "Meeting",
//             duration: 1,
//         },
//         {
//             y: 176,
//             content: 'Lorem ipsum dolore set amet',
//             duration: 4,
//         },
//     ]
//     drawCanvas(data)

//     canvas.addEventListener('mouseenter', (e) => {
//         canvas.addEventListener('mousemove', (e) => {
//             canvas.onclick = saveData;
//             drawCanvas(data)
//             ctx.fillStyle = '#CCC';
//             ctx.fillRect(68, e.offsetY - 20, canvas.width, 40);

//             function saveData() {
//                 data.push({ y: e.offsetY - 20, content: 'Quae dolorem ut facere nemo consectetur.', duration: 1, })
//                 drawCanvas(data)
//             }
//         })
//     })

//     function drawCanvas(data) {
//         for (let i = 0; i < 24; i++) {
//             let getContent = new Promise(function(resolve, reject) {
//                 resolve({
//                     date: new Date('1 Jan 2019 ' +
//                         i + ':00').getHours(),
//                     i: i,
//                 })
//             })
//             getContent.then(function(c) {
//                 for (let i = 0; i < data.length; i++) {
//                     ctx.fillStyle = "#f2b632"
//                     ctx.fillRect(68, data[i].y, 1000, data[i].duration * 40);
//                     ctx.fillStyle = "#FFF"

//                     ctx.font = "14px Montserrat, sans-serif ";
//                     ctx.fillText(data[i].content, 80, data[i].y + 24)
//                 }
//                 drawLine(ctx, 0, c.i * 22, c, '#999');
//             })

//             ctx.fillStyle = '#ffffff';
//             ctx.fillRect(0, 0, canvas.width, canvas.height);

//         }
//     }

//     popupTemplate.onclick = _closePopup;


//     if (document.querySelector('.popup')) {
//         popupTemplate.style.display = "block";
//         popupTemplate.style.opacity = "1";
//     } else {

//         popupTemplate.appendChild(canvas);
//         document.body.appendChild(popupTemplate)
//         return popupTemplate;
//     }

//     function _closePopup(e) {
//         if (e.srcElement.classList[0] === "popup") {
//             e.srcElement.style.opacity = "0";
//             setTimeout(() => {
//                 popupTemplate.style.display = "none";
//             }, 300);
//         }
//         return 0;
//     }



//     function drawLine(ctx, x, y, content, color) {
//         if (content.date % 2) {

//             ctx.fillStyle = color;
//             ctx.font = "14px Montserrat, sans-serif ";

//             if (content.date <= 9) {
//                 content.date = '0' + content.date;
//             };
//             ctx.fillText(content.date + ':00', 12, y + 4);
//             ctx.lineWidth = 1;
//             ctx.strokeStyle = '#EEE';
//             if (y != 0) {
//                 ctx.beginPath();
//                 ctx.moveTo(x, y + 20);
//                 ctx.lineTo(1000, y + 20);
//                 ctx.stroke();
//             }
//         }


//     }


// }



// ------
// UTILS 
// -----

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function nodeListToArray(nodeList) {
    return [].slice.call(nodeList) || [document.createElement('div')];
}

function hashString(s) {
    return s.split('').reduce(function(a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);

}