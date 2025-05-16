
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMonthlyClaimsTrend } from '@/data/mockData';

interface ClaimStatsChartProps {
  title?: string;
}

const ClaimStatsChart: React.FC<ClaimStatsChartProps> = ({ title = "Monthly Claims Trend" }) => {
  const data = getMonthlyClaimsTrend();

  return (
    <Card className="col-span-2 h-[400px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pending" fill="#FBC02D" />
            <Bar dataKey="inReview" fill="#1E88E5" />
            <Bar dataKey="approved" fill="#43A047" />
            <Bar dataKey="denied" fill="#E53935" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ClaimStatsChart;
