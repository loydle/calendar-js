'use strict';

/**
* @param {date} date - a specific date, if not mentionned then its the date of today
* @return a new CalendarJS as HTMLElement
*/
class CalendarJS {
    constructor(date) {
        this.date  = date ? date : new Date();
        this.year  = this.date.getFullYear();
        this.month = this.date.getMonth();
        this.html  = this.getHTML();
    }

    getDaysOfMonthAsHTML() {
        let section = document.createElement('section');
        let date = 1;
        /* Loop over weeks */
        for (let i = 0; i < 6; i += 1) {
            let ul = document.createElement('ul');
            /* Loop over days in week */
            for (let j = 0; j < 7; j++) {
                /* Day is not part of this week */
                if (i === 0 && j < (new Date(this.date.getFullYear(), this.date.getMonth())).getDay()) {
                    const li = document.createElement('li');
                    ul.appendChild(li);
                }
                /* Day is over the week (ex: if day is 32) */
                else if (date > new Date(this.date.getMonth(), this.date.getFullYear(), 0).getDate()) {
                    break;
                }
                /* Day is part of the week */
                else {
                    const li = document.createElement('li');
                    /* Day is today, add class .today */
                    if (date === this.date.getDate() && this.year === this.date.getFullYear() && this.month === this.date.getMonth()) {
                        li.classList.add("today");
                    }
                    /* date is not today but part of the week */
                    li.appendChild(document.createTextNode(date));
                    ul.appendChild(li);
                    date += 1;
                }
            }
            section.appendChild(ul)
        }
        return section;
    }
    prev () {
        console.log('ok')
    }
    getHTML() {
        const article = document.createElement('article');
        article.id = 'calendar';
        article.innerHTML += `
        <h1>${this.date.toLocaleString('en-EN', { year: 'numeric', month: 'long', day: 'numeric' })}</h1>
        <header>
            <ul>
                <li>S</li>
                <li>M</li>
                <li>T</li>
                <li>W</li>
                <li>T</li>
                <li>F</li>
                <li>S</li>
            </ul>
        </header>
        `;
        article.appendChild(this.getDaysOfMonthAsHTML());
        return article;
    }
}
