"use client"

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import React from "react"
import { Bar, BarChart, CartesianGrid, LabelList, Pie, PieChart, XAxis, Label } from "recharts"

const chartData = [
  {
    'BID': [
      { month: "jan", total: 5, fill: "var(--color-jan)" },
      { month: "febr", total: 1, fill: "var(--color-febr)" },
      { month: "march", total: 7, fill: "var(--color-march)" },
      { month: "apr", total: 2, fill: "var(--color-apr)" },
      { month: "maj", total: 6, fill: "var(--color-maj)" },
      { month: "june", total: 2, fill: "var(--color-june)" },
      { month: "july", total: 5, fill: "var(--color-july)" },
      { month: "aug", total: 3, fill: "var(--color-aug)" },
      { month: "sept", total: 8, fill: "var(--color-sept)" },
      { month: "oct", total: 10, fill: "var(--color-oct)" },
      { month: "nov", total: 2, fill: "var(--color-nov)" },
      { month: "dec", total: 1, fill: "var(--color-dec)" },
    ]
  }
]

const chartConfig = {
  total: {
    label: "Összesen",
  },
  jan: {
    label: "Január",
    color: "hsl(var(--chart-1))",
  },
  febr: {
    label: "Február",
    color: "hsl(var(--chart-2))",
  },
  march: {
    label: "Március",
    color: "hsl(var(--chart-3))",
  },
  apr: {
    label: "Április",
    color: "hsl(var(--chart-4))",
  },
  maj: {
    label: "Május",
    color: "hsl(var(--chart-5))",
  },
  june: {
    label: "Június",
    color: "hsl(var(--chart-6))",
  },
  july: {
    label: "Július",
    color: "hsl(var(--chart-7))",
  },
  aug: {
    label: "Augusztus",
    color: "hsl(var(--chart-8))",
  },
  sept: {
    label: "Szeptember",
    color: "hsl(var(--chart-9))",
  },
  oct: {
    label: "Október",
    color: "hsl(var(--chart-10))",
  },
  nov: {
    label: "November",
    color: "hsl(var(--chart-11))",
  },
  dec: {
    label: "December",
    color: "hsl(var(--chart-12))",
  },
} satisfies ChartConfig

const DocumentChart = (data: any) => {
  
  return (
    <div className={`border rounded-2xl p-3 shadow-sm bg-card`}>
      <div className={`flex justify-between items-center`}>
        <h3 className={`text-xl font-bold`}></h3>
      </div>
      {chartData.map((data, i) => {
        const total = React.useMemo(() => {
          return data.BID.reduce((acc, curr) => acc + curr.total, 0)
        }, [])
        return (
          <div key={i}>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={data.BID} dataKey="total" nameKey="month" innerRadius={60} strokeWidth={5}>
                  <Label content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle" >
                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold" >
                              {total.toLocaleString()}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground" >
                              Árajánlat
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        )
      })}
    </div>
  )
}

export default DocumentChart
