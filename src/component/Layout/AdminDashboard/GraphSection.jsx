import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Add this custom style to your CSS or in a style tag
export const styles = `
  .hide-scrollbar {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded shadow">
        <div className="flex items-center gap-2 mb-1">
          <img 
            src={data.userImage} 
            alt={data.displayName}
            className="w-6 h-6 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://i.pravatar.cc/30?img=${data.name}`;
            }}
          />
          <p className="text-sm font-medium">{data.displayName}</p>
        </div>
        <p className="text-sm text-gray-600">Documents: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const CustomXAxisTick = ({ x, y, payload, data }) => {
  const index = payload.value - 1;
  const userData = data[index];
  if (!userData) return null;
  
  return (
    <g transform={`translate(${x},${y})`}>
      <image
        x="-12"
        y="8"
        width="24"
        height="24"
        xlinkHref={userData.userImage}
        clipPath="url(#circleClip)"
        onError={(e) => {
          e.target.onerror = null;
          e.target.href = `https://i.pravatar.cc/30?img=${userData.name}`;
        }}
      />
      <text
        x="0"
        y="45"
        textAnchor="middle"
        fill="#666"
        fontSize="12"
      >
        {userData.displayName?.split(' ')[0]}
      </text>
      <defs>
        <clipPath id="circleClip">
          <circle cx="0" cy="20" r="12" />
        </clipPath>
      </defs>
    </g>
  );
};

const CustomBarTopDot = (props) => {
  const { x, y, width } = props;
  return (
    <circle
      cx={x + width / 2}
      cy={y}
      r={width / 2}
      fill="#3B82F6"
      stroke="white"
      strokeWidth={2}
    />
  );
};

const GraphSection = ({ data, data2 }) => {
  console.log("graph Dataaaaaa", data);
  return (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 md:mb-8">
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-sm text-gray-500">Statistics</h3>
          <h2 className="text-lg font-semibold">Documents Received</h2>
        </div>
        <select className="w-full sm:w-32 border rounded-md px-3 py-1.5 text-sm bg-white">
          <option>Month</option>
        </select>
      </div>
      <div className="hide-scrollbar overflow-x-auto -mx-4 md:-mx-6">
        <div className="min-w-[1524px] px-4 md:px-6">
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data} 
                margin={{ top: 20, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  height={50}
                  tick={(props) => <CustomXAxisTick {...props} data={data2} />}
                  interval={0}
                  scale="point"
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  stroke="#9CA3AF"
                  width={40}
                  domain={[0, 'dataMax + 20']}
                  ticks={[0,15, 25, 30, 45]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]} 
                  barSize={20}
                  shape={(props) => (
                    <g>
                      <path
                        d={`M ${props.x},${props.y} h ${props.width} v ${props.height} h -${props.width} Z`}
                        fill="#3B82F6"
                      />
                      <CustomBarTopDot {...props} />
                    </g>
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  </div>
)};

export default GraphSection; 