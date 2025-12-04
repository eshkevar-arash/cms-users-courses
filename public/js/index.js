const latestCoursesCount = 5
const latestUsersCount = 5
const latestUserElem = document.querySelector('.latest-users')
function renderLatestCourses(){
    const fragmentElem = document.createDocumentFragment()
    tableBody.innerHTML = ''
    const latestCourses = allCourses.slice(-latestCoursesCount).reverse()
    latestCourses.forEach(course => {
        fragmentElem.appendChild(createCourseTableRow(course))
    })
    tableBody.appendChild(fragmentElem)
}
function renderLatestUsers(){
    const latestUsers = allUsers.slice(-latestUsersCount).reverse()
    latestUsers.forEach(user => {
        latestUserElem.insertAdjacentHTML('beforeend', `
            <article>
              <!-- user icon -->
              <span class="icon-card">
                <i class="fa-solid fa-user"></i>
              </span>
              <!-- user data -->
              <div>
                <p class="user-name">${user.firstname} ${user.lastname}</p>
                <p class="user-email">${user.email}</p>
              </div>
            </article>
        `)
    })
}
async function initApp(){
    const savedTheme = localStorage.getItem('localTheme')
    if (savedTheme !== null){
        if (savedTheme === 'dark'){
            document.documentElement.className = 'dark'
            themeBtn.querySelector('i').className = 'fas fa-moon'
        }
    }
    try{
        [allCourses,allUsers] = await Promise.all([
            getAllCourse(),
            getAllUsers()
        ])
        renderLatestCourses()
        setCourseData()
        renderLatestUsers()
        setUsersData()
    }
    catch (err){
        showErrorOverlay('دسترسی به سرور با مشکل مواجه شد.')
    }
    finally {
        hideStartLoading()
    }
}
function deleteCourseHandler(id){
    modalHeader.textContent = 'حذف محصول'
    modalContent.innerHTML = `<p class="remove-text">آیا از حذف این دوره اطمینان دارید؟</p>`
    modalScreen.classList.remove('hidden')
    submitBtnModal.onclick = null
    submitBtnModal.onclick = async () => {
        hideModalScreen()
        showUpdateOverlay('در حال حذف دوره')
        try {
            await deleteCourse(id)
            allCourses = await getAllCourse()
            showToast('حذف دوره با موفقیت انجام شد', 'success')
            renderLatestCourses()
            setCourseData()
        }
        catch (err){
            showErrorOverlay('حذف دوره با مشکل مواجه شد.')
        }
        finally {
            hideUpdateOverlay()
        }
    };
}

tableBody.addEventListener('click', event => {
    const targetDeleteCourseBtn = event.target.closest('.remove-btn')
    const targetEditCourseBtn = event.target.closest('.edit-btn')
    if (targetDeleteCourseBtn){
        const targetId = targetDeleteCourseBtn.dataset.id
        deleteCourseHandler(targetId)
    }else if (targetEditCourseBtn){
        editCourseHandler(targetEditCourseBtn)
    }
})
document.addEventListener('DOMContentLoaded', async () => {
    await initApp()
});
