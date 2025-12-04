let allCourses = []
let allUsers = []
const startLoader = document.querySelector('.start-loader')
const errorOverlay = document.querySelector('.error-overlay')
const errorMessage = errorOverlay.querySelector('#error-message')
const retryBtn = document.querySelector('#retry-btn')
const tableBody = document.querySelector('.table-body')
const productsData = document.querySelectorAll('.products-data')
const usersData = document.querySelector('.users-data')
const productsCaptionText = document.querySelector('.products-count-text.caption-text')
const usersCaptionText = document.querySelector('.users-count-text.caption-text')
const modalScreen = document.querySelector('.modal-screen')
const modal = modalScreen.querySelector('.modal')
const closeXModalBtn = modalScreen.querySelector('.close-modal')
const cancelModalBtn = modalScreen.querySelector('.cancel')
const modalContent = modalScreen.querySelector('.modal-content')
const submitBtnModal = modalScreen.querySelector('.submit')
const modalHeader = modalScreen.querySelector('.modal-header')
const updateOverlay = document.querySelector('.update-overlay')
const updateAction = document.querySelector('.update-action')
const toast = document.querySelector('.toast')
const toastContent = toast.querySelector('.toast-content')
const process = toast.querySelector('.process')
const pagination = document.querySelector('.pagination')
const themeBtn = document.querySelector('.theme-button')
const toggleMenu = document.querySelector(".toggle-sidebar");

(function () {
  // بررسی اینکه آیا کاربر قبلاً خوش‌آمدگویی را دیده یا نه
  const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');

  if (!hasSeenWelcome) {
    // اگر ندیده، خوش‌آمدگویی را نمایش بده
    document.body.insertAdjacentHTML('afterbegin', `
      <div class="welcome">
        <p style="display: flex; flex-direction: column; align-items: center; justify-content: center">
          <span>
            این پروژه از تمرینات سطح پیشرفته دوره متخصص جاوااسکریپت در سایت سبزلرن است.
کدهای HTML، CSS و بک‌اند توسط استاد آماده شده و دانشجو مسئولیت پیاده‌سازی عملیات مدیریت کاربران و دوره‌ها از طریق API بک‌اند واقعی را بر عهده داشته است، شامل ایجاد، ویرایش و حذف.
<br>
توجه: این پروژه ریسپانسیو نیست و برای نمایش در دسکتاپ طراحی شده است.
          </span>
          <a style="margin-top: 10px" href="https://sabzlearn.ir/lesson/4-31673/" target="_blank">(لینک این قسمت از دوره آموزشی)</a>
        </p>
        <button id="welcome-btn">مشاهده پروژه</button>
      </div>
    `);

    const welcome = document.querySelector('.welcome');
    const welcomeBtn = document.querySelector('#welcome-btn');

    welcomeBtn.addEventListener('click', () => {
      welcome.classList.add('hide-welcome');
      // ثبت در localStorage تا دفعه بعد خوش‌آمدگویی نیاد
      localStorage.setItem('hasSeenWelcome', 'true');
    });
  }
})();


function showMessage(msg,icon){
  Swal.fire({
    title: msg,
    icon: icon
  })
}

