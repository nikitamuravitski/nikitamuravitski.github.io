

let currentDate = new Date();
let displayMonthArr = [];
let prevMonthArr = [];
let nextMonthArr = [];


//variables for states of app

//this is for displaying day calendar as default
let isDay = true;

//this is for changing view from day calendar to month calendar
let isMonth = false;

//this is for changing view from month calendar to year calendar
let isYear = false;

// firstMondayVar is var that will contain date of first displayed in view monday
// that needs to be displayed on current month
// returns  date


function firstMondayFinder(currentDateVar) {
    let firstMondayVar = new Date(currentDateVar.getFullYear(), currentDateVar.getMonth(), 1);
    for (let i = 0; firstMondayVar.getDay() !== 1; i++) {
        firstMondayVar = new Date(currentDateVar.getFullYear(), currentDateVar.getMonth(), 1 - i);
    }
    return firstMondayVar
}

// calculates 6 rows of 7 days each for month that starts from first monday 
function calculateMonth(monthArray) {
    let firstMondayVar = firstMondayFinder(currentDate);
    for (let i = 0; i < 6; i++) {
        let row = [];
        for (let j = 0; j < 7; j++) {
            row[j] = new Date(firstMondayVar.getFullYear(), firstMondayVar.getMonth(), firstMondayVar.getDate() + (i * 7) + j)
        }
        monthArray.push(row)
    }
}

// deletes rows from modArr so they dont have duplicates with arr
// modArr is one that needs to be changed
// arr stays the same 
function arrFilter(arr, modArr) {
    arr.forEach(item => {
        modArr.forEach((item2, index2) => {
            if (item[0].getDate() === item2[0].getDate() && item[0].getMonth() === item2[0].getMonth()) {
                modArr.splice(index2, 1);
            }
        })
    })

}


function arrayForRender(currentDateVar, previousMonthArr, displayMonthArr, nextMonthArr) {


    displayMonthArr.splice(0, displayMonthArr.length);
    previousMonthArr.splice(0, previousMonthArr.length);
    nextMonthArr.splice(0, nextMonthArr.length);
    currentDateVar.setMonth(currentDateVar.getMonth() - 1);
    calculateMonth(previousMonthArr);
    currentDateVar.setMonth(currentDateVar.getMonth() + 1);
    calculateMonth(displayMonthArr);
    arrFilter(displayMonthArr, previousMonthArr);
    currentDateVar.setMonth(currentDateVar.getMonth() + 1);
    calculateMonth(nextMonthArr);
    arrFilter(displayMonthArr, nextMonthArr);
    currentDateVar.setMonth(currentDateVar.getMonth() - 1);

}



// ------------- creating the HTML  ----------------



let main = document.createElement('div');
main.id = 'mainCalendar';

document.getElementsByTagName('body')[0].appendChild(main);

let header = document.createElement('div');
header.id = 'header';
main.appendChild(header);



let monthNameArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let monthName = document.createElement('div');
monthName.id = 'monthName';


monthName.innerText = monthNameArr[currentDate.getMonth()] + ' ' + currentDate.getFullYear();
header.appendChild(monthName);


let headerRangeContainer = document.createElement('div');
header.appendChild(headerRangeContainer);
headerRangeContainer.classList = 'headerRangeContainer';
headerRangeContainer.style.display = 'none';
let headerFromRange = document.createElement('div');
let headerToRange = document.createElement('div');
headerFromRange.classList = 'headerRangeElement';
headerToRange.classList = 'headerRangeElement';
headerRangeContainer.appendChild(headerFromRange);
headerRangeContainer.appendChild(headerToRange);

//creating remove button for selected range

let removeRangeButton = document.createElement('button');
let removeRangeButtonImage = document.createElement('i');
removeRangeButtonImage.classList = 'far fa-trash-alt ';
removeRangeButton.appendChild(removeRangeButtonImage)
headerRangeContainer.appendChild(removeRangeButton);
removeRangeButton.classList = 'removeChangeButton';


let prevButton = document.createElement('button');
prevButton.id = 'prev';
let prevButtonImage = document.createElement('i')
prevButtonImage.classList = 'fas fa-sort-up';
prevButton.appendChild(prevButtonImage);
header.appendChild(prevButton);

let nextButton = document.createElement('button');
nextButton.id = 'next';
let nextButtonSpan = document.createElement('span');
nextButton.appendChild(nextButtonSpan)
let nextButtonImage = document.createElement('i');
nextButtonImage.classList = 'fas fa-sort-down';
nextButtonSpan.appendChild(nextButtonImage);
header.appendChild(nextButton);

let dayHeaderContainer = document.createElement('div');
dayHeaderContainer.id = 'dayHeaderContainer';
main.appendChild(dayHeaderContainer);

let dayNameArr = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

