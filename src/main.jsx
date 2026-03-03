import React from 'react';
import ReactDOM from 'react-dom/client';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,    // для категорий на оси X
  LinearScale,      // для линейной шкалы
  BarElement,       // для столбцов
  PointElement,     // для точек на линейном графике
  LineElement,      // для линий
  ArcElement,       // для круговой диаграммы
  Title,            // для заголовков
  Tooltip,          // для подсказок
  Legend,           // для легенды
  Filler            // для заполнения областей
);

function App() {
  const [chartType, setChartType] = React.useState('pie');
  const [chartData, setChartData] = React.useState({
    labels: ['A', 'B', 'C', 'D', 'E'],
    datasets: [{
      label: 'Значения',
      data: [100, 200, 150, 300, 250],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 206, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)'
      ],
      borderWidth: 2,
      tension: 0.3
    }]
  });

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const typeRes = await fetch('/chart-type.json?' + Date.now());
        if (typeRes.ok) {
          const typeData = await typeRes.json();
          setChartType(typeData.type || 'pie');
        }

        const dataRes = await fetch('/chart-data.json?' + Date.now());
        if (dataRes.ok) {
          const data = await dataRes.json();
          if (data.length > 0) {
            setChartData({
              labels: data.map(item => item.name),
              datasets: [{
                label: 'Значения',
                data: data.map(item => item.value),
                backgroundColor: data.map((_, i) => {
                  const colors = [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                  ];
                  return colors[i % colors.length];
                }),
                borderColor: data.map((_, i) => {
                  const colors = [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 206, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)',
                    'rgb(255, 159, 64)'
                  ];
                  return colors[i % colors.length];
                }),
                borderWidth: 2,
                tension: 0.3
              }]
            });
          }
        }
      } catch (e) {
        console.log('Ошибка загрузки:', e);
      }
    };

    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  const getOptions = (type) => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          position: 'bottom',
          labels: { color: '#333' }
        },
        tooltip: { enabled: true }
      }
    };

    if (type === 'line') {
      return {
        ...baseOptions,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.1)' }
          },
          x: {
            grid: { display: false }
          }
        },
        elements: {
          line: {
            borderWidth: 3,
            fill: false
          },
          point: {
            radius: 5,
            hoverRadius: 7
          }
        }
      };
    }

    if (type === 'bar') {
      return {
        ...baseOptions,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.1)' }
          }
        }
      };
    }

    return baseOptions;
  };

  const renderChart = () => {
    const style = { 
      width: '100%', 
      height: '100%', 
      padding: '20px',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    };

    const options = getOptions(chartType);

    try {
      switch(chartType) {
        case 'bar':
          return (
            <div style={style}>
              <Bar data={chartData} options={options} />
            </div>
          );
        case 'line':
          return (
            <div style={style}>
              <Line data={chartData} options={options} />
            </div>
          );
        case 'pie':
          return (
            <div style={style}>
              <Pie data={chartData} options={options} />
            </div>
          );
        default:
          return (
            <div style={style}>
              <Pie data={chartData} options={options} />
            </div>
          );
      }
    } catch (error) {
      console.error('Ошибка рендера:', error);
      return <div style={{ color: 'red', padding: 20 }}>Ошибка загрузки диаграммы</div>;
    }
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ width: '100%', height: '100%', maxWidth: '1200px', maxHeight: '800px' }}>
        {renderChart()}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);