let thChart;

let tempHumChart = document.getElementById('tempHumChart').getContext('2d');
export async function updateGraph(data){
    if (!thChart) {
        initGraph(data);
        return;
    }
    thChart.data.labels = [];
    thChart.data.datasets.forEach(dataset => {
        dataset.data = [];
    });
    thChart.data.labels = data.Records.map(record => new Date(record.Time));
    thChart.data.datasets[0].data = data.Records.map(record => record.Temp);
    thChart.data.datasets[1].data = data.Records.map(record => record.Hum);
    thChart.update();
    thChart.clear(); // Clear the chart before updating
}

function initGraph(data){
    const chartConfig = {
        type: 'line',
        data: {
            labels: data.Records.map(record => new Date(record.Time)),
            datasets: [
                {
                    label: 'Temperature',
                    data: data.Records.map(record => record.Temp),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    yAxisID: 'y-axis-temp',
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    fill: false
                },
                {
                    label: 'Humidity',
                    data: data.Records.map(record => record.Hum),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    yAxisID: 'y-axis-hum',
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-temp',
                        type: 'linear',
                        position: 'left',
                        ticks: {
                            beginAtZero: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Temperature (°C)'
                        }
                    },
                    {
                        id: 'y-axis-hum',
                        type: 'linear',
                        position: 'right',
                        ticks: {
                            beginAtZero: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Humidity (%)'
                        }
                    }
                ],
                xAxes: [
                    {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        }
                    }
                ]
            }
        }
    };

    thChart = new Chart(tempHumChart, chartConfig);
}