// Dados de exemplo (substitua com seus dados reais)
const data = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'], // Períodos
    datasets: [
      {
        label: 'Administração',
        data: [45, 60, 55, 40, 65],
        backgroundColor: 'rgba(0, 221, 235, 0.8)',
        borderColor: 'rgba(0, 221, 235, 1)',
        borderWidth: 1,
        borderRadius: 4
      },
      {
        label: 'Transporte',
        data: [30, 25, 40, 35, 20],
        backgroundColor: 'rgba(255, 0, 122, 0.8)',
        borderColor: 'rgba(255, 0, 122, 1)',
        borderWidth: 1,
        borderRadius: 4
      },
      {
        label: 'Lazer',
        data: [25, 15, 20, 30, 15],
        backgroundColor: 'rgba(0, 140, 255, 0.8)',
        borderColor: 'rgba(0, 140, 255, 1)',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };
  
  // Configuração do gráfico de barras
  const ctx = document.getElementById('expense-chart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#fff',
            font: {
              family: "'Poppins', sans-serif",
              size: 12
            },
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(30, 30, 60, 0.95)',
          titleColor: '#fff',
          bodyColor: '#e0e0e0',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: R$ ${context.raw.toFixed(2)}`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: false, // Altere para true se quiser barras empilhadas
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
            callback: function(value) {
              return 'R$ ' + value;
            }
          }
        }
      },
      animation: {
        duration: 1500,
        easing: 'easeOutQuart'
      }
    }
  });