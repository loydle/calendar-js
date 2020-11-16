'use strict';

class CalendarJS {
    constructor() {
        const date = new Date();
        this.month = date.getMonth();
        this.year = date.getFullYear();
    }
    getDaysOfMonthAsHTML(year, month){
        let section = document.createElement('section');
        let date = 1;
        /* Loop over weeks */
        for (let i = 0; i < 6; i += 1) {
            let ul = document.createElement('ul');
            /* Loop over days in week */
            for (let j = 0; j < 7; j++) {
                /* Day is not part of this week */
                if (i === 0 && j < (new Date(year, month)).getDay()) {
                    const li = document.createElement('li');
                    ul.appendChild(li);
                }
                /* Day is over the week (ex: if day is 32) */
                else if (date > new Date(month, year, 0).getDate()) {
                    break;
                }
                /* Day is part of the week */
                else {
                    const li = document.createElement('li');
                    /* Day is today, add class .today */
                    if (date === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {
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

    showCalendar(month, year) {
        month = month || new Date().getMonth();
        year = year || new Date().getFullYear();
        const date = new Date(`${this.month + 1}/01/${this.year}`);
        const wrapper = document.querySelector('.wrapper');
        const previousButton = document.getElementById('previous');
        const nextButton = document.getElementById('next');
        const article = document.createElement('article');
        const header = document.createElement('header');
        const h1 = document.createElement('h1');
        const ul = document.createElement('ul');
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        for (let day of days) {
            const li = document.createElement('li');
            li.appendChild(document.createTextNode(day));
            ul.appendChild(li);
        }
        h1.appendChild(document.createTextNode(date.toLocaleString('en-EN', { year: 'numeric', month: 'long'})));

        previousButton.onclick = () => {
            this.year = (this.month === 0) ? this.year - 1 : this.year;
            this.month = (this.month === 0) ? 11 : this.month - 1;
            this.showCalendar(this.month, this.year);
        };
        nextButton.onclick = () => {
            this.year = (this.month === 11) ? this.year + 1 : this.year;
            this.month = (this.month + 1) % 12;
            this.showCalendar(this.month, this.year);
        };
        article.id = 'calendar';
        header.appendChild(h1);
        header.appendChild(ul);
        article.appendChild(header)
        article.appendChild(this.getDaysOfMonthAsHTML(year, month));
        wrapper.innerHTML = '';
        wrapper.appendChild(article);
    }
}

new CalendarJS().showCalendar();
