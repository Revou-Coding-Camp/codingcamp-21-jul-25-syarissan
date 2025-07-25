// === 1. Inisialisasi Element DOM ===
const addBtn = document.getElementById("addTask");
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const taskBody = document.getElementById("taskBody");
const deleteAll = document.getElementById("deleteAll");
const filterTask = document.getElementById("filterTask");

// === 2. Tampilkan "No task found" jika kosong ===
function updateEmptyRow() {
    const existing = document.querySelector(".empty-row");
    const visible = Array.from(taskBody.children).filter(
        row => !row.classList.contains("empty-row") && row.style.display !== "none"
    );

    if (visible.length === 0 && !existing) {
        const emptyRow = document.createElement("tr");
        emptyRow.classList.add("empty-row");
        emptyRow.innerHTML = `<td colspan="4" style="text-align: center;">No task found</td>`;
        taskBody.appendChild(emptyRow);
    } else if (visible.length > 0 && existing) {
        existing.remove();
    }
}

// === 3. Tambah Tugas ===
addBtn.addEventListener("click", function () {
    const taskText = taskInput.value.trim();
    const dateValue = dateInput.value.trim();

    if (taskText === "" || dateValue === "") return;

    const emptyRow = document.querySelector(".empty-row");
    if (emptyRow) emptyRow.remove();

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>
            <input type="checkbox" class="task-check" />
            <span class="task-label">${taskText}</span>
        </td>
        <td>${dateValue}</td>
        <td><span class="status-label">Pending</span></td>
        <td><button class="delete-btn">Delete</button></td>
    `;

    // === 3a. Checklist toggle: ubah status ===
    const checkbox = tr.querySelector(".task-check");
    const statusLabel = tr.querySelector(".status-label");
    const taskLabel = tr.querySelector(".task-label");

    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            statusLabel.textContent = "Done";
            taskLabel.style.textDecoration = "line-through";
            taskLabel.style.color = "#888";
        } else {
            statusLabel.textContent = "Pending";
            taskLabel.style.textDecoration = "none";
            taskLabel.style.color = "#cbe2ff";
        }
        updateEmptyRow();
    });

    // === 3b. Tombol hapus satuan ===
    const deleteBtn = tr.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", function () {
        tr.remove();
        updateEmptyRow();
    });

    taskBody.appendChild(tr);
    taskInput.value = "";
    dateInput.value = "";
    updateEmptyRow();
});

// === 4. Filter Berdasarkan Status ===
filterTask.addEventListener("change", function () {
    const selected = filterTask.value;
    if (selected === "filter") return;
    const rows = taskBody.querySelectorAll("tr");

    rows.forEach(row => {
        if (row.classList.contains("empty-row")) return;
        const status = row.querySelector(".status-label")?.textContent;
        const match =
            selected === "all" ||
            (selected === "pending" && status === "Pending") ||
            (selected === "done" && status === "Done");

        row.style.display = match ? "" : "none";
    });

    updateEmptyRow();
});

// === 5. Delete All Tugas ===
deleteAll.addEventListener("click", function () {
    taskBody.innerHTML = "";
    updateEmptyRow();
});

// === 6. Sort Header Interaktif ===
let taskAsc = true;
let dateAsc = true;
let statusAsc = true;

function sortTableBy(key, direction) {
    const rows = Array.from(taskBody.querySelectorAll("tr"))
        .filter(row => !row.classList.contains("empty-row"));

    let sorted = [];

    if (key === "task") {
        sorted = rows.sort((a, b) => {
            const aText = a.querySelector(".task-label")?.textContent.toLowerCase();
            const bText = b.querySelector(".task-label")?.textContent.toLowerCase();
            return direction === "asc" ? aText.localeCompare(bText) : bText.localeCompare(aText);
        });
    }

    if (key === "date") {
        sorted = rows.sort((a, b) => {
            const aDate = new Date(a.children[1].textContent);
            const bDate = new Date(b.children[1].textContent);
            return direction === "asc" ? aDate - bDate : bDate - aDate;
        });
    }

    if (key === "status") {
        const order = direction === "asc" ? ["Pending", "Done"] : ["Done", "Pending"];
        sorted = rows.sort((a, b) => {
            const aStatus = a.querySelector(".status-label")?.textContent;
            const bStatus = b.querySelector(".status-label")?.textContent;
            return order.indexOf(aStatus) - order.indexOf(bStatus);
        });
    }

    rows.forEach(row => row.remove());
    sorted.forEach(row => taskBody.appendChild(row));
    updateEmptyRow();
}

document.getElementById("sortTask").addEventListener("click", () => {
    sortTableBy("task", taskAsc ? "asc" : "desc");
    taskAsc = !taskAsc;
});

document.getElementById("sortDate").addEventListener("click", () => {
    sortTableBy("date", dateAsc ? "asc" : "desc");
    dateAsc = !dateAsc;
});

document.getElementById("sortStatus").addEventListener("click", () => {
    sortTableBy("status", statusAsc ? "asc" : "desc");
    statusAsc = !statusAsc;
});

// === 7. Inisialisasi Awal ===
updateEmptyRow();
