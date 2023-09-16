document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("taskForm");
    const taskEntryTable = document.getElementById("taskEntryTable");
    const badListTable = document.getElementById("badListTable");
    const saveInfo = document.getElementById("saveInfo");
    const totalHrsInfo = document.getElementById("totalHrsInfo");

    let totalHrsAllocated = 0;
    let totalHrsSavedInBadList = 0;

    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const taskName = event.target.task.value.trim();
        const hours = parseInt(event.target.hr.value);

        if (!taskName || isNaN(hours) || hours < 1 || hours > 168) {
            alert("Please enter a valid task and hours (1-168).");
            return;
        }

        if (totalHrsAllocated + hours > 168) {
            alert("Total hours allocated cannot exceed 168 hours.");
            return;
        }

        totalHrsAllocated += hours;
        totalHrsInfo.textContent = `Total hrs per week allocated = ${totalHrsAllocated}hr`;

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${taskName}</td>
            <td>${hours}hr</td>
            <td>
                <button class="btn btn-danger btn-sm delete-task">Delete</button>
                <button class="btn btn-warning btn-sm move-to-bad-list">Move to Bad List</button>
            </td>
        `;

        taskEntryTable.appendChild(newRow);

        // Clear form fields
        event.target.task.value = "";
        event.target.hr.value = "";
    });

    function updateSavedHoursInBadList() {
        const badListRows = badListTable.querySelectorAll("tr");
        let savedHours = 0;

        badListRows.forEach((row) => {
            const hours = parseInt(row.children[1].textContent);
            savedHours += hours;
        });

        totalHrsSavedInBadList = savedHours;
        saveInfo.textContent = `You could have saved = ${totalHrsSavedInBadList}hr`;
    }

    // Event delegation for Delete and Move to Bad List buttons in Task Entry List
    taskEntryTable.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-task")) {
            const row = event.target.closest("tr");
            const hours = parseInt(row.children[1].textContent);

            totalHrsAllocated -= hours;
            totalHrsInfo.textContent = `Total hrs per week allocated = ${totalHrsAllocated}hr`;

            row.remove();
        } else if (event.target.classList.contains("move-to-bad-list")) {
            const row = event.target.closest("tr");
            const taskName = row.children[0].textContent;
            const hours = parseInt(row.children[1].textContent);

            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${taskName}</td>
                <td>${hours}hr</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-task">Delete</button>
                    <button class="btn btn-success btn-sm move-to-task-entry-list">Move to Task Entry List</button>
                </td>
            `;

            badListTable.appendChild(newRow);
            row.remove();

            updateSavedHoursInBadList();
        }
    });

    // Event delegation for Delete and Move to Task Entry List buttons in Bad List
    badListTable.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-task")) {
            const row = event.target.closest("tr");
            const hours = parseInt(row.children[1].textContent);

            row.remove();
            updateSavedHoursInBadList();
        } else if (event.target.classList.contains("move-to-task-entry-list")) {
            const row = event.target.closest("tr");
            const taskName = row.children[0].textContent;
            const hours = parseInt(row.children[1].textContent);

            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${taskName}</td>
                <td>${hours}hr</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-task">Delete</button>
                    <button class="btn btn-warning btn-sm move-to-bad-list">Move to Bad List</button>
                </td>
            `;

            taskEntryTable.appendChild(newRow);
            row.remove();

            totalHrsSavedInBadList -= hours;
            updateSavedHoursInBadList();
        }
    });
});
