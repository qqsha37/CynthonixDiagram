import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

Chart.register(CategoryScale);

function SimpleChart() {
    const [chartType, setChartType] = useState('pie');
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const loadData = async () => {
            try {
                const typeRes = await fetch('/chart-type.json?' + Date.now());
                if (typeRes.ok) {
                    const typeData = await typeRes.json();
                    setChartType(typeData.type || 'pie');
                }

                // Загружаем данные
                const dataRes = await fetch('/chart-data.json?' + Date.now());
                if (dataRes.ok) {
                    const data = await dataRes.json();
                    setChartData({
                        labels: data.map(item => item.name),
                        datasets: [{
                            label: 'Значения',
                            data: data.map(item => item.value),
                            backgroundColor: [
                                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                                '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
                            ],
                            borderWidth: 1
                        }]
                    });
                }
            } catch (e) {
                console.log('Waiting for data...');
            }
        };

        loadData();
        const interval = setInterval(loadData, 500);
        return () => clearInterval(interval);
    }, []);
 
    const renderChart = () => {
        const props = { 
            data: chartData, 
            options: { maintainAspectRatio: false, plugins: { legend: { display: true } } }
        };

        switch(chartType) {
            case 'bar': return <Bar {...props} />;
            case 'line': return <Line {...props} />;
            default: return <Pie {...props} />;
        }
    };

    return <div style={{ width: '100%', height: '100%', padding: '20px' }}>{renderChart()}</div>;
}

// Запуск
ReactDOM.createRoot(document.getElementById('root')).render(<SimpleChart />);