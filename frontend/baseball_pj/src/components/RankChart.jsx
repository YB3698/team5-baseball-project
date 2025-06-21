import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React from 'react';

const RankChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={data}>
      <XAxis dataKey="teamName" />
      <YAxis reversed={true} /> {/* 순위가 작을수록 높은 위치 */}
      <Tooltip />
      <Legend />
      <Bar dataKey="realRank" name="실제 순위" />
      <Bar dataKey="pythRank" name="피타고리안 순위" />
    </BarChart>
  </ResponsiveContainer>
);

export default RankChart;
