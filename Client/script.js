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
let paddingDays; //캘린더에서 처음에 빈 날짜 padding변수
let daysInMonth; //해당 달에 몇일 있는지 받는 변수
let dataArray = new Array(); //load할 때 데이터 받는 array변수
let dataArrayIndex;

function openModal(data, modify) {
  let title = document.getElementById("eventTitleInput");
  let dayInputArea = document.getElementById("dayInputArea");
  let dateInit = document.getElementById("dateInit");
  let timeInitHour = document.querySelector("#timeInitHour");
  let timeInitMinut = document.querySelector("#timeInitMinut");
  let stateInit = document.getElementById("eventStatus").children;
  let categoryInit = document.getElementById("categoryInput");
  let referInit = document.getElementById("refer");
  let deleteBtn = document.getElementById("deleteButton");
  let modifyBtn = document.getElementById("modifyButton");
  let saveBtn = document.getElementById("saveButton");
  let closeBtn = document.getElementById("cancelButton");
  let timeH = document.getElementById("timeInitHour").children;
  let timeM = document.getElementById("timeInitMinut").children;
  let hour;
  let minute;

  if (!modify) {
    //수정이 아닌 상태라면
    // openModal(dataArray[index], true);
    let week = ["日", "月", "火", "水", "木", "金", "土"];
    let dayOfWeek = week[new Date(data).getDay()];
    dayInputArea.innerText = dayOfWeek; //data - 2022-09-15
    dateInit.innerText = `${data.split("-")[1]}-${data.split("-")[2]}`;

    for (let i = 0; i < stateInit.length; i++) {
      stateInit[i].selected = false;
    }
    categoryInit.value = "";
    referInit.value = "";
  } else {
    let date = data.date.split("-");
    console.log("data", data);
    let data_num = data.day;
    let week = ["日", "月", "火", "水", "木", "金", "土"];

    for (let i = 0; i < 7; i++) {
      if (data.day == week[i]) {
        data_num = i;
      }
    }
    dayInputArea.innerText = getDay2(data_num);
    dateInit.innerText = `${date[1]}-${date[2].split(" ")[0]}`;
    title.value = data.title;

    let new_sts;

    if (data.sts == " ") {
      new_sts = "0";
    } else if (data.sts == "進行中") {
      new_sts = "1";
    } else if (data.sts == "完了") {
      new_sts = "2";
    } else if (data.sts == "保留") {
      new_sts = "3";
    }

    stateInit[parseInt(new_sts)].selected = true;
    categoryInit.value = data.cat;
    let _hour = data.date.split(" ");
    hour = _hour[1].split(":")[0];
    minute = _hour[1].split(":")[1];

    if (data.refer != null) referInit.value = data.refer;
  }

  clicked = data;
  const eventForDay = events.find((e) => e.date === clicked);

  if (timeH.length == 0) {
    for (let i = 0; i <= 23; i++) {
      let option;
      option = document.createElement("option");

      if (i < 10) {
        option.innerText = `0${i}`;
        option.value = `0${i}`;
      } else {
        option.innerText = `${i}`;
        option.value = `${i}`;
      }
      timeInitHour.append(option);
    }
    for (let i = 0; i <= 60; i++) {
      let option = document.createElement("option");
      if (i < 10) {
        option.innerText = `0${i}`;
        option.value = `0${i}`;
      } else {
        option.innerText = `${i}`;
        option.value = `${i}`;
      }
      timeInitMinut.append(option);
    }
  }
  if (timeH.length != 0) {
    for (let i = 0; i < timeH.length; i++) {
      if (timeH[i].value == hour) {
        timeH[i].selected = true;
      } else {
        if (i == 0) {
          timeH[i].selected = true;
        } else {
          timeH[i].selected = false;
        }
      }
    }
    for (let i = 0; i < timeM.length; i++) {
      if (i == minute) {
        timeM[i].selected = true;
      } else {
        if (i == 0) {
          timeM[i].selected = true;
        } else {
          timeM[i].selected = false;
        }
      }
    }
  }

  newEventModal.style.display = "block"; //
  backDrop.style.display = "block"; //
  if (modify) {
    deleteBtn.style.display = "block";
    modifyBtn.style.display = "block";
    saveBtn.style.display = "none";
  } else {
    deleteBtn.style.display = "none";
    modifyBtn.style.display = "none";
    saveBtn.style.display = "block";
  }
}

function load() {
  axios.post("http:localhost:3000/load").then((result) => {
    if (result.data == "0") {
      Init();
    } else {
      result.data.map((c) => {
        let data = {
          title: c.title,
          day: c.day_id,
          date: c.date,
          date_no: c.date_no,
          cat: c.category,
          sts: c.state,
          refer: c.refer,
        };

        dataArray.push(data);
      });
      Init();
    }
  });
}

