import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { trpc } from '@/lib/trpc';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceChartProps {
  productId: number;
  productName: string;
  days?: number;
}

export function PriceChart({ productId, productName, days = 30 }: PriceChartProps) {
  const { data: history, isLoading, error } = trpc.prices.getPriceHistory.useQuery({
    productId,
    days,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive">
        <p>Грешка при зареждане на данните: {error.message}</p>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>Няма налични исторически данни за този продукт.</p>
      </div>
    );
  }

  // Sort by date ascending (oldest first)
  const sortedHistory = [...history].reverse();

  // Prepare chart data
  const labels = sortedHistory.map((record) => {
    const date = new Date(record.recordedAt);
    return date.toLocaleDateString('bg-BG', { month: 'short', day: 'numeric' });
  });

  const priceData = sortedHistory.map((record) => record.priceEur / 100); // Convert from cents to EUR
  const pricePerGramData = sortedHistory.map((record) => record.pricePerGramEur / 100);

  const data = {
    labels,
    datasets: [
      {
        label: 'Цена (EUR)',
        data: priceData,
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'Цена/грам (EUR)',
        data: pricePerGramData,
        borderColor: 'rgb(192, 192, 192)',
        backgroundColor: 'rgba(192, 192, 192, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${productName} - Последните ${days} дни`,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2) + ' €';
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value: any) {
            return value.toFixed(2) + ' €';
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px]">
      <Line data={data} options={options} />
    </div>
  );
}
