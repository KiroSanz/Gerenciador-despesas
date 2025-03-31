// Cores personalizadas para cada categoria
const categoryColors = {
    'Administração': '#00ddeb',
    'Transporte': '#ff007a',
    'Lazer': '#008cff'
  };
  
  // Configuração do gráfico
  const ctx = document.getElementById('expense-chart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'pie', // ou 'doughnut' para gráfico de rosca
    data: {
      labels: ['Administração', 'Transporte', 'Lazer'],
      datasets: [{
        data: [45, 30, 25], // Substitua com seus dados reais
        backgroundColor: [
          categoryColors['Administração'],
          categoryColors['Transporte'],
          categoryColors['Lazer']
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false // Esconde a legenda padrão
        }
      }
    }
  });
  
  // Cria legenda personalizada
  function createCustomLegend() {
    const legendContainer = document.createElement('div');
    legendContainer.className = 'chart-legend';
    
    Object.entries(categoryColors).forEach(([category, color]) => {
      const legendItem = document.createElement('div');
      legendItem.className = 'legend-item';
      
      const colorBox = document.createElement('div');
      colorBox.className = 'legend-color';
      colorBox.style.backgroundColor = color;
      
      const label = document.createElement('span');
      label.textContent = category;
      
      legendItem.appendChild(colorBox);
      legendItem.appendChild(label);
      legendContainer.appendChild(legendItem);
    });
    
    document.querySelector('.chart-container').appendChild(legendContainer);
  }
  
  // Chama a função para criar a legenda
  createCustomLegend();