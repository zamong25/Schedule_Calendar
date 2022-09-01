let nav = 0;
let clicked = null;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

const calendar = document.getElementById("calendar");
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let paddingDays;
let daysInMonth;

function openModal(date) {
  clicked = date;
  const eventForDay = events.find((e) => e.date === clicked);

  if (eventForDay) {
    document.getElementById("eventText").innerText = eventForDay.title;
    deleteEventModal.style.display = "block";
  } else {
    document.getElementById("dayInputArea").innerText = getDay2(date);
    document.getElementById("dateInit").innerText = `${date.split("-")[1]}-${
      date.split("-")[2]
    }`;
    // let dateInit = document.querySelector(".dateInit");
    // for(let i = 1; i <= this.paddingDays + this.daysInMonth ; i++) {
    //   if (i > this.paddingDays) {
    //     let option = document.createElement('option');
    //     option.innerText = `${i -this.paddingDays}`;
    //     option.value = `${i -this.paddingDays}`;
    //     dateInit.append(option);
    //   }
    // }
    let timeInitHour = document.querySelector("#timeInitHour");
    let timeInitMinut = document.querySelector("#timeInitMinut");
    for (let i = 0; i <= 23; i++) {
      let option = document.createElement("option");
      option.innerText = `${i}`;
      option.value = `${i}`;
      timeInitHour.append(option);
    }
    for (let i = 0; i <= 60; i++) {
      let option = document.createElement("option");
      option.innerText = `${i}`;
      option.value = `${i}`;
      timeInitMinut.append(option);
    }
    newEventModal.style.display = "block";
  }

  backDrop.style.display = "block";
}

function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();

  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);

  this.daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  this.paddingDays = weekdays.indexOf(dateString.split(", ")[0]); //1

  document.getElementById("monthDisplay").innerText = `${dt.toLocaleDateString(
    "en-us",
    { month: "long" }
  )} ${year}`;

  calendar.innerHTML = "";

  for (let i = 1; i <= this.paddingDays + this.daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");
    let dayString;
    if (month < 9) {
      dayString = `${year}-0${month + 1}-${i - this.paddingDays}`;
      //ex) 8/0/2022 - 8/1/2022
    } else {
      dayString = `${year}-${month + 1}-${i - this.paddingDays}`;
      //ex) 8/0/2022 - 8/1/2022
    }

    if (i > this.paddingDays) {
      daySquare.innerText = i - this.paddingDays; // 1~31

      const eventForDay = events.find((e) => e.date === dayString);

      if (i - this.paddingDays === day && nav === 0) {
        daySquare.id = "currentDay";
      }

      if (eventForDay) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener("click", () => openModal(dayString));
    } else {
      daySquare.classList.add("padding");
    }

    calendar.appendChild(daySquare);
  }
}

function closeModal() {
  eventTitleInput.classList.remove("error");
  newEventModal.style.display = "none";
  deleteEventModal.style.display = "none";
  backDrop.style.display = "none";
  eventTitleInput.value = "";
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove("error");

    let day = getDay2(document.getElementById("dayInputArea").innerText);
    let date = document.getElementById("dateInit").innerText;
    let h = document.getElementById("timeInitHour").value;
    let m = document.getElementById("timeInitMinut").value;
    console.log("요일 = " + day);
    console.log("저장된 날짜 = " + date);
    console.log("저장된 시= " + h);
    console.log("저장된 분 = " + m);
    // fetch('http:localhost:3000/reg',{lan:lan, msg:msg})
    // .then(response => response.text())
    // .then(data => console.log(data))

    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });

    localStorage.setItem("events", JSON.stringify(events));

    closeModal();
    document.getElementById("timeInitHour").value = "";
    document.getElementById("timeInitMinut").value = "";
  } else {
    eventTitleInput.classList.add("error");
  }
}

function deleteEvent() {
  events = events.filter((e) => e.date !== clicked);
  localStorage.setItem("events", JSON.stringify(events));

  closeModal();
}

function initButtons() {
  document.getElementById("nextButton").addEventListener("click", () => {
    nav++;

    load();
  });

  document.getElementById("backButton").addEventListener("click", () => {
    nav--;
    load();
  });

  document.getElementById("saveButton").addEventListener("click", saveEvent);
  document.getElementById("cancelButton").addEventListener("click", closeModal);
  document
    .getElementById("deleteButton")
    .addEventListener("click", deleteEvent);
  document.getElementById("closeButton").addEventListener("click", closeModal);
}

function getDay2(day) {
  //날짜문자열 형식은 자유로운 편

  var week = ["일", "월", "화", "수", "목", "금", "토"];

  var dayOfWeek = new Date(day).getDay();

  return dayOfWeek;
}

initButtons();
load();