for (let i = 0; i < 7; i++) {
    let dayHeader = document.createElement('div');
    dayHeader.classList = 'dayHeader';
    dayHeader.innerText = dayNameArr[i];
    dayHeaderContainer.appendChild(dayHeader);
}

let monthContainer = document.createElement('div');
monthContainer.id = 'monthContainer';
main.appendChild(monthContainer);


function renderArr(arr) {
    arr.forEach(row => {
        let week = document.createElement('div');
        week.classList = 'week';
        monthContainer.appendChild(week);
        row.forEach(item => {
            //firstday
            if (item.getMonth() === currentDate.getMonth() && item.getDate() === 1) {
                week.id = 'currentScroll'
            }
            let day = document.createElement('div');
            day.classList = 'day';
            day.setAttribute('data-date', `${item}`)
            day.innerHTML = item.getDate();
            day.style.userSelect = 'none';
            let inDay = document.createElement('div');
            inDay.classList = 'inDay'
            day.appendChild(inDay)
            if (item.getMonth() !== currentDate.getMonth()) {
                day.classList = 'day outOfMonth';
            }
            if (item.getDate() === new Date().getDate() && item.getMonth() === new Date().getMonth() && item.getFullYear() === new Date().getFullYear()) {
                day.style.boxShadow = 'inset 0 0 0 2px #197278'
            }
            week.appendChild(day)
        })
    });
}


//-----------selecting day scope for 

function renderDayScope(from, to) {
    if (!from) {
        return
    }
    to = to || from;
    //if from day is futurer than to day, i am swapping them
    if (new Date(from.dataset.date).getTime() > new Date(to.dataset.date).getTime()) {
        let swap = from;
        from = to;
        to = swap;
    }
    document.querySelectorAll('.day').forEach(element => {
        let elementDate = new Date(element.dataset.date).getTime();
        if (elementDate >= new Date(from.dataset.date).getTime()) {

            element.classList.add('focus')
        }
        if (elementDate > new Date(to.dataset.date).getTime()) {
            element.classList.remove('focus')
            return
        }
    });

}
//module that renders info container in header about date range 
function dateDangeDivRender() {
    if (window.fromDay) {
        headerRangeContainer.style.display = 'flex';
        headerFromRange.innerText = `from: ${new Date(window.fromDay.dataset.date).toDateString()}`;
    } else {

        headerFromRange.innerText = '';
    }
    if (window.toDay) {
        headerToRange.innerText = `to: ${new Date(window.toDay.dataset.date).toDateString()}`;
    } else {
        headerToRange.innerText = '';
    }
}

//render module for rendering day view
function renderCalender() {
    if (isDay) {
        arrayForRender(currentDate, prevMonthArr, displayMonthArr, nextMonthArr);
        renderArr(prevMonthArr);
        renderArr(displayMonthArr);
        renderArr(nextMonthArr);
        monthContainer.scrollTop = 30 * prevMonthArr.length;
        setEventAllDays();
    }
}
renderCalender();

//setting event for all rendered days
let checkFocus = false;
let checkDay = false;
function setEventAllDays() {
    document.querySelectorAll('.day').forEach(element => {
        element.onclick = event => {
            if (!checkFocus) {

                if (!checkDay) {
                    element.classList.add('focus')
                    checkDay = true;
                    window.fromDay = event.target;
                } else {
                    checkDay = false;
                    checkFocus = true;
                    window.toDay = event.target;
                }
                dateDangeDivRender();
                renderDayScope(window.fromDay, window.toDay);
            }




        }
    });
}

removeRangeButton.onclick = function (event) {
    window.fromDay = false;
    window.toDay = false;
    checkFocus = false;
    checkDay = false;
    document.querySelectorAll('.day').forEach(element => element.classList.remove('focus'))

    headerRangeContainer.style.display = 'none'
}


let checkAnimation = false;

//prev button handler
prevButton.onclick = function () {
    if (isDay) {
        if (checkAnimation) return;
        checkAnimation = true;
        currentDate.setMonth(currentDate.getMonth() - 1);
        currentDate.setDate(1);
        monthName.innerText = monthNameArr[currentDate.getMonth()] + ' ' + currentDate.getFullYear();
        monthContainer.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => {
            monthContainer.innerHTML = '';
            renderCalender();
            renderDayScope(window.fromDay, window.toDay);
            checkAnimation = false;
            monthContainer.appendChild(circle);
        }, 250)

    }
    if (isMonth) {

        if (checkAnimation) return
        checkAnimation = true;

        monthName.innerText = currentDate.getFullYear() - 1;
        monthContainer.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
            monthContainer.innerHTML = '';
            currentDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate())
            monthsRenderModule();
            checkAnimation = false;
            monthContainer.appendChild(circle);
        }, 300)
    }

}

//next button handler
nextButton.onclick = function (event) {
    if (isDay) {
        if (checkAnimation) return
        checkAnimation = true;
        currentDate.setMonth(currentDate.getMonth() + 1);
        currentDate.setDate(1);
        monthName.innerText = monthNameArr[currentDate.getMonth()] + ' ' + currentDate.getFullYear();
        monthContainer.scrollTo({ top: 30 * document.querySelectorAll('.week').length, behavior: 'smooth' })
        setTimeout(() => {
            monthContainer.innerHTML = '';
            renderCalender();
            renderDayScope(window.fromDay, window.toDay);
            checkAnimation = false;
            monthContainer.appendChild(circle);
        }, 250)
    }
    if (isMonth) {
        console.log(1)
        if (checkAnimation) return
        console.log(2)
        checkAnimation = true;
        monthName.innerText = currentDate.getFullYear() + 1;
        monthContainer.scrollTo({ top: 340, behavior: 'smooth' });
        console.log(3)
        setTimeout(() => {
            monthContainer.innerHTML = '';
            currentDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate())
            monthsRenderModule();
            checkAnimation = false;
            monthContainer.appendChild(circle);
            console.log(4)
        }, 300)
    }
}

//mouse scroll scrolls to next month
main.onwheel = function (event) {
    if (event.deltaY > 0) {
        nextButton.click();
    } else {
        prevButton.click();
    }
}
monthContainer.onwheel = function (event) {
    event.preventDefault()
}

// circle for hover effect
let circle = document.createElement('div')
circle.id = 'circle';
circle.style.width = '80px';
circle.style.height = '80px';
monthContainer.appendChild(circle)
circle.style.top = '700px';

//hover effect handler for calendar
document.body.onmousemove = function (event) {
    if (isDay) {
        circle.style.left = `${event.clientX - monthContainer.getBoundingClientRect().left - 40}px`;
        if (prevMonthArr.length > 4) {
            circle.style.top = `${event.clientY + (prevMonthArr.length - 4) * 30}px`;
        }
        else {
            circle.style.top = `${event.clientY}px`;
        }
    }
    if (isMonth) {
        circle.style.left = `${event.clientX - monthContainer.getBoundingClientRect().left - 60}px`;
        circle.style.top = `${event.clientY + 50}px`;
    }
}





// =============== Month View =================




//creating new section of months instead of days

monthName.onclick = function (event) {
    //FOR NOW!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (isMonth) return

    isDay = false;
    isMonth = true;

    monthContainer.innerHTML = '';

    dayHeaderContainer.style.display = 'none';

    monthContainer.style.height = '220px';
    monthContainer.style.flexDirection = 'row';
    monthContainer.style.flexWrap = 'wrap';
    circle.style.width = '120px';
    circle.style.height = '120px';
    monthContainer.appendChild(circle);
    monthsRenderModule();
}
let monthShortNameArr = monthNameArr.map(item => {
    return item[0] + item[1] + item[2]
})

//for proper render i need to switch monthContainer to another flex-direction and flex-wrap
function renderDivs() {
    for (let i = 0; i < 40; i++) {

        let wholeMonthDiv = document.createElement('div');
        wholeMonthDiv.classList = 'wholeMonthDiv';
        wholeMonthDiv.setAttribute('data-date', `${new Date(currentDate.getFullYear() - 1, i, 1)}`);

        if (new Date(wholeMonthDiv.dataset.date).getFullYear() === currentDate.getFullYear()) {
            wholeMonthDiv.style.color = 'black';
            //highlighting current month
            if (new Date(wholeMonthDiv.dataset.date).getFullYear() === new Date().getFullYear()) {
                if (new Date(wholeMonthDiv.dataset.date).getMonth() === new Date().getMonth()) {
                    wholeMonthDiv.style.boxShadow = 'inset 0 0 0 2px #197278'
                }
            }

        }
        let inWholeMonth = document.createElement('div')
        inWholeMonth.classList = 'inWholeMonth';
        wholeMonthDiv.innerText = monthShortNameArr[i % 12];
        monthContainer.appendChild(wholeMonthDiv);
        wholeMonthDiv.appendChild(inWholeMonth);

        wholeMonthDiv.onclick = function() {
            //resetting global bool vars 
            isDay = true;
            isMonth = false;
            isYear = false;
            currentDate = new Date(wholeMonthDiv.dataset.date);
            monthContainer.innerHTML = '';
            monthContainer.style.height= '180px';
            dayHeaderContainer.style.display = 'flex'
            renderCalender();
            renderDayScope(window.fromDay, window.toDay);
            monthName.innerText = monthNameArr[currentDate.getMonth()] + ' ' + currentDate.getFullYear();
            monthContainer.appendChild(circle);

        }

    }
}



//main module that will invoke all functions
function monthsRenderModule() {
    monthName.innerText = currentDate.getFullYear();
    renderDivs();
    monthContainer.scrollTop = 165;
}
