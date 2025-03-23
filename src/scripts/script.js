import * as utils from './utils.js';

const workValueInput = document.getElementById("secViewer_valuesW");
const festiveValueInput = document.getElementById("secViewer_valuesF");

const formCreateBoard = document.querySelector(".secCreator_form");
const boardContainer = document.getElementById("sectionBoard");

const btnCloseModalCreateItem = document.querySelector(".modalClose");
const modalCreateItem = document.getElementById("modalCreateItem");
const modalFormCreateItem = document.getElementById("form_addItem");

let workHourValue;
let festiveHourValue;
let activeBoard = null;
let editingItem = null;
let tables = {};

document.addEventListener("DOMContentLoaded", () => {
    loadValues();
    loadTablesFromLocalStorage();
    renderTables();
});


function updateTableValues(table) {
    if (!table) return;

    const title = table.closest(".secBoard_containerPanel").querySelector("h1").textContent;
    if (!tables[title] || !tables[title].items) return;

    let totalDias = 0;
    let totalMinutos = 0;
    let totalSalario = 0;

    Object.values(tables[title].items).forEach(item => {
        totalDias++;
        totalMinutos += parseInt(item.minutosTrabajados) || 0;
        totalSalario += parseFloat(item.salarioAproximado) || 0;
    });

    let totalHoras = utils.calcularHorasTrabajadas(totalMinutos);

    tables[title].totalDias = totalDias;
    tables[title].totalHoras = totalHoras;
    tables[title].totalSalario = totalSalario;

    const resumeContainer = table.previousElementSibling;
    const dds = resumeContainer.querySelectorAll("dd");

    if (dds.length >= 3) {
        dds[0].textContent = totalDias;
        dds[1].textContent = totalHoras;
        dds[2].textContent = `$ ${Math.floor(totalSalario)}`;
    }

    saveTablesToLocalStorage();
}


function loadValues() {
    workHourValue = localStorage.getItem("workValue") || "";
    festiveHourValue = localStorage.getItem("festiveValue") || "";

    workValueInput.value = workHourValue;
    festiveValueInput.value = festiveHourValue;
}

workValueInput.addEventListener("change", () => {
    localStorage.setItem("workValue", workValueInput.value);
    loadValues();
})

festiveValueInput.addEventListener("change", () => {
    localStorage.setItem("festiveValue", festiveValueInput.value);
    loadValues();
})

formCreateBoard.addEventListener("submit", (event) => {
    event.preventDefault();
    let boardTitle = formCreateBoard.children.item(2).value;

    if (boardTitle === "") {
        alert("Por favor, escribe un titulo antes de crear.");
        return;
    }

    formCreateBoard.children.item(2).value = "";
    createBoard(boardTitle);
});

function createBoard(title) {
    if (!tables[title]) {
        tables[title] = {
            totalDias: 0,
            totalHoras: 0,
            totalSalario: 0,
            items: {} // Nueva clave para almacenar los ítems
        };

        console.log(tables);
    }

    const article = document.createElement("article");
    article.classList.add("secBoard_containerPanel");

    article.innerHTML = `
        <header>
            <h1>${title}</h1>
            <button class="genericBtn addNewItemBtn">+</button>
        </header>
        <section class="secBoard_resume">
            <div class="secBoard_resumeDays">
                <dt>Total días</dt>
                <dd></dd>
            </div>
            <div class="secBoard_resumeHours">
                <dt>Total horas</dt>
                <dd></dd>
            </div>
            <div class="secBoard_resumeSalary">
                <dt>Salario aproximado</dt>
                <dd></dd>
            </div>
        </section>
        <table class="secBoard_board">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Valor</th>
                    <th></th>
                </tr>
            </thead>
        </table>
        <section class="secBoard_deleteboard">
            <button class="genericBtn deleteBtn">Eliminar Tabla</button>
        </section>
    `;

    boardContainer.prepend(article);

    // Agregar funcionalidad a botones
    article.querySelector(".addNewItemBtn").addEventListener("click", () => {
        activeBoard = article.querySelector(".secBoard_board");
        modalCreateItem.classList.remove("hidden");
    });

    article.querySelector(".deleteBtn").addEventListener("click", () => {
        deleteTable(title);
        article.remove(); // Eliminar del HTML
        saveTablesToLocalStorage();
    });

    
    saveTablesToLocalStorage();
}

function createItem(itemContainer, title, itemKey, item) {
    const tbody = document.createElement("tbody");
    tbody.dataset.key = itemKey;

    // Asegurar que el salario sea recalculado correctamente
    const minutosTrabajados = parseInt(item.minutosTrabajados) || 0;
    
    item.salarioAproximado = item.checkbox 
        ? utils.calularSalarioAproximado(festiveHourValue, minutosTrabajados) 
        : utils.calularSalarioAproximado(workHourValue, minutosTrabajados);

    const { date, start, end, salarioAproximado } = item;
    
    tbody.innerHTML = `
        <tr data-key="${itemKey}">
            <td>${date}</td>
            <td>${start}</td>
            <td>${end}</td>
            <td>${salarioAproximado}</td>
            <td>
                <button class="secBoard_btnEdit genericBtn">Y</button>
                <button class="secBoard_btnDelete genericBtn">X</button>
            </td>
        </tr>
    `;

    itemContainer.appendChild(tbody);

    tbody.querySelector(".secBoard_btnDelete").addEventListener("click", () => {
        deleteItemFromTable(title, itemKey);
        updateTableValues(itemContainer);
        tbody.remove();
        saveTablesToLocalStorage();
    });

    tbody.querySelector(".secBoard_btnEdit").addEventListener("click", () => {
        editingItem = tbody;
        activeBoard = itemContainer;
        modalCreateItem.classList.remove("hidden");
    });
}
    


