document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.scroll-up').onclick = scrollToTop;
    
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
  
    const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById("newreminderDateTime").setAttribute("min", minDateTime);
    // document.getElementById("editreminderDatetime").setAttribute("min", minDateTime);
    document.getElementById("repeatDateTime").setAttribute("min", minDateTime);
    const closeBtns = document.getElementsByClassName("close");
    const newreminderModal = document.getElementById("Newreminder");
    const basketModal = document.getElementById("Basket");
    const openNewreminderBtns = document.getElementsByClassName("openNewreminderForm");
    const openBasketBtns = document.getElementsByClassName("openBasketForm");
    const editreminderModal = document.getElementById("Editreminder");
    const remindersTable = document.getElementById("remindersTable").getElementsByTagName('tbody')[0];
    const completedTasksTable = document.getElementById("completedTasksTable").getElementsByTagName('tbody')[0];
    const repeatReminderModal = document.getElementById("Repeatreminder");
    const deletereminderModal = document.getElementById("Deletereminder");
  
    let editIndex = -1;
  
    Array.from(closeBtns).forEach(button => {
        button.onclick = function () {
            this.parentElement.parentElement.style.display = "none";
        }
    });
  
    Array.from(openBasketBtns).forEach(button => {
        button.onclick = function () {
            basketModal.style.display = "block";
        }
    });
  
    Array.from(openNewreminderBtns).forEach(button => {
        button.onclick = function () {
            newreminderModal.style.display = "block";
            resetNewReminderForm();
        }
    });
  
    window.onclick = function (event) {
        if (event.target == newreminderModal || event.target == editreminderModal || event.target == repeatReminderModal || event.target == deletereminderModal || event.target == basketModal) {
            event.target.style.display = "none";
        }
    }
  
    function resetNewReminderForm() {
        document.getElementById("NewreminderForm") .reset(); 

        document.getElementById("newremindersendMethod").selectedIndex = 0; 
    }
  
    document.getElementById("NewreminderForm").onsubmit = function (event) {
        event.preventDefault();
        const newremindertitle = document.getElementById("newreminderTitle").value;
        const newremindertext = document.getElementById("newreminderText").value;
        const newreminderdatetime = document.getElementById("newreminderDateTime").value;
        const newremindersendmethod = document.getElementById("newremindersendMethod").value;
        const newreminderEmail = "kir@gmail.com";
        const newremindertelegramId = "5252387353";
        const newReminder = {
            id: Date.now().toString(),
            title: newremindertitle,
            text: newremindertext,
            datetime: newreminderdatetime,
            type: newremindersendmethod,
            destination: newremindersendmethod === "email" ? newreminderEmail : newremindertelegramId,
            is_active: true
        };
  
        const newRow = remindersTable.insertRow();
        newRow.insertCell(0).innerText = newremindertitle;
        newRow.insertCell(1).innerText = newremindertext;
        newRow.insertCell(2).innerText = newreminderdatetime;
        newRow.insertCell(3).innerText = newremindersendmethod;
        newRow.insertCell(4).innerText = newremindersendmethod === "email" ? newreminderEmail : newremindertelegramId;
  
        newRow.setAttribute('data-id', newReminder.id);
  
        const actionsCell = newRow.insertCell(5);
        actionsCell.innerHTML = `
            <button class="edit" style="width: 100px; margin:0;">Редактировать</button>
            <button class="delete" style="width: 100px; margin:0;">Удалить</button>
            <button class="complete" style="width: 100px; margin:0;">Выполнено</button>
        `;
  
        actionsCell.querySelector(".edit").onclick = () => openEditModal(newRow);
        actionsCell.querySelector(".delete").onclick = () => deleteReminder(newRow);
        actionsCell.querySelector(".complete").onclick = () => completeReminder(newRow);
  
        newreminderModal.style.display = "none";
        resetNewReminderForm();
    };

    function openEditModal(row) {
        editIndex = row.rowIndex - 1; 
        const cells = row.cells;
        document.getElementById("editreminderTitle").value = cells[0].innerText;
        document.getElementById("editreminderText").value = cells[1].innerText;
        document.getElementById("editreminderDateTime").value = cells[2].innerText;
        document.getElementById("editremindersendMethod").value = cells[3].innerText;
        
        const reminderId = row.getAttribute('data-id');
  
        editreminderModal.style.display = "block";
    }
    document.getElementById("EditreminderForm").onsubmit = function (event) {
        event.preventDefault();
        const editreminderMethod = document.getElementById("editremindersendMethod").value;
        const editreminderEmail = "kir@gmail.com";
        const editreminderTelegramId = "5252387353";
        const editreminderTitle = document.getElementById("editreminderTitle").value;
        const editreminderText = document.getElementById("editreminderText").value;
        const editreminderDateTime = document.getElementById("editreminderDateTime").value;
  
        const row = remindersTable.rows[editIndex];
        const reminderId = row.getAttribute('data-id');

        row.cells[0].innerText = editreminderTitle;
        row.cells[1].innerText = editreminderText;
        row.cells[2].innerText = editreminderDateTime;
        row.cells[3].innerText = editreminderMethod;
        row.cells[4].innerText = editreminderMethod === "email" ? editreminderEmail : editreminderTelegramId;
  
        editreminderModal.style.display = "none";
    };
  
    function completeReminder(row) {
        const reminderId = row.getAttribute('data-id');
  
        const completedRow = completedTasksTable.insertRow();
        completedRow.insertCell(0).innerText = row.cells[0].innerText;
        completedRow.insertCell(1).innerText = row.cells[1].innerText;
        completedRow.insertCell(2).innerText = row.cells[2].innerText;
        completedRow.insertCell(3).innerText = row.cells[3].innerText;
        completedRow.insertCell(4).innerText = row.cells[4].innerText;
  
        const actionsCell = completedRow.insertCell(5);
        actionsCell.innerHTML = `
            <button class="delete">Удалить</button>
            <button class="repeat">Повторить</button>
        `;
  
        actionsCell.querySelector(".delete").onclick = () => deleteReminder(completedRow);
        actionsCell.querySelector(".repeat").onclick = () => openRepeatModal(completedRow);
  
        remindersTable.deleteRow(row.rowIndex - 1);
    }
  
    function deleteReminder(row) {
        deletereminderModal.style.display = "block";
  
        const reminderId = row.getAttribute('data-id');
  
        document.getElementById("DeletereminderForm").onsubmit = function (event) {
            event.preventDefault();


            const deletedRow = document.createElement('tr');
            deletedRow.insertCell(0).innerText = row.cells[0].innerText;
            deletedRow.insertCell(1).innerText = row.cells[1].innerText;
            deletedRow.insertCell(2).innerText = row.cells[2].innerText;
            deletedRow.insertCell(3).innerText = row.cells[3].innerText;
            deletedRow.insertCell(4).innerText = row.cells[4].innerText;
  
            deletedRow.setAttribute('data-id', reminderId);
  
            const actionsCell = deletedRow.insertCell(5);
            actionsCell.innerHTML = `
                <button class="restore">Восстановить</button>
                <button class="delete">Удалить</button>
            `;
  
            actionsCell.querySelector(".restore").onclick = () => restoreReminder(deletedRow);
            actionsCell.querySelector(".delete").onclick = () => {
                permanentDeleteReminder(reminderId);
                deletedRow.remove();
            };
  
            document.querySelector('#deletedRemindersTable tbody').appendChild(deletedRow);
            row.remove();
            deletereminderModal.style.display = "none";
        };
    }
  
    function restoreReminder(deletedRow) {
        const parentTable = deletedRow.closest('table');

        const restoredRow = document.createElement('tr');
        restoredRow.insertCell(0).innerText = deletedRow.cells[0].innerText;
        restoredRow.insertCell(1).innerText = deletedRow.cells[1].innerText;
        restoredRow.insertCell(2).innerText = deletedRow.cells[2].innerText;
        restoredRow.insertCell(3).innerText = deletedRow.cells[3].innerText;
        restoredRow.insertCell(4).innerText = deletedRow.cells[4].innerText;
  
        const actionsCell = restoredRow.insertCell(5);
        if (parentTable.id === 'deletedRemindersTable') {
            actionsCell.innerHTML = `
                <button class="edit" style="width: 100px; margin:0;">Редактировать</button>
                <button class="delete" style="width: 100px; margin:0;">Удалить</button>
                <button class="complete" style="width: 100px; margin:0;">Выполнено</button>
            `;
  
            actionsCell.querySelector(".edit").onclick = () => openEditModal(restoredRow);
            actionsCell.querySelector(".delete").onclick = () => deleteReminder(restoredRow);
            actionsCell.querySelector(".complete").onclick = () => completeReminder(restoredRow);
  
        } else if (parentTable.id === 'deletedCompletedTasksTable') {
            actionsCell.innerHTML = `
                <button class="delete">Удалить</button>
                <button class="repeat">Повторить</button>
            `;

            actionsCell.querySelector(".delete").onclick = () => deleteReminder(restoredRow);
            actionsCell.querySelector(".repeat").onclick = () => openRepeatModal(restoredRow);
        }

        if (parentTable.id === 'deletedRemindersTable') {
            document.querySelector('#remindersTable tbody').appendChild(restoredRow);
        } else if (parentTable.id === 'deletedCompletedTasksTable') {
            document.querySelector('#completedTasksTable tbody').appendChild(restoredRow);
        }
  
        deletedRow.remove();
    }
  
    document.getElementById("clearBasket").onclick = function() {
        fetch('/reminders', {
            method: 'DELETE'
        })
        .then(response => response.text())
        const reminderBasket = document.querySelector('#BasketForm table:nth-of-type(1) tbody');
        const completedBasket = document.querySelector('#BasketForm table:nth-of-type(2) tbody');
  
        while (reminderBasket.firstChild) {
            reminderBasket.removeChild(reminderBasket.firstChild);
        }
  
        while (completedBasket.firstChild) {
            completedBasket.removeChild(completedBasket.firstChild);
        }
    };
  
    function openRepeatModal(row) {

        document.getElementById("repeatDateTime").value = row.cells[2].innerText; 
        Repeatreminder.style.display = "block";

        const repeatSendMethod = row.cells[3].innerText;
        const repeatTelegramId = row.cells[4].innerText;
  
        document.getElementById("RepeatreminderForm").onsubmit = function (event) {
            event.preventDefault();
            const repeatDateTime = document.getElementById("repeatDateTime").value;
  
            const newRow = remindersTable.insertRow();
            newRow.insertCell(0).innerText = row.cells[0].innerText;
            newRow.insertCell(1).innerText = row.cells[1].innerText;
            newRow.insertCell(2).innerText = repeatDateTime;
            newRow.insertCell(3).innerText = repeatSendMethod;
            newRow.insertCell(4).innerText = repeatTelegramId;
  
            const actionsCell = newRow.insertCell(5);
            actionsCell.innerHTML = `
                <button class="edit" style="width: 100px; margin:0;">Редактировать</button>
                <button class="delete" style="width: 100px; margin:0;">Удалить</button>
                <button class="complete" style="width: 100px; margin:0;">Выполнено</button>
            `;
  
            actionsCell.querySelector(".edit").onclick = () => openEditModal(newRow);
            actionsCell.querySelector(".delete").onclick = () => deleteReminder(newRow);
            actionsCell.querySelector(".complete").onclick = () => completeReminder(newRow);
  
            Repeatreminder.style.display = "none";
            completedTasksTable.deleteRow(row.rowIndex - 1);
        };
    }
  
  document.addEventListener('DOMContentLoaded', function () {
    const remindersTable = document.getElementById("remindersTable").getElementsByTagName('tbody')[0];
    const sortSelect = document.getElementById('sortSelect');
  
    sortSelect.addEventListener('change', function() {
        const sortBy = this.value;
        const rows = Array.from(remindersTable.rows);
  
        rows.sort((a, b) => {
            const cellA = sortBy === 'time' ? new Date(a.cells[2].innerText) : a.cells[0].innerText.toLowerCase();
            const cellB = sortBy === 'time' ? new Date(b.cells[2].innerText) : b.cells[0].innerText.toLowerCase();
  
            return cellA < cellB ? -1 : cellA > cellB ? 1 : 0;
        });

        remindersTable.innerHTML = '';
        rows.forEach(row => remindersTable.appendChild(row));
    });
   });
  });
  