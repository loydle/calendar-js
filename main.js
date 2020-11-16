'use strict';

/**
* @param {date} date - a specific date, if not mentionned then its the date of today
* @return a new CalendarJS as HTMLElement
*/
class CalendarJS {
    constructor(date) {
        this.date = (date) ? date : new Date();
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth();
        this.html = this.getHTML();
    }

    getDaysOfMonthAsHTML() {
        let section = document.createElement('section');
        let date = 1;
        for (let i = 0; i < 6; i += 1) {
            let ul = document.createElement("ul");

            //creating individual cells, filing them up with data.
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < (new Date(this.date.getFullYear(), this.date.getMonth())).getDay()) {
                    const li = document.createElement('li');
                    const cellText = document.createTextNode("");
                    li.appendChild(cellText);
                    ul.appendChild(li);
                }
                else if (date > new Date(this.date.getMonth(), this.date.getFullYear(), 0).getDate()) {
                    break;
                }

                else {
                    const li = document.createElement('li');
                    const cellText = document.createTextNode(date);
                    if (date === this.date.getDate() && this.year === this.date.getFullYear() && this.month === this.date.getMonth()) {
                        li.classList.add("today");
                    }
                    li.appendChild(cellText);
                    ul.appendChild(li);
                    date++;
                }
            }
            section.appendChild(ul)
        }

        return section;
    }

    getHTML() {
        const article = document.createElement('article');
        article.id = 'calendar';
        article.innerHTML = `
        <header>
        <ul>
        <li>S</li><li>M</li><li>T</li><li>W</li><li>T</li><li>F</li><li>S</li>
        </ul>
        </header>
        `;
        article.appendChild(this.getDaysOfMonthAsHTML());
        return article;
    }
}
