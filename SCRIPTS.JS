document.addEventListener('DOMContentLoaded', function() {
    // Mostrar mensaje de bienvenida
    alert('¡TEN UN BUEN DÍA Y ÉXITOS!');

    const addRowBtn = document.getElementById('add-row-btn');
    const saveChangesBtn = document.getElementById('save-changes-btn');
    const showPlatesBtn = document.getElementById('show-plates-btn');
    const searchInput = document.getElementById('search-input');
    const voiceSearchBtn = document.getElementById('voice-search-btn');
    const tableBody = document.querySelector('#data-table tbody');
    const platesModal = document.getElementById('plates-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const platesList = document.getElementById('plates-list');

    // Cargar datos guardados al iniciar
    loadTableData();

    addRowBtn.addEventListener('click', function() {
        const newRow = document.createElement('tr');
        
        // Crea una celda para la nueva fila
        const placaCell = document.createElement('td');
        placaCell.textContent = 'Placa ' + (tableBody.children.length + 1); // Texto de ejemplo
        placaCell.className = 'editable'; // Añadir clase para estilo
        newRow.appendChild(placaCell);
        
        tableBody.appendChild(newRow);
    });

    saveChangesBtn.addEventListener('click', function() {
        saveTableData();
    });

    showPlatesBtn.addEventListener('click', function() {
        showPlatesModal();
    });

    closeModalBtn.addEventListener('click', function() {
        platesModal.style.display = 'none';
    });

    searchInput.addEventListener('input', function() {
        const searchValue = searchInput.value.toLowerCase();
        filterRows(searchValue);
    });

    voiceSearchBtn.addEventListener('click', function() {
        startVoiceSearch();
    });

    tableBody.addEventListener('click', function(event) {
        const target = event.target;
        if (target.tagName === 'TD' && target.classList.contains('editable')) {
            editCell(target);
        }
    });

    function editCell(cell) {
        const currentText = cell.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.className = 'edit-input'; // Estilo para el input
        cell.innerHTML = '';
        cell.appendChild(input);
        input.focus();
        
        input.addEventListener('blur', function() {
            cell.textContent = input.value;
        });
        
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                cell.textContent = input.value;
            }
        });
    }

    function saveTableData() {
        const rows = tableBody.querySelectorAll('tr');
        const tableData = Array.from(rows).map(row => {
            return Array.from(row.cells).map(cell => cell.textContent);
        });
        localStorage.setItem('tableData', JSON.stringify(tableData));
        alert('Cambios guardados.');
    }

    function loadTableData() {
        const savedData = localStorage.getItem('tableData');
        if (savedData) {
            const tableData = JSON.parse(savedData);
            tableData.forEach(rowData => {
                const newRow = document.createElement('tr');
                rowData.forEach(cellData => {
                    const newCell = document.createElement('td');
                    newCell.textContent = cellData;
                    newCell.className = 'editable';
                    newRow.appendChild(newCell);
                });
                tableBody.appendChild(newRow);
            });
        }
    }

    function showPlatesModal() {
        const savedData = localStorage.getItem('tableData');
        if (savedData) {
            const tableData = JSON.parse(savedData);
            platesList.innerHTML = '';
            tableData.forEach(rowData => {
                rowData.forEach(cellData => {
                    const listItem = document.createElement('li');
                    listItem.textContent = cellData;
                    platesList.appendChild(listItem);
                });
            });
            platesModal.style.display = 'block';
        } else {
            platesList.innerHTML = '<li>No hay placas guardadas.</li>';
            platesModal.style.display = 'block';
        }
    }

    function filterRows(searchValue) {
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const placaCell = row.cells[0]; // La columna de placas es la única
            const placaText = placaCell.textContent.toLowerCase();
            if (placaText.includes(searchValue) && searchValue.length >= 2) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    function startVoiceSearch() {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Tu navegador no soporta la búsqueda por voz.');
            return;
        }
        
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'es-ES'; // Configura el idioma a español
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.toLowerCase();
            searchInput.value = transcript;
            filterRows(transcript);
        };
        
        recognition.onerror = function(event) {
            alert('Error al reconocer el habla: ' + event.error);
        };
        
        recognition.start();
    }
});
