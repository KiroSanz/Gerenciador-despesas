// Variáveis globais
let transactions = []; // Array para armazenar todas as transações
let balance = 0; // Saldo atual

// Configuração inicial do gráfico (apenas para saídas)
const ctx = document.getElementById('expense-chart').getContext('2d');
let chart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Alimentação', 'Transporte', 'Lazer'],
        datasets: [{
            data: [0, 0, 0],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            color: ['#ffff']
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Distribuição de Saídas por Categoria' }
        }
    }
});

// Função para atualizar o gráfico (apenas saídas)
function updateChart() {
    const totalsByCategory = {
        'Alimentação': 0,
        'Transporte': 0,
        'Lazer': 0
    };

    // Somar valores das saídas por categoria
    transactions.forEach(transaction => {
        if (transaction.type === 'Saída') {
            totalsByCategory[transaction.category] += transaction.amount;
        }
    });

    chart.data.datasets[0].data = [
        totalsByCategory['Alimentação'],
        totalsByCategory['Transporte'],
        totalsByCategory['Lazer']
    ];
    chart.update();
}

// Função para definir o saldo inicial
function setInitialBalance() {
    const initialBalanceInput = document.getElementById('initial-balance').value;
    const initialBalance = parseFloat(initialBalanceInput);

    if (isNaN(initialBalance) || initialBalance < 0) {
        alert('Por favor, insira um valor válido para o saldo inicial.');
        return;
    }

    balance = initialBalance;
    document.getElementById('balance').textContent = balance.toFixed(2);
    localStorage.setItem('balance', balance.toString());
    document.getElementById('initial-balance').value = ''; // Limpar campo
}

// Mostrar/esconder categoria com base no tipo
document.getElementById('type').addEventListener('change', function() {
    const categorySelect = document.getElementById('category');
    categorySelect.style.display = this.value === 'Saída' ? 'block' : 'none';
});

// Lógica do formulário de transações
document.getElementById('transaction-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Pegar valores do formulário
    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value;
    const amountInput = document.getElementById('amount').value;
    const category = document.getElementById('category').value;

    // Converter e validar o valor
    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) {
        alert('Por favor, insira um valor válido.');
        return;
    }

    // Criar transação
    const transaction = { type, description, amount, category: type === 'Saída' ? category : 'N/A' };
    transactions.push(transaction);

    // Atualizar saldo
    if (type === 'Entrada') {
        balance += amount;
    } else {
        balance -= amount;
    }
    document.getElementById('balance').textContent = balance.toFixed(2);

    // Adicionar à lista visual
    const list = document.getElementById('transaction-list');
    const item = document.createElement('li');
    item.textContent = `${type}: ${description} - R$ ${amount.toFixed(2)} ${type === 'Saída' ? '(' + category + ')' : ''}`;
    list.appendChild(item);

    // Atualizar o gráfico (se for saída)
    if (type === 'Saída') {
        updateChart();
    }

    // Salvar no LocalStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('balance', balance.toString());

    // Limpar formulário
    this.reset();
    document.getElementById('category').style.display = 'none'; // Esconder categoria após reset
});

// Carregar dados do LocalStorage ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    balance = parseFloat(localStorage.getItem('balance')) || 0;
    document.getElementById('balance').textContent = balance.toFixed(2);

    transactions.forEach(transaction => {
        const item = document.createElement('li');
        item.textContent = `${transaction.type}: ${transaction.description} - R$ ${transaction.amount.toFixed(2)} ${transaction.type === 'Saída' ? '(' + transaction.category + ')' : ''}`;
        document.getElementById('transaction-list').appendChild(item);
    });

    updateChart();
});