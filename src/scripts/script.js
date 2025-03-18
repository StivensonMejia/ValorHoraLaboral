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
/* let boardTitle; */

function loadValues() {
    workHourValue = localStorage.getItem("workValue") || "";
    festiveHourValue = localStorage.getItem("festiveValue") || "";

    workValueInput.value = workHourValue;
    festiveValueInput.value = festiveHourValue;
}

loadValues();

workValueInput.addEventListener("change", () => {
    localStorage.setItem("workValue", workValueInput.value);
})

festiveValueInput.addEventListener("change", () => {
    localStorage.setItem("festiveValue", festiveValueInput.value);
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
    const article = document.createElement("article");
    article.classList.add("secBoard_containerPanel");

    article.innerHTML = `
        <header>
            <h1>${title}</h1>
            <button class="genericBtn addNewItemBtn">+</button>
        </header>
        <section class="secBoard_resume">
            <dl>
                <div>
                    <dt>Total días</dt>
                    <dd>0</dd>
                </div>
                <div>
                    <dt>Total horas</dt>
                    <dd>0</dd>
                </div>
                <div>
                    <dt>Salario aproximado</dt>
                    <dd>$ 0</dd>
                </div>
            </dl>
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
    
    /* const itemContainer = article.querySelector(".secBoard_board") */

    article.querySelector(".addNewItemBtn").addEventListener("click", () => {
        activeBoard = article.querySelector(".secBoard_board");
        modalCreateItem.classList.remove("hidden");
    });
    article.querySelector(".deleteBtn").addEventListener("click", () => article.remove());
}

modalFormCreateItem.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!activeBoard) return;

    const date = document.getElementById("input_date").value;
    const start = document.getElementById("input_start").value;
    const end = document.getElementById("input_end").value;
    const minutes = document.getElementById("input_minutePicker").value;
    const checkbox = document.getElementById("input_Checkbox").checked;

    if (editingItem) {
        // Editar elemento existente
        editingItem.children[0].textContent = date;
        editingItem.children[1].textContent = start;
        editingItem.children[2].textContent = end;
        editingItem.children[3].textContent = "500"; // Valor fijo, puedes modificarlo
        console.log("editingItem");
        
        editingItem = null; // Resetear para futuras creaciones
    } else {
        // Crear nuevo elemento
        console.log("activeBoard");
        
        createItem(activeBoard, date, start, end, "500");
    }

    modalCreateItem.classList.add("hidden");

    modalFormCreateItem.reset();

});

function createItem(itemContainer, date, start, end, value) {
    const tbody = document.createElement("tbody");

    tbody.innerHTML = `
        <tr>
            <td>${date}</td>
            <td>${start}</td>
            <td>${end}</td>
            <td>${value}</td>
            <td>
                <button class="secBoard_btnEdit genericBtn">Y</button>
                <button class="secBoard_btnDelete genericBtn">X</button>
            </td>
        </tr>
    `;

    itemContainer.appendChild(tbody);

    tbody.querySelector(".secBoard_btnDelete").addEventListener("click", () => {
        tbody.remove();
    });

    tbody.querySelector(".secBoard_btnEdit").addEventListener("click", () => {
        modalCreateItem.classList.remove("hidden");
    });
}

btnCloseModalCreateItem.addEventListener("click", () => {
    modalCreateItem.classList.add("hidden");
    modalFormCreateItem.reset();
    
});

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("secBoard_btnEdit")) {
        const row = event.target.closest("tr");

        // Llenar los inputs con los datos actuales
        document.getElementById("input_date").value = row.children[0].textContent;
        document.getElementById("input_start").value = row.children[1].textContent;
        document.getElementById("input_end").value = row.children[2].textContent;

        editingItem = row; // Guardar la fila en edición
        modalCreateItem.classList.remove("hidden"); // Mostrar modal
    }
});
 
