
import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { ProgressData } from '../types';

interface Props {
  data: ProgressData[];
}

export const ProgressChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-[300px] md:h-[400px] pixel-border bg-[#151517] p-4 relative overflow-hidden">
      <div className="absolute top-2 left-2 pixel-font text-[10px] text-gray-500">
        SOUL AFFINITY STATS
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#3d3d41" />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ fill: '#e0e0e0', fontSize: 12, fontFamily: 'Press Start 2P' }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false} 
          />
          <Radar
            name="Skill Level"
            dataKey="level"
            stroke="#991b1b"
            fill="#7f1d1d"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
