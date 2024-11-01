document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const contactsTableBody = document.getElementById('contactsTable').getElementsByTagName('tbody')[0];
    const contactCount = document.getElementById('contactCount');
    const filterButtons = document.querySelectorAll('.filter-button');
    const allContactsButton = document.querySelector('.filter-button[data-filter="all"]');
    const searchButton = document.getElementById('searchButton');
    const searchTypeSelect = document.getElementById('searchType');
    const searchInput = document.getElementById('search');
    let allContacts = [];
    let currentFilter = 'all';

    // 设置“全部联系人”按钮为蓝色
    allContactsButton.classList.add('active');

    // 更新按钮样式
    const updateButtonStyles = () => {
        filterButtons.forEach(button => button.classList.remove('active'));
        if (currentFilter === 'all') {
            allContactsButton.classList.add('active');
        }
    };

    // 限制输入长度
    const maxInputLength = 20;
    const checkInputLength = (input) => {
        if (input.value.length > maxInputLength) {
            alert(`输入内容不能超过 ${maxInputLength} 个字符`);
            input.value = input.value.slice(0, maxInputLength);
        }
    };
    document.getElementById('name').addEventListener('input', function () { checkInputLength(this); });
    document.getElementById('phone').addEventListener('input', function () { checkInputLength(this); });
    document.getElementById('email').addEventListener('input', function () { checkInputLength(this); });

    // 获取联系人列表
    const fetchContacts = async () => {
        const response = await fetch('http://120.27.239.212:5000/api/contacts');
        allContacts = await response.json();
        renderContacts(allContacts);
    };

    // 渲染联系人到表格
const renderContacts = (contacts) => {
    // 对联系人按姓名排序（A-Z）
    contacts.sort((a, b) => a.name.localeCompare(b.name));

    // 清空现有的表格数据
    contactsTableBody.innerHTML = '';
    contactCount.textContent = contacts.length;

    // 遍历排序后的联系人并添加到表格
    contacts.forEach((contact) => {
        const row = contactsTableBody.insertRow();
        row.insertCell().textContent = contact.name;
        row.insertCell().textContent = contact.phone_number;
        row.insertCell().textContent = contact.email;

        const operationCell = row.insertCell();
        operationCell.classList.add('operation-cell');

        const favoriteButton = document.createElement('button');
        favoriteButton.textContent = contact.is_favorite ? '取消收藏' : '收藏';
        favoriteButton.classList.add('favorite-btn');
        favoriteButton.onclick = function () {
            if (confirm(`确认${contact.is_favorite ? '取消收藏' : '收藏'}该联系人吗？`)) {
                toggleFavorite(contact);
            }
        };
        operationCell.appendChild(favoriteButton);

        const editButton = document.createElement('button');
        editButton.textContent = '编辑';
        editButton.classList.add('edit-btn');
        editButton.onclick = function () { editContact(contact, row); };
        operationCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '删除';
        deleteButton.classList.add('delete-btn');
        deleteButton.onclick = function () {
            if (confirm('确认删除该联系人吗？')) {
                deleteContact(contact);
            }
        };
        operationCell.appendChild(deleteButton);
    });
};

    // 添加联系人
    contactForm.onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        
        if ([name, phone, email].some(field => field.length > maxInputLength)) {
            alert(`输入内容不能超过 ${maxInputLength} 个字符`);
            return;
        }

        const newContact = { name, phone_number: phone, email, is_favorite: false };
        await fetch('http://120.27.239.212:5000/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newContact),
        });
        fetchContacts();
        contactForm.reset();
    };

    // 删除联系人
    const deleteContact = async (contact) => {
        await fetch(`http://120.27.239.212:5000/api/contacts/${contact.id}`, { method: 'DELETE' });
        fetchContacts();
    };

    // 切换收藏状态
    const toggleFavorite = async (contact) => {
        contact.is_favorite = !contact.is_favorite;
        await fetch(`http://120.27.239.212:5000/api/contacts/${contact.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact),
        });
        fetchContacts();
    };

    // 编辑联系人
    const editContact = (contact, row) => {
        const cells = row.cells;
        cells[0].innerHTML = `<input type="text" value="${contact.name}" class="edit-input" />`;
        cells[1].innerHTML = `<input type="text" value="${contact.phone_number}" class="edit-input" />`;
        cells[2].innerHTML = `<input type="email" value="${contact.email}" class="edit-input" />`;

        const saveButton = document.createElement('button');
        saveButton.textContent = '确认';
        saveButton.classList.add('save-btn');
        saveButton.onclick = async function () {
            contact.name = cells[0].firstChild.value;
            contact.phone_number = cells[1].firstChild.value;
            contact.email = cells[2].firstChild.value;

            await fetch(`http://120.27.239.212:5000/api/contacts/${contact.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact),
            });
            fetchContacts();
        };

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.classList.add('cancel-btn');
        cancelButton.onclick = function () {
            fetchContacts();
        };

        const operationCell = row.cells[3];
        operationCell.innerHTML = '';
        operationCell.appendChild(saveButton);
        operationCell.appendChild(cancelButton);
    };

    // 查找联系人
    searchButton.onclick = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const searchType = searchTypeSelect.value;

        const filteredContacts = allContacts.filter(contact => {
            const value = searchType === 'name' ? contact.name : searchType === 'phone' ? contact.phone_number : contact.email;
            return value.toLowerCase().includes(searchTerm);
        });

        renderContacts(filteredContacts);
        allContactsButton.classList.remove('active');
        searchInput.value = '';  // 清空搜索输入框
    };

    // 过滤联系人列表
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.getAttribute('data-filter');
            renderContacts(currentFilter === 'favorite' ? allContacts.filter(contact => contact.is_favorite) : allContacts);
        });
    });

    // 初始化获取联系人列表
    fetchContacts();
});
