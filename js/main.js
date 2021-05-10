(function(){
    let $ = q => document.querySelector(q);

    function convertPeriod(mil) {
        var min = Math.floor(mil / 60000);
        var sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    };

    function renderVaga () {
        let vaga = getVaga();
        $("#vaga").innerHTML = "";
        vaga.forEach(c => addCarToGarage(c))
    };

    function addCarToGarage (car) {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${car.modelo}</td>
            <td>${car.placa}</td>
            <td>${car.cor}</td>
            <td data-time="${car.time}">
                ${new Date(car.time)
                        .toLocaleString('pt-BR', { 
                            hour: 'numeric', minute: 'numeric' 
                })}
            </td>
            <td>
                <button class="delete">FINALIZAR</button>
            </td>
        `;

        $("#vaga").appendChild(row);
    };

    function checkOut(info) {
        let duracao = new Date() - new Date(info[3].dataset.time);
        duracao = convertPeriod(duracao);

        let placa = info[1].textContent;
        let cor = info[2].textContent;
        let msg = `O veículo ${info[0].textContent} de placa ${placa} e cor ${cor} permaneceu ${duracao} estacionado. \n\n Deseja encerrar?`;

        if(!confirm(msg)) return;
        
        let vaga = getVaga().filter(c => c.placa !== placa);
        localStorage.vaga = JSON.stringify(vaga);
        
        renderVaga();
    };

    let getVaga = () => localStorage.vaga ? JSON.parse(localStorage.vaga) : [];

    renderVaga();
    $("#send").addEventListener("click", e => {
        let modelo = $("#modelo").value;
        let placa = $("#placa").value;
        let cor = $("#cor").value;

        if(!modelo || !placa || !cor){

            if(!modelo){
                alert("Por favor digite o modelo e / ou marca do veículo")
            }
            if(!placa){
                alert("Por favor digite a placa do veículo")
            }
            if(!cor){
                alert("Por favor digite a cor do veículo")
            }
            return;
        }   

        let slot = { modelo, placa, cor, time: new Date() };

        let vaga = getVaga();
        vaga.push(slot);

        localStorage.vaga = JSON.stringify(vaga);

        addCarToGarage(slot);
        $("#modelo").value = "";
        $("#placa").value = "";
        $("#cor").value = "";
    });

    $("#vaga").addEventListener("click", (e) => {
        if(e.target.className === "delete")
            checkOut(e.target.parentElement.parentElement.cells);
    });
})()