// Editar un ítem en una tabla
function editItemInTable(title, itemKey, updatedItem) {
    if (!tables[title] || !tables[title].items) return;
    
    tables[title].items[itemKey] = updatedItem;

    console.log(tables[title].items[itemKey]);
    
}

// Eliminar un ítem de una tabla
function deleteItemFromTable(title, index) {
    if (!tables[title] || !tables[title].items) return;

    delete tables[title].items[index]; // Eliminar solo el ítem

    console.log(tables);
}

function deleteTable(titleTable) {
    if (!tables || !tables[titleTable]) return;

    delete tables[titleTable]; // Eliminar tabla del objeto

    console.log(tables);
}

modalFormCreateItem.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!activeBoard) return;

    const tableTitle = activeBoard.parentElement.querySelector("h1").textContent;
    const date = document.getElementById("input_date").value;
    const start = document.getElementById("input_start").value;
    const end = document.getElementById("input_end").value;
    const minutes = document.getElementById("input_minutePicker").value;
    const checkbox = document.getElementById("input_Checkbox").checked;

    const minutosTrabajados = utils.calcularMinutosTrabajados(start, end, minutes);
    const salarioAproximado = checkbox 
        ? utils.calularSalarioAproximado(festiveHourValue, minutosTrabajados) 
        : utils.calularSalarioAproximado(workHourValue, minutosTrabajados);

    const newItem = { date, start, end, minutes, checkbox, minutosTrabajados, salarioAproximado };

    if (editingItem) {
        let itemKey = editingItem.dataset.key; 
        editItemInTable(tableTitle, itemKey, newItem);
        
        editingItem.children[0].textContent = tables[tableTitle].items[itemKey].date;
        editingItem.children[1].textContent = tables[tableTitle].items[itemKey].start;
        editingItem.children[2].textContent = tables[tableTitle].items[itemKey].end;
        editingItem.children[3].textContent = tables[tableTitle].items[itemKey].salarioAproximado;

    } else {
        if (!tables[tableTitle].lastItemId) tables[tableTitle].lastItemId = 0;

        tables[tableTitle].lastItemId++;
        let itemKey = `item${tables[tableTitle].lastItemId}`;
        tables[tableTitle].items[itemKey] = newItem;
        
        createItem(activeBoard, tableTitle, itemKey, newItem);
    }

    // Actualizar los totales de la tabla
    updateTableValues(activeBoard);

    // Cerrar el modal y resetear formulario
    modalCreateItem.classList.add("hidden");
    modalFormCreateItem.reset();

    editingItem = null;
    activeBoard = null;

    // Guardar cambios en localStorage
    console.log(tables);
    saveTablesToLocalStorage();
});


function loadTablesFromLocalStorage() {
    tables = JSON.parse(localStorage.getItem("tables")) || {};
}

function saveTablesToLocalStorage() {
    localStorage.setItem("tables", JSON.stringify(tables));
}

function renderTables() {
    Object.keys(tables).forEach(tableTitle => {
        createBoard(tableTitle); // Crea la tabla en el DOM

        let itemContainer = [...document.querySelectorAll(".secBoard_containerPanel h1")]
            .find(h1 => h1.textContent === tableTitle)
            ?.closest(".secBoard_containerPanel")
            ?.querySelector(".secBoard_board");

        if (itemContainer && tables[tableTitle].items) {
            Object.entries(tables[tableTitle].items).forEach(([key, item]) => {
                createItem(itemContainer, tableTitle, key, item);
            });
        }

        // Actualizar los totales de la tabla después de renderizar los ítems
        updateTableValues(itemContainer);
    });
}



btnCloseModalCreateItem.addEventListener("click", () => {
    modalCreateItem.classList.add("hidden");
    modalFormCreateItem.reset();
    
});

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("secBoard_btnEdit")) {
        const row = event.target.closest("tr");
        const title = activeBoard.parentElement.querySelector("h1").textContent; // Obtener título de la tabla
        const itemKey = row.dataset.key; // Obtener la clave del ítem en la tabla

        if (!tables[title] || !tables[title].items[itemKey]) return; // Verificar que el ítem exista

        const itemData = tables[title].items[itemKey]; // Obtener los datos del ítem

        // Llenar los inputs con los datos actuales
        document.getElementById("input_date").value = itemData.date;
        document.getElementById("input_start").value = itemData.start;
        document.getElementById("input_end").value = itemData.end;
        document.getElementById("input_minutePicker").value = itemData.minutes;
        document.getElementById("input_Checkbox").checked = itemData.checkbox;

        editingItem = row; // Guardar la fila en edición
        modalCreateItem.classList.remove("hidden"); // Mostrar modal
    }
});
 
