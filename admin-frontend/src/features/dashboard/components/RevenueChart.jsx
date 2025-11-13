import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function RevenueChart({ data }) {
  const labels = (data || []).map(d => {
    try {
      const dt = new Date(d.date ?? d.day ?? d.label);
      return dt instanceof Date && !isNaN(dt) ? dt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : String(d.date ?? d.day ?? d.label);
    } catch {
      return String(d.date ?? d.day ?? d.label);
    }
  });
  const values = (data || []).map(d => Number(d.revenue ?? d.value ?? 0));
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Doanh thu',
        data: values,
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79,70,229,0.2)'
      }
    ]
  };
  const options = { responsive: true, maintainAspectRatio: false };
  return (
    <div style={{ height: 400 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}