function Init() {
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
    "ja-jp",
    { month: "long" }
  )} ${year}`;

  calendar.innerHTML = "";

  for (let i = 1; i <= this.paddingDays + this.daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");
    let dayString;
    if (month < 9) {
      if (i - this.paddingDays < 10) {
        dayString = `${year}-0${month + 1}-0${i - this.paddingDays}`;
      } else {
        dayString = `${year}-0${month + 1}-${i - this.paddingDays}`;
      }
    } else {
      if (i - this.paddingDays < 10) {
        dayString = `${year}-${month + 1}-0${i - this.paddingDays}`;
      } else {
        dayString = `${year}-${month + 1}-${i - this.paddingDays}`;
      }
    }

    if (i > this.paddingDays) {
      //daySquare.innerText =  i - this.paddingDays;// 1~31
      const dayInnerFrame = document.createElement("div");
      dayInnerFrame.innerText = i - this.paddingDays; // 1~31
      const daySquareInnerText = document.createElement("div");
      dayInnerFrame.classList.add("dayInnerFrame");
      daySquareInnerText.classList.add("daySquareInnerText");
      daySquare.appendChild(dayInnerFrame);
      dayInnerFrame.appendChild(daySquareInnerText);
      // let eventForDay;

      if (dataArray.length > 0) {
        //일정이 있는 경우, dateArray에 데이터가 있는 경우
        dataArray.forEach((value, index) => {
          let date = value.date.split(" ")[0]; //ex)2022-09-06
          if (date === dayString) {
            const eventDiv = document.createElement("div");
            eventDiv.classList.add("event");
            eventDiv.innerText = value.title;
            eventDiv.addEventListener("click", (event) => {
              event.stopPropagation();
              openModal(dataArray[index], true);
              dataArrayIndex = index; //나중에 delete해주기위해 index를 저장해둔다
            });
            daySquareInnerText.appendChild(eventDiv);

            let childCount = daySquareInnerText.children;
            if (childCount.length == 3) {
              let hokaBtn = document.createElement("div");
              hokaBtn.classList.add("hokaBtn");
              dayInnerFrame.appendChild(hokaBtn);
              hokaBtn.innerHTML = "+";
              hokaBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                for (let i = 0; i < childCount.length; i++) {
                  if (childCount[i].style.display == "block" && i > 1) {
                    childCount[i].style.display = "none";
                    dayInnerFrame.classList.remove("extendFrame");
                    dayInnerFrame.classList.remove("focus");
                    daySquareInnerText.classList.remove("daySquareInnerText2");
                    // daySquareInnerText.style.height = 'auto';
                    daySquareInnerText.style.paddingBottom = "0px";
                    hokaBtn.innerHTML = "+";
                  } else {
                    childCount[i].style.display = "block";
                    dayInnerFrame.classList.add("extendFrame");
                    dayInnerFrame.classList.add("focus");
                    daySquareInnerText.classList.add("daySquareInnerText2");
                    daySquareInnerText.style.paddingBottom = "10px";
                    hokaBtn.innerHTML = "-";
                  }
                }
              });
            }
            if (childCount.length > 2) {
              for (let i = 0; i < childCount.length; i++) {
                if (i > 1) {
                  childCount[i].style.display = "none";
                }
              }
            }
          }
        });
      }
      //const eventForDay = events.find(e => e.date === dayString);

      if (i - this.paddingDays === day && nav === 0) {
        daySquare.id = "currentDay";
      }

      daySquare.addEventListener("click", (event) => {
        openModal(dayString, false);
      });
    } else {
      daySquare.classList.add("padding");
    }

    calendar.appendChild(daySquare);
  }
  const dataTable = document.getElementById("tbody");
  console.log("dataArray.length " + dataArray.length);
  console.log(" dataTable.childElementCount " + dataTable.childElementCount);

  while (dataTable.hasChildNodes()) {
    dataTable.removeChild(dataTable.firstChild);
  }

  for (let i = 0; i < dataArray.length; i++) {
    const eventTr = document.createElement("tr");

    let data = dataArray[i];
    let obj = Object.keys(data);

    for (let i = 0; i < obj.length; i++) {
      const key = obj[i];

      if (key == "date_no") {
        continue;
      }
      // console.log("date_array", data);
      const eventTd = document.createElement("th");
      if (key == "day") {
        // console.log("data[key]", getDay3(data[key]));
        eventTd.innerText = getDay3(data[key]);
      } else eventTd.innerText = data[key];

      // if (key == "sts") {
      //   eventTd.innerText = getDay2(data[key]);
      // } else eventTd.innerText = data[key];

      eventTr.appendChild(eventTd);
    }

    dataTable.appendChild(eventTr);
  }
}

function closeModal() {
  eventTitleInput.classList.remove("error");
  newEventModal.style.display = "none";
  deleteEventModal.style.display = "none";
  backDrop.style.display = "none";
  eventTitleInput.value = "";
  clicked = null;
  dataArrayIndex = null;
  Init();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove("error");

    // let day = document.getElementById("dayInputArea").innerText;
    let day = document.getElementById("dayInputArea").innerText;
    let date = document.getElementById("dateInit").innerText;
    let h = document.getElementById("timeInitHour").value;
    let m = document.getElementById("timeInitMinut").value;
    let sts = document.getElementById("eventStatus").value;
    let cat = document.getElementById("categoryInput").value;
    let refer = document.getElementById("refer").value;
    let day_num;

    let week = ["日", "月", "火", "水", "木", "金", "土"];
    for (let i = 0; i < 7; i++) {
      if (week[i] == day) {
        day_num = i;
      }
    }

    let new_sts;

    if (sts == "0") {
      new_sts = " ";
    } else if (sts == "1") {
      new_sts = "進行中";
    } else if (sts == "2") {
      new_sts = "完了";
    } else if (sts == "3") {
      new_sts = "保留";
    }

    axios
      .post("http:localhost:3000/reg", {
        day: day_num,
        title: eventTitleInput.value,
        date: `${clicked} ${h}:${m}`,
        sts: new_sts,
        cat: cat,
        refer: refer,
      })
      .then((result) => {
        result.data.map((c) => {
          const data = {
            title: eventTitleInput.value,
            day: day_num,
            date: `${clicked} ${h}:${m}`,
            date_no: c.date_no,
            cat: cat,
            sts: new_sts,
            refer: refer,
          };
          // console.log("data.day", data.day);
          dataArray.push(data);
        });
        closeModal();
        document.getElementById("timeInitHour").value = "";
        document.getElementById("timeInitMinut").value = "";
      });
  } else {
    eventTitleInput.classList.add("error");
  }
}

function deleteEvent() {
  let data = dataArray[dataArrayIndex];

  let day_num = data.day;

  let week = ["日", "月", "火", "水", "木", "金", "土"];
  for (let i = 0; i < 7; i++) {
    if (week[i] == data.day) {
      day_num = i;
    }
  }

  axios
    .post("http:localhost:3000/del", {
      day: day_num,
      title: data.title,
      date: data.date,
      date_no: data.date_no,
      sts: data.sts,
      cat: data.cat,
      refer: data.refer,
    })
    .then((result) => {
      if (result.data === "OK") {
        //delete dataArray[dataArrayIndex];
        dataArray.splice(dataArrayIndex, 1);
        closeModal();
      }
    });
}

function ModifyEvent() {
  let data = dataArray[dataArrayIndex];
  let beforeDate = data.date;
  let day = document.getElementById("dayInputArea").innerText;
  let date = document.getElementById("dateInit").innerText;
  let h = document.getElementById("timeInitHour").value;
  let m = document.getElementById("timeInitMinut").value;
  let sts = document.getElementById("eventStatus").value; //진행상태 value
  let cat = document.getElementById("categoryInput").value;
  let refer = document.getElementById("refer").value;
  let newDate = data.date.split(" ");

  let week = ["日", "月", "火", "水", "木", "金", "土"];
  for (let i = 0; i < 7; i++) {
    if (week[i] == day) {
      day_num = i;
    }
  }

  let new_sts;

  if (sts == "0") {
    new_sts = " ";
  } else if (sts == "1") {
    new_sts = "進行中";
  } else if (sts == "2") {
    new_sts = "完了";
  } else if (sts == "3") {
    new_sts = "保留";
  }

  const dataObj = {
    title: eventTitleInput.value,
    day: day_num,
    date: `${newDate[0]} ${h}:${m}`,
    date_no: data.date_no,
    cat: cat,
    sts: new_sts,
    refer: refer,
  };

  dataArray[dataArrayIndex] = dataObj;

  axios
    .post("http:localhost:3000/mod", {
      beforeDate: beforeDate,
      day: dataObj.day,
      title: dataObj.title,
      date: dataObj.date,
      date_no: dataObj.data_no,
      sts: dataObj.sts,
      cat: dataObj.cat,
      refer: dataObj.refer,
    })
    .then((result) => {
      if (result.data === "OK") {
        console.log("result.data", result.data);
        console.log("ok");
        closeModal();
      }
    });
}

function initButtons() {
  document.getElementById("nextButton").addEventListener("click", () => {
    nav++;

    //load();
    Init();
  });

  document.getElementById("backButton").addEventListener("click", () => {
    nav--;

    Init();
    //load();
  });

  document.getElementById("saveButton").addEventListener("click", saveEvent);
  document.getElementById("cancelButton").addEventListener("click", closeModal);
  document
    .getElementById("deleteButton")
    .addEventListener("click", deleteEvent);
  document
    .getElementById("modifyButton")
    .addEventListener("click", ModifyEvent);
}

function getDay2(day) {
  //날짜문자열 형식은 자유로운 편

  var week = ["日", "月", "火", "水", "木", "金", "土"];

  var dayOfWeek = week[new Date(day).getDay()];

  return dayOfWeek;
}
function getDay3(day) {
  //날짜문자열 형식은 자유로운 편

  var week = ["日", "月", "火", "水", "木", "金", "土"];

  return week[day];
}

function checkCategory() {
  let cateText = document.querySelector("#categoryInput").value;
  console.log(cateText);
}
initButtons();
load();
