
export function calcularMinutosTrabajados(start, end, almuerzo = 0) {
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);

    if (endTime < startTime) {
        endTime.setDate(endTime.getDate() + 1); // Avanza un día
    }

    const minutosTrabajados = (endTime - startTime) / (1000 * 60); // Convierte milisegundos a minutos
    return minutosTrabajados -almuerzo;
}

function valorHoraAValorMinutos(valorHora) {
    let valorMinuto = valorHora / 60;
    return valorMinuto;
}

export function calcularHorasTrabajadas(minutosTrabajados) {
    const hours = Math.floor(minutosTrabajados / 60);
    const minutes = minutosTrabajados % 60;

    return `${hours}h ${minutes}min`;
}

export function calularSalarioAproximado(valorHora, minutosTrabajados) {
    const valorMinuto = valorHoraAValorMinutos(valorHora);
    let salarioAproximado = valorMinuto * minutosTrabajados;
    return `${Math.floor(salarioAproximado)}`;
}
