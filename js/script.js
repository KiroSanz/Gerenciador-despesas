document.addEventListener('DOMContentLoaded', function() {
    // Variáveis globais
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let myChart;

    // Elementos DOM
    const form = document.getElementById('transactionForm');
    const transactionList = document.getElementById('transactionList');
    const balanceDisplay = document.getElementById('currentBalance');

    // Inicialização
    initChart();
    updateUI();
    updateChart(); // Carrega o gráfico com dados existentes

    // Event Listeners
    form.addEventListener('submit', addTransaction);

    // Funções
    function initChart() {
        const ctx = document.getElementById('myChart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Valor (R$)',
                    data: [],
                    backgroundColor: function(context) {
                        return context.raw >= 0 ? 'rgba(76, 175, 80, 0.7)' : 'rgba(244, 67, 54, 0.7)';
                    },
                    borderColor: function(context) {
                        return context.raw >= 0 ? 'rgba(76, 175, 80, 1)' : 'rgba(244, 67, 54, 1)';
                    },
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuad'
                }
            }
        });
    }

    function addTransaction(e) {
        e.preventDefault();
        
        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;

        if (!description || isNaN(amount)) {
            alert('Por favor, preencha todos os campos corretamente!');
            return;
        }

        const transaction = {
            id: Date.now(),
            description,
            amount: type === 'income' ? amount : -amount,
            type,
            date: new Date().toLocaleDateString('pt-BR')
        };

        transactions.push(transaction);
        saveTransactions();
        updateUI();
        form.reset();
        
        // Feedback visual
        const button = e.target.querySelector('button');
        button.textContent = 'Adicionado!';
        button.style.background = 'var(--success-color)';
        setTimeout(() => {
            button.textContent = 'Adicionar';
            button.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
        }, 1500);
    }

    function updateUI() {
        // Limpa a lista
        transactionList.innerHTML = '';

        // Ordena por data (mais recente primeiro)
        transactions.sort((a, b) => b.id - a.id);

        // Atualiza transações
        transactions.forEach(transaction => {
            const li = document.createElement('li');
            li.className = 'transaction-item';
            li.innerHTML = `
                <div class="transaction-info">
                    <span class="transaction-description">${transaction.description}</span>
                    <span class="transaction-date">${transaction.date}</span>
                </div>
                <div class="transaction-value">
                    <span class="transaction-amount ${transaction.type}">
                        ${transaction.amount >= 0 ? '+' : ''}R$ ${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                    <button onclick="deleteTransaction(${transaction.id})" class="delete-btn" title="Excluir">×</button>
                </div>
            `;
            transactionList.appendChild(li);
        });

        // Atualiza saldo
        updateBalance();
    }

    function updateBalance() {
        const balance = transactions.reduce((sum, t) => sum + t.amount, 0);
        const formattedBalance = balance.toFixed(2).replace('.', ',');
        
        balanceDisplay.textContent = `R$ ${formattedBalance}`;
        balanceDisplay.style.color = balance >= 0 ? 'var(--success-color)' : 'var(--danger-color)';
        
        // Atualiza o background do saldo baseado no valor
        const balanceDisplayContainer = document.querySelector('.balance-display');
        balanceDisplayContainer.style.background = balance >= 0 
            ? 'rgba(76, 175, 80, 0.1)' 
            : 'rgba(244, 67, 54, 0.1)';
        balanceDisplayContainer.style.borderColor = balance >= 0 
            ? 'rgba(76, 175, 80, 0.3)' 
            : 'rgba(244, 67, 54, 0.3)';
    }

    function updateChart() {
        // Agrupa por data para o gráfico
        const aggregatedData = {};
        transactions.forEach(t => {
            if (!aggregatedData[t.date]) {
                aggregatedData[t.date] = 0;
            }
            aggregatedData[t.date] += t.amount;
        });

        const labels = Object.keys(aggregatedData);
        const data = Object.values(aggregatedData);

        myChart.data.labels = labels;
        myChart.data.datasets[0].data = data;
        myChart.update();
    }

    function saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateChart();
    }

    // Função global para deletar
    window.deleteTransaction = function(id) {
        if (confirm('Tem certeza que deseja excluir esta transação?')) {
            transactions = transactions.filter(t => t.id !== id);
            saveTransactions();
            updateUI();
        }
    };

    // Botão para limpar tudo (adicione este HTML se quiser)
    window.clearAllTransactions = function() {
        if (confirm('Isso apagará TODAS as transações. Continuar?')) {
            transactions = [];
            localStorage.removeItem('transactions');
            updateUI();
            updateChart();
        }
    };
});