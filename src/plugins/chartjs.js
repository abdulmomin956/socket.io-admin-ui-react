import {
    Chart as ChartJS,
    DoughnutController,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
    TimeScale,
    LinearScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register ChartJS components
ChartJS.register(
    DoughnutController,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
    TimeScale,
    LinearScale
);

// Export the configured ChartJS instance
export { ChartJS };

// Export commonly used React chart components
export { Doughnut, Bar } from 'react-chartjs-2';