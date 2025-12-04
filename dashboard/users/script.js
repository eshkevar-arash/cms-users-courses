const showUsersCount = 5
const createUserBtn = document.querySelector('#create-user')
function createUserTableRow(user){
    const newDiv = document.createElement('div')
    newDiv.className = 'tableRow'
    newDiv.innerHTML = `
      <p class="user-fullName">${user.firstname} ${user.lastname}</p>
      <p class="user-username">${user.username}</p>
      <p class="user-email">${user.email}</p>
      <p class="user-password user-city">${user.city}</p>
      <div class="product-manage">
        <button class="edit-btn" data-id="${user._id}" data-firstname="${user.firstname}" data-lastname="${user.lastname}" data-username="${user.username}" data-email="${user.email}" data-city="${user.city}">
          <!-- Edit icon -->
          <i class="fas fa-edit"></i>
        </button>
        <button class="remove-btn" data-id="${user._id}">
          <!-- Ban icon -->
          <i class="fas fa-ban"></i>
        </button>
      </div>
    `
    return newDiv
}
function renderUsers(start,len){
    tableBody.innerHTML = ''
    const fragmentElem = document.createDocumentFragment()
    const end = start + len
    for (let i = start; i < end; i++) {
        if (allUsers[i]){
            fragmentElem.appendChild(createUserTableRow(allUsers[i]))
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
        allUsers = await getAllUsers()
        renderUsers(0,showUsersCount)
        const allPaginationBtnCount = resetPagination(allUsers.length,showUsersCount)
        if (allPaginationBtnCount > 1){
            setActivePaginationBtn(0)
        }
        setUsersData()
    }
    catch (err){
        showErrorOverlay('دسترسی به سرور با مشکل مواجه شد.')
    }
    finally {
        hideStartLoading()
    }
}
function createNrwUserHandler(){
    modalHeader.textContent = 'ایجاد کاربر جدید'
    modalContent.innerHTML = `
        <input
            type="text"
            class="modal-input modal-input-firstName"
            placeholder="نام را وارد نمائید ..."
            id="user-fullName"
          />
          <input
            type="text"
            class="modal-input modal-input-lastName"
            placeholder="نام خانوادگی را وارد نمائید ..."
            id="user-lastName"
          />
          <input
            type="text"
            class="modal-input modal-input-username"
            id="user-username"
            placeholder="نام کاربری را وارد نمائید ..."
          />
          <input
            type="text"
            class="modal-input modal-input-email"
            id="user-email"
            placeholder="ایمیل را وارد نمائید ..."
          />
          <input
          type="text"
          class="modal-input modal-input-city"
          id="user-password"
          placeholder="شهر را وارد نمائید ..."
        />
    `
    modalScreen.classList.remove('hidden')
    submitBtnModal.onclick = null
    submitBtnModal.onclick = async () => {
        const firstname = modalScreen.querySelector('.modal-input-firstName').value.trim()
        const lastname = modalScreen.querySelector('.modal-input-lastName').value.trim()
        const username = modalScreen.querySelector('.modal-input-username').value.trim()
        const email = modalScreen.querySelector('.modal-input-email').value.trim()
        const city = modalScreen.querySelector('.modal-input-city').value.trim()
        if (!firstname){
            showMessage('نام را وارد نمایید','error')
        }else if (!lastname){
            showMessage('نام خانوادگی را وارد نمایید','error')
        }else if (!username){
            showMessage('نام کاربری را وارد نمایید','error')
        }else if (!email){
            showMessage('ایمیل را وارد نمایید','error')
        }else if (!city){
            showMessage('شهر را وارد نمایید','error')
        }else if (!isValidUsername(username)){
            showMessage('نام کاربری باید حداقل ۳ کاراکتر باشد و با حرف انگلیسی شروع شود. کاراکترهای حرف، عدد، نقطه (.), خط تیره (-) و آندرلاین (_) مجاز هستند.','error')
        }else if (!isValidEmail(email)){
            showMessage('ایمیل نا معتبر است','error')
        }else if (isExistUsernameForCreate(username)){
            showMessage('این نام کاربری قبلا ثبت نام شد.','error')
        }else if (isExistEmailForCreate(email)){
            showMessage('این ایمیل قبلا ثبت نام شد','error')
        }else {
            const newUser = {
                firstname,
                lastname,
                username,
                email,
                city,
                age: 30
            }
            hideModalScreen()
            showUpdateOverlay('در حال ایجاد کاربر جدید')
            try {
               await createNewUser(newUser)
                allUsers = await getAllUsers()
                setUsersData()
                const allPaginationBtnCount = resetPagination(allUsers.length,showUsersCount)
                const index = allPaginationBtnCount - 1
                const start = index * showUsersCount
                renderUsers(start,showUsersCount)
                if (allPaginationBtnCount > 1){
                    setActivePaginationBtn(index)
                }
                showToast('ایجاد کاربر جدید با موفقیت انجام شد', 'success')
            }
            catch (err){
                showErrorOverlay('ایجاد کاربر جدید با مشکل مواجه شد.')
            }
            finally {
                hideUpdateOverlay()
            }
        }
    }
}
function deleteUserHandler(id){
    modalHeader.textContent = 'حذف کاربر'
    modalContent.innerHTML = `<p class="remove-text">آیا از حذف این کاربر اطمینان دارید؟</p>`
    modalScreen.classList.remove('hidden')
    submitBtnModal.onclick = null
    submitBtnModal.onclick = async () => {
        hideModalScreen()
        showUpdateOverlay('در حال حذف کاربر')
        try {
            await deleteUser(id)
            allUsers = await getAllUsers()
            renderUsers(0, showUsersCount)
            setUsersData()
            const allPaginationBtnCount = resetPagination(allUsers.length,showUsersCount)
            if (allPaginationBtnCount > 1){
                setActivePaginationBtn(0)
            }
            showToast('حذف کاربر با موفقیت انجام شد', 'success')
        }
        catch (err){
            showErrorOverlay('حذف کاربر با مشکل مواجه شد.')
        }
        finally {
            hideUpdateOverlay()
        }
    };
}
function EditUserHandler(btn){
    modalHeader.textContent = 'ویرایش کاربر'
    modalContent.innerHTML = `
        <input
            type="text"
            class="modal-input modal-input-firstName"
            placeholder="نام را وارد نمائید ..."
            id="user-fullName"
          />
          <input
            type="text"
            class="modal-input modal-input-lastName"
            placeholder="نام خانوادگی را وارد نمائید ..."
            id="user-lastName"
          />
          <input
            type="text"
            class="modal-input modal-input-username"
            id="user-username"
            placeholder="نام کاربری را وارد نمائید ..."
          />
          <input
            type="text"
            class="modal-input modal-input-email"
            id="user-email"
            placeholder="ایمیل را وارد نمائید ..."
          />
          <input
          type="text"
          class="modal-input modal-input-city"
          id="user-password"
          placeholder="شهر را وارد نمائید ..."
        />
    `
    const firstnameInput = modalScreen.querySelector('.modal-input-firstName')
    const lastnameInput = modalScreen.querySelector('.modal-input-lastName')
    const usernameInput = modalScreen.querySelector('.modal-input-username')
    const emailInput = modalScreen.querySelector('.modal-input-email')
    const cityInput = modalScreen.querySelector('.modal-input-city')
    firstnameInput.value = btn.dataset.firstname
    lastnameInput.value = btn.dataset.lastname
    usernameInput.value = btn.dataset.username
    emailInput.value = btn.dataset.email
    cityInput.value = btn.dataset.city
    modalScreen.classList.remove('hidden')
    submitBtnModal.onclick = null
    submitBtnModal.onclick = async () => {
        const id = btn.dataset.id
        const firstname = firstnameInput.value.trim()
        const lastname = lastnameInput.value.trim()
        const username = usernameInput.value.trim()
        const email = emailInput.value.trim()
        const city = cityInput.value.trim()
        if (!firstname){
            showMessage('نام را وارد نمایید','error')
        }else if (!lastname){
            showMessage('نام خانوادگی را وارد نمایید','error')
        }else if (!username){
            showMessage('نام کاربری را وارد نمایید','error')
        }else if (!email){
            showMessage('ایمیل را وارد نمایید','error')
        }else if (!city){
            showMessage('شهر را وارد نمایید','error')
        }else if (!isValidUsername(username)){
            showMessage('نام کاربری باید حداقل ۳ کاراکتر باشد و با حرف انگلیسی شروع شود. کاراکترهای حرف، عدد، نقطه (.), خط تیره (-) و آندرلاین (_) مجاز هستند.','error')
        }else if (!isValidEmail(email)){
            showMessage('ایمیل نا معتبر است','error')
        }else if (isExistUsernameForEdit(username, id)){
            showMessage('این نام کاربری قبلا ثبت نام شد.','error')
        }else if (isExistEmailForEdit(email, id)){
            showMessage('این ایمیل قبلا ثبت نام شد','error')
        }else {
            const newUser = {
                firstname,
                lastname,
                username,
                email,
                city,
                age: 30
            }
            hideModalScreen()
            showUpdateOverlay('در حال ویرایش کاربر')
            try {
                await editUser(newUser,id)
                allUsers = await getAllUsers()
                console.log(allUsers)
                showToast('ویرایش با موفقیت انجام شد', 'success')
                btn.closest('.tableRow').querySelector('.user-fullName').textContent = `${firstname} ${lastname}`
                btn.closest('.tableRow').querySelector('.user-username').textContent = username
                btn.closest('.tableRow').querySelector('.user-email').textContent = email
                btn.closest('.tableRow').querySelector('.user-city').textContent = city
                btn.dataset.firstname = firstname
                btn.dataset.lastname = lastname
                btn.dataset.username = username
                btn.dataset.email = email
                btn.dataset.city = city
            }
            catch (err){
                showErrorOverlay('ویرایش کاربر با مشکل مواجه شد.')
            }
            finally {
                hideUpdateOverlay()
            }
        }
    }
}
createUserBtn.addEventListener('click',createNrwUserHandler)
pagination.addEventListener('click', event => {
    const targetBtn = event.target.closest('.page')
    if (targetBtn){
        const targetIndex = Number(targetBtn.textContent) - 1
        setActivePaginationBtn(targetIndex)
        const start = targetIndex * showUsersCount
        renderUsers(start,showUsersCount)
    }
})
tableBody.addEventListener('click', event => {
    const targetDeleteUserBtn = event.target.closest('.remove-btn')
    const targetEditUserBtn = event.target.closest('.edit-btn')
    if (targetDeleteUserBtn){
        const targetId = targetDeleteUserBtn.dataset.id
        deleteUserHandler(targetId)
    }else if (targetEditUserBtn){
        EditUserHandler(targetEditUserBtn)
    }
})
document.addEventListener('DOMContentLoaded', async () => {
    await initApp()
});