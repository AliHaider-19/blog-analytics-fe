"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function AnalyticsChart({ data }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-md">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-primary">
            Posts: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
          <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="posts" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} className="fill-primary" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
