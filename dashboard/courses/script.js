const showCoursesCount = 5
const createCourseBtn = document.querySelector('#create-product')
function renderCourses(start, len){
    tableBody.innerHTML = ''
    const fragmentElem = document.createDocumentFragment()
    const end = start + len
    for (let i = start; i < end; i++) {
        if (allCourses[i]){
            fragmentElem.appendChild(createCourseTableRow(allCourses[i]))
        }
    }
    tableBody.appendChild(fragmentElem)
}

async function initApp(){
    const savedTheme = localStorage.getItem('localTheme')
    if (savedTheme !== null){
        if (savedTheme === 'dark'){
            document.documentElement.className = 'dark'
            themeBtn.querySelector('i').className = 'fas fa-moon'
        }
    }
    try {
        allCourses = await getAllCourse()
        renderCourses(0, showCoursesCount)
        setCourseData()
        const allPaginationBtnCount = resetPagination(allCourses.length,showCoursesCount)
        if (allPaginationBtnCount > 1){
            setActivePaginationBtn(0)
        }
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
            renderCourses(0, showCoursesCount)
            setCourseData()
            const allPaginationBtnCount = resetPagination(allCourses.length,showCoursesCount)
            if (allPaginationBtnCount > 1){
                setActivePaginationBtn(0)
            }
            showToast('حذف دوره با موفقیت انجام شد', 'success')
        }
        catch (err){
            showErrorOverlay('حذف دوره با مشکل مواجه شد.')
        }
        finally {
            hideUpdateOverlay()
        }
    };
}
function createNewCourseHandler(){
    modalHeader.textContent = 'ایجاد دوره جدید'
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
            const newCourse = {
                title: courseTitle,
                price: Number(coursePrice),
                category: "فیک",
                registersCount: Number(courseRegisterCount),
                discount: 10,
                desc: "توضیحات فیک دوره"
            }
            hideModalScreen()
            showUpdateOverlay('در حال ایجاد دوره جدید')
            try {
                await createCourse(newCourse)
                allCourses = await getAllCourse()
                setCourseData()
                const allPaginationBtnCount = resetPagination(allCourses.length,showCoursesCount)
                const index = allPaginationBtnCount - 1
                const start = index * showCoursesCount
                renderCourses(start,showCoursesCount)
                if (allPaginationBtnCount > 1){
                    setActivePaginationBtn(index)
                }
                showToast('ایجاد دوره جدید با موفقیت انجام شد', 'success')
            }
            catch (err){
                showErrorOverlay('ایجاد دوره جدید با مشکل مواجه شد.')
            }
            finally {
                hideUpdateOverlay()
            }
        }
    }
}








createCourseBtn.addEventListener('click', createNewCourseHandler)

pagination.addEventListener('click', event => {
    const targetBtn = event.target.closest('.page')
    if (targetBtn){
        const targetIndex = Number(targetBtn.textContent) - 1
        setActivePaginationBtn(targetIndex)
        const start = targetIndex * showCoursesCount
        renderCourses(start,showCoursesCount)
    }
})

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