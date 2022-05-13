interface PieCharts
{
    totaldata: number;
    series: number[];
    labels: string[];
}

interface ColumnCharts
{
    series: any;
    categories: string[];
}

export { PieCharts,ColumnCharts };
