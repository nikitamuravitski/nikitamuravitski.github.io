

let currentDate = new Date();
let displayMonthArr = [];
let prevMonthArr = [];
let nextMonthArr = [];


// firstMondayVar is var that will contai date of first displayed monday
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

// iach time you invoke it, it adds to current date var 1 month
// so i can go forvard just by clicking the button
// if i need to go back i would need to subtract 2 months

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

let prevButton = document.createElement('button');
prevButton.id = 'prev';
let prevButtonImage = document.createElement('i')
prevButtonImage.classList = 'fas fa-arrow-left';
prevButton.appendChild(prevButtonImage);
header.appendChild(prevButton);


let monthNameArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let monthName = document.createElement('div');
monthName.id = 'monthName';

monthName.innerText = monthNameArr[currentDate.getMonth()] + ' ' + currentDate.getFullYear();
header.appendChild(monthName);

let nextButton = document.createElement('button');
nextButton.id = 'next';
let nextButtonSpan = document.createElement('span');
nextButton.appendChild(nextButtonSpan)
let nextButtonImage = document.createElement('i');
nextButtonImage.classList = 'fas fa-arrow-right';
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
            day.innerText = item.getDate();
            day.style.userSelect = 'none';
            let inDay = document.createElement('div');
            inDay.classList = 'inDay'
            day.appendChild(inDay)
            if (item.getMonth() !== currentDate.getMonth()) {
                day.classList = 'day outOfMonth';
            }
            if (item.getDate() === new Date().getDate() && item.getMonth() === new Date().getMonth() && item.getFullYear() === new Date().getFullYear()) {
                day.classList = 'day selected';
            }
            week.appendChild(day)
        })
    });
}
function renderCalender() {

    arrayForRender(currentDate, prevMonthArr, displayMonthArr, nextMonthArr);
    renderArr(prevMonthArr);
    renderArr(displayMonthArr);
    renderArr(nextMonthArr);
    monthContainer.scrollTop = 30 * prevMonthArr.length;

}
renderCalender();

let checkAnimation = false;
prevButton.onclick = function () {
    if (checkAnimation) return;
    checkAnimation = true;
    currentDate.setMonth(currentDate.getMonth() - 1);
    currentDate.setDate(1);
    monthName.innerText = monthNameArr[currentDate.getMonth()] + ' ' + currentDate.getFullYear();
    monthContainer.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => {
        monthContainer.innerHTML = '';
        renderCalender();
        checkAnimation = false;
        monthContainer.appendChild(circle);
    }, 250)

}

nextButton.onclick = function (event) {

    if (checkAnimation) return
    checkAnimation = true;
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(1);
    monthName.innerText = monthNameArr[currentDate.getMonth()] + ' ' + currentDate.getFullYear();
    monthContainer.scrollTo({ top: 30 * document.querySelectorAll('.week').length, behavior: 'smooth' })
    setTimeout(() => {
        monthContainer.innerHTML = '';
        renderCalender();
        checkAnimation = false;
        monthContainer.appendChild(circle);
    }, 250)
   

}

//mouse scroll scrolls to next month
main.onwheel = function (event) {
    if (event.deltaY < 0) {
        nextButton.click();
    } else {
        prevButton.click();
    }
}
monthContainer.onwheel = function (event) {
    event.preventDefault()
}

let circle = document.createElement('div')
circle.id = 'circle';
monthContainer.appendChild(circle)
circle.style.top = '700px';

let selectedDay;

function rerenderSelectedDay(div) {
    if(document.querySelector('.focus')) 
        document.querySelector('.focus').classList.remove('focus');
        console.log(selectedDay)
    div.classList.add('focus') ;
}

document.querySelectorAll('.day').forEach((element, index) => {
    let pickedDate;
    element.onclick = event => {

            selectedDay = new Date(event.target.getAttribute('data-date'));
            rerenderSelectedDay(event.target);

    }

});

document.body.onmousemove = function (event) {
    circle.style.left = `${event.clientX - monthContainer.getBoundingClientRect().left - 40}px`;
    if (prevMonthArr.length > 4) {
        circle.style.top = `${event.clientY - 30 + (prevMonthArr.length - 4) * 30}px`;
    }
    else {
        circle.style.top = `${event.clientY - 30}px`;
    }
}


