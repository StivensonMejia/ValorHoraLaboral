
const buttonsColorContainer = document.querySelector(".secCreator_buttonsContainer");
const checkboxTheme = document.querySelector(".secCreator_checkBox");
const body = document.body;

const savedColor = localStorage.getItem("selectedColor");
const savedTheme = localStorage.getItem("theme");

if (savedColor) {
    body.className = savedColor;
}

if (savedTheme) {
    body.id = savedTheme;
    checkboxTheme.checked = savedTheme === "dark_mode";
}

export function applyTheme(newColor) {
    body.className = newColor; // Aplicar el tema
    localStorage.setItem("selectedColor", newColor); // Guardar en localStorage
}

buttonsColorContainer.addEventListener("click", (event) => {
    let selectionedColor = event.target.dataset.color
    if (!selectionedColor) return;
    
    let newColor;
    switch (selectionedColor) {
        case "Green":
            newColor = "theme_green";
            break;
        case "Blue":
            newColor = "theme_blue";
            break;
        case "Pink":
            newColor = "theme_pink";
            break;
        case "Red":
            newColor = "theme_red";
            break;
        default:
            newColor = "theme_green";
            break;
    }

    body.className = newColor;
    localStorage.setItem("selectedColor", newColor); // Guardar en localStorage
    
});

checkboxTheme.addEventListener("change", (event) => {
    const isChecked = event.target.checked
    body.id = isChecked ? "dark_mode" : "light_mode";
    localStorage.setItem("theme", body.id);
});