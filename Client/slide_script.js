// Show Modal
const openModalButton = document.getElementById("open-modal");
const modalWindowOverlay = document.getElementById("modal-overlay");

const showModalWindow = () => {
  modalWindowOverlay.style.display = 'flex';

  const date = new Date();

  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const next_day = (1 + date.getDate());
  const dateStr = year + '-' + month + '-' + day;
  const tomo_dateStr = year + '-' + month + '-' + next_day;

   axios.post('http:localhost:3000/slide/', {dateStr: dateStr, tomo_dateStr: tomo_dateStr})
   .then(result=>{
    const first_msg = document.getElementById('first_msg');
    const second_msg = document.getElementById('second_msg');
    // result.data.rows.map(c => {
    //   console.log(c.title)
    //   document.getElementById('msg').innerHTML = c.title;
    // })
    for(var i=0; i<result.data.rowCount; i++){
      console.log("result", (result.data.rows[i].date).substr(0, 10))
      // console.log(result.data.rows[i].date)
      const input = document.createElement('div');
      // input.innerHTML = result.data.rows[i].title;
      // input.value = result.data.rows[i].title;
      // document.getElementById('msg').innerHTML = result.data.rows[i].title
      // msg_box.appendChild(input)

      if(dateStr == (result.data.rows[i].date).substr(0, 10)){
        console.log("dateStr", dateStr)
        console.log("result.data.rows[i].date", result.data.rows[i].date)
        input.innerHTML = result.data.rows[i].title;
        first_msg.appendChild(input);
      }else{
        input.innerHTML = result.data.rows[i].title;
        second_msg.appendChild(input);
      }
      
    }
   })
}
// openModalButton.addEventListener("click", showModalWindow);

// Hide Modal
const closeModalButton = document.getElementById("close-modal");

const hideModalWindow = () => {
  modalWindowOverlay.style.display = 'none';
}

closeModalButton.addEventListener("click", hideModalWindow);


// Hide On Blur

const hideModalWindowOnBlur = (e) => {

  if (e.target === e.currentTarget) {
    console.log(e.target === e.currentTarget)
    hideModalWindow();
  }
}

modalWindowOverlay.addEventListener("click", hideModalWindowOnBlur)

// 슬라이크 전체 크기(width 구하기)
const slide = document.querySelector(".slide");
let slideWidth = slide.clientWidth;

// 버튼 엘리먼트 선택하기
const prevBtn = document.querySelector(".slide_prev_button");
const nextBtn = document.querySelector(".slide_next_button");

// 슬라이드 전체를 선택해 값을 변경해주기 위해 슬라이드 전체 선택하기
const slideItems = document.querySelectorAll(".slide_item");
// 현재 슬라이드 위치가 슬라이드 개수를 넘기지 않게 하기 위한 변수
const maxSlide = slideItems.length;

// 버튼 클릭할 때 마다 현재 슬라이드가 어디인지 알려주기 위한 변수
let currSlide = 1;

// 페이지네이션 생성
const pagination = document.querySelector(".slide_pagination");

for (let i = 0; i < maxSlide; i++) {
  if (i === 0) pagination.innerHTML += `<li class="active">•</li>`;
  else pagination.innerHTML += `<li>•</li>`;
}

const paginationItems = document.querySelectorAll(".slide_pagination > li");
console.log(paginationItems);

// 버튼 엘리먼트에 클릭 이벤트 추가하기
nextBtn.addEventListener("click", () => {
  // 이후 버튼 누를 경우 현재 슬라이드를 변경
  currSlide++;
  // 마지막 슬라이드 이상으로 넘어가지 않게 하기 위해서
  if (currSlide <= maxSlide) {
    // 슬라이드를 이동시키기 위한 offset 계산
    const offset = slideWidth * (currSlide - 1);
    // 각 슬라이드 아이템의 left에 offset 적용
    slideItems.forEach((i) => {
      i.setAttribute("style", `left: ${-offset}px`);
    });
    // 슬라이드 이동 시 현재 활성화된 pagination 변경
    paginationItems.forEach((i) => i.classList.remove("active"));
    paginationItems[currSlide - 1].classList.add("active");
  } else {
    currSlide--;
  }
});
// 버튼 엘리먼트에 클릭 이벤트 추가하기
prevBtn.addEventListener("click", () => {
  // 이전 버튼 누를 경우 현재 슬라이드를 변경
  currSlide--;
  // 1번째 슬라이드 이하로 넘어가지 않게 하기 위해서
  if (currSlide > 0) {
    // 슬라이드를 이동시키기 위한 offset 계산
    const offset = slideWidth * (currSlide - 1);
    // 각 슬라이드 아이템의 left에 offset 적용
    slideItems.forEach((i) => {
      i.setAttribute("style", `left: ${-offset}px`);
    });
    // 슬라이드 이동 시 현재 활성화된 pagination 변경
    paginationItems.forEach((i) => i.classList.remove("active"));
    paginationItems[currSlide - 1].classList.add("active");
  } else {
    currSlide++;
  }
});

// 브라우저 화면이 조정될 때 마다 slideWidth를 변경하기 위해
window.addEventListener("resize", () => {
  slideWidth = slide.clientWidth;
});

// 각 페이지네이션 클릭 시 해당 슬라이드로 이동하기
for (let i = 0; i < maxSlide; i++) {
  // 각 페이지네이션마다 클릭 이벤트 추가하기
  paginationItems[i].addEventListener("click", () => {
    // 클릭한 페이지네이션에 따라 현재 슬라이드 변경해주기(currSlide는 시작 위치가 1이기 때문에 + 1)
    currSlide = i + 1;
    // 슬라이드를 이동시키기 위한 offset 계산
    const offset = slideWidth * (currSlide - 1);
    // 각 슬라이드 아이템의 left에 offset 적용
    slideItems.forEach((i) => {
      i.setAttribute("style", `left: ${-offset}px`);
    });
    // 슬라이드 이동 시 현재 활성화된 pagination 변경
    paginationItems.forEach((i) => i.classList.remove("active"));
    paginationItems[currSlide - 1].classList.add("active");
  });
}