function showToast(text,status){
  toastContent.textContent = text
  process.style.width = '0px'
  process.style.transition = 'width 2.5s linear'
  if (status === 'success'){
    toast.classList.add('success')
    toast.classList.remove('failed')
  }else {
    toast.classList.add('failed')
    toast.classList.remove('success')
  }
  toast.classList.remove('hidden')
  process.style.width = '100%'
  process.addEventListener('transitionend', ()=> {
    toast.classList.add('hidden')
    process.style.transition = 'none'
    process.style.width = '0px'
  }, {once: true})
}
function showUpdateOverlay(title){
  updateAction.textContent = title
  updateOverlay.classList.remove('hidden')
}
function hideUpdateOverlay(title){
  updateOverlay.classList.add('hidden')
}
function hideModalScreen(){
  modalScreen.classList.add('hidden')
}
function showErrorOverlay(message){
  errorMessage.textContent = message
  errorOverlay.classList.remove('hidden')
}
function hideStartLoading(){
  startLoader.classList.add('hidden')
}
function siteReload(){
  window.location.reload()
}
async function getAllCourse(){
  const res = await fetch('https://js-cms.iran.liara.run/api/courses')
  if (!res.ok){
    throw new Error('دسترسی به سرور با مشکل واجه شد.')
  }
  const data = await res.json()
  return data
}
async function getAllUsers(){
  const res = await fetch('https://js-cms.iran.liara.run/api/users')
  if (!res.ok){
    throw new Error('دسترسی به سرور با مشکل مواجه شد.')
  }
  const data = await res.json()
  return data
}
function createCourseTableRow(course){
  const newDive = document.createElement('div')
  newDive.className = 'tableRow'
  newDive.innerHTML = `
    <p class="product-title">${course.title}</p>
    <p class="product-price">${course.price.toLocaleString()}</p>
    <p class="product-shortName">${course.registersCount.toLocaleString()}</p>
    <div class="product-manage">
      <button class="edit-btn" data-id="${course._id}" data-title="${course.title}" data-price="${course.price}" data-registerCount="${course.registersCount}">
        <!-- Edit icon -->
        <i class="fas fa-edit"></i>
      </button>
      <button class="remove-btn" data-id="${course._id}">
        <!-- Delete fas icon -->
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  `
  return newDive
}
function setCourseData(){
  productsData.forEach(data => {
    data.textContent = allCourses.length.toLocaleString()
  })
  if (allCourses.length === 0){
    productsCaptionText.innerHTML = 'هنوز دوره ای در وبسایت شما قرار نگرفته است.'
  }
}
function setUsersData(){
  usersData.textContent = allUsers.length.toLocaleString()
  if (allUsers.length === 0){
    if (usersCaptionText){
      usersCaptionText.innerHTML = 'هنوز کاربری در سایت شما ثبت نام نکرده است.'
    }
  }

}
async function deleteCourse(courseId) {
  const res = await fetch(`https://js-cms.iran.liara.run/api/courses/${courseId}`, {
    method: "DELETE"
  });
  if (!res.ok) {
    throw new Error( 'حذف دوره با مشکل مواجه شد.');
  }
  return true;
}
async function updateCourse(id, course) {
  const res = await fetch(`https://js-cms.iran.liara.run/api/courses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(course)
  });

  if (!res.ok) {
    throw new Error('ویرایش دوره با مشکل مواجه شد.');
  }
}

function editCourseHandler(elem){
  const id = elem.dataset.id
  modalHeader.textContent = 'ویرایش دوره'
  modalContent.innerHTML = `
        <input
            type="text"
            class="modal-input course-title"
            placeholder="عنوان دوره را وارد نمائید ..."
            id="product-title"
          />
          <input
            type="text"
            class="modal-input course-price"
            placeholder="قیمت دوره را وارد نمائید ..."
            id="product-price"
          />
          <input
            type="text"
            class="modal-input course-registerCount"
            placeholder="تعداد دانشجو را وارد نمائید ..."
            id="product-shortName"
            />
    `
  const courseTitleInput = modalScreen.querySelector('.course-title')
  const coursePriceInput = modalScreen.querySelector('.course-price')
  const courseRegisterCountInput = modalScreen.querySelector('.course-registerCount')
  courseTitleInput.value = elem.dataset.title
  coursePriceInput.value = elem.dataset.price
  courseRegisterCountInput.value = elem.dataset.registercount
  modalScreen.classList.remove('hidden')
  submitBtnModal.onclick = null
  submitBtnModal.onclick = async () => {
    const courseTitle = modalScreen.querySelector('.course-title').value.trim()
    const coursePrice = modalScreen.querySelector('.course-price').value.trim()
    const courseRegisterCount = modalScreen.querySelector('.course-registerCount').value.trim()
    if (!courseTitle){
      showMessage('عنوان دوره را وارد نمایید.','error')
    }else if (!coursePrice){
      showMessage('قیمت دوره را وارد نمایید.','error')
    }else if (!courseRegisterCount){
      showMessage('تعداد دانشجو را وارد نمایید.','error')
    }else if (isNaN(coursePrice)){
      showMessage('قیمت را با عدد وارد نمایید.','error')
    }else if (isNaN(courseRegisterCount)){
      showMessage('تعداد دانشجو را با عدد وارد نمایید.','error')
    }else {
      const editedCourse = {
        title: courseTitle,
        price: Number(coursePrice),
        category: "فیک",
        registersCount: Number(courseRegisterCount),
        discount: 10,
        desc: "توضیحات فیک دوره"
      }
      hideModalScreen()
      showUpdateOverlay('در حال ویرایش دوره')
      try {
        await updateCourse(id, editedCourse)
        allCourses = await getAllCourse()
        showToast('ویرایش دوره با موفقیت انجام شد', 'success')
        elem.closest('.tableRow').querySelector('.product-title').textContent = courseTitle
        elem.closest('.tableRow').querySelector('.product-price').textContent = Number(coursePrice).toLocaleString()
        elem.closest('.tableRow').querySelector('.product-shortName').textContent = Number(courseRegisterCount).toLocaleString()
        elem.dataset.title = courseTitle
        elem.dataset.price = coursePrice
        elem.dataset.registercount = courseRegisterCount
      }
      catch (err){
        showErrorOverlay('ویرایش دوره با مشکل مواجه شد.')
      }
      finally {
        hideUpdateOverlay()
      }
    }
  }
}
function createNewPaginationBtn(index){
  const newSpan = document.createElement('span')
  newSpan.setAttribute('tabindex', '1')
  newSpan.className = 'page'
  newSpan.textContent = index.toLocaleString()
  return newSpan
}
function resetPagination(arrayLen,showCount){
  const fragmentElem = document.createDocumentFragment()
  pagination.innerHTML = ''
  const btnCount = Math.ceil(arrayLen / showCount)
  if (btnCount > 1){
    for (let i = 0; i < btnCount; i++) {
      fragmentElem.appendChild(createNewPaginationBtn(i+1))
    }
    pagination.appendChild(fragmentElem)
  }
  return btnCount
}
function setActivePaginationBtn(index){
  const allBtn = pagination.querySelectorAll('.page')
  allBtn.forEach(btn => {
    btn.classList.remove('active')
  })
  allBtn[index].classList.add('active')
}
function isValidUsername(username) {
  const regex = /^[A-Za-z][A-Za-z0-9._-]{2,}$/;
  return regex.test(username);
}
function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}
function isExistEmailForCreate(userEmail){
  return allUsers.some(user => user.email === userEmail)
}
function isExistUsernameForCreate(userUsername){
  return allUsers.some(user => user.username === userUsername)
}
async function createCourse(course){
  const res = await fetch('https://js-cms.iran.liara.run/api/courses',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(course)
  })
  if (!res.ok) {
    throw new Error('ایجاد دوره جدید با مشکل مواجه شد.');
  }
}
async function createNewUser(user){
  const res = await fetch('https://js-cms.iran.liara.run/api/users',{
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  if (!res.ok) {
    throw new Error('ایجاد کاربر جدید با مشکل مواجه شد.');
  }
}
async function editUser(user,id){
  const res = await fetch(`https://js-cms.iran.liara.run/api/users/${id}`,{
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  if (!res.ok) {
    throw new Error('ایجاد کاربر جدید با مشکل مواجه شد.');
  }
}
async function deleteUser(id){
  const res = await fetch(`https://js-cms.iran.liara.run/api/users/${id}`,{
    method: "DELETE"
  })
  if (!res.ok){
    throw new Error('حذف کاربر با مشکل مواجه شد')
  }
}
function isExistUsernameForEdit(username,id){
  return allUsers.some(user => {
    if (user._id !== id){
      return user.username === username
    }
  })
}
function isExistEmailForEdit(email,id){
  return allUsers.some(user => {
    if (user._id !== id){
      return user.email === email
    }
  })
}
toggleMenu.addEventListener("click", function () {
  document.querySelector(".sidebar").classList.toggle("open");
});
retryBtn.addEventListener('click',siteReload)
cancelModalBtn.addEventListener('click',hideModalScreen)
closeXModalBtn.addEventListener('click',hideModalScreen)
modalScreen.addEventListener('click', event=> {
  if (!event.target.closest('.modal')){
    if (!modalScreen.classList.contains('hidden')){
      modalScreen.classList.add('hidden')
    }
  }
})
themeBtn.addEventListener('click', ()=> {
  const documentElem = document.documentElement
  const currentTheme = documentElem.className
  if (currentTheme === 'dark'){
    themeBtn.querySelector('i').className = 'fas fa-sun'
    documentElem.classList.remove('dark')
    localStorage.setItem('localTheme','light')
  }else {
    themeBtn.querySelector('i').className = 'fas fa-moon'
    documentElem.classList.add('dark')
    localStorage.setItem('localTheme','dark')
  }
})
document.documentElement.addEventListener('keyup', event => {
  if(event.key === 'Escape'){
    hideModalScreen()
  }
})