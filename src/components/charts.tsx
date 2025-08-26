"use client";

import { useState, useMemo, useCallback } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Line,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import type { Stats } from "../app/types";

type ChartMode = "correlations" | "raw";
type MetricType = "LR" | "HR" | "KD" | "AIM" | "Util";

export default function Charts({ pearson, scatter }: Stats) {
  const [mode, setMode] = useState<ChartMode>("correlations");
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("AIM");
  const [isLoading, setIsLoading] = useState(false);
  const [isMetricLoading, setIsMetricLoading] = useState(false);

  const chartData = useMemo(() => {
    const lr = scatter.map((player) => ({
      lr: player.avgLR,
      wr: player.avgWon * 100,
      id: player.steamID,
    }));

    const hr = scatter.map((player) => ({
      hr: player.avgHR,
      wr: player.avgWon * 100,
      id: player.steamID,
    }));

    const kd = scatter.map((player) => ({
      kd: player.avgKD,
      wr: player.avgWon * 100,
      id: player.steamID,
    }));

    const aim = scatter.map((player) => ({
      aim: player.avgAim,
      wr: player.avgWon * 100,
      id: player.steamID,
    }));

    const util = scatter.map((player) => ({
      util: player.avgUtil,
      wr: player.avgWon * 100,
      id: player.steamID,
    }));

    return { lr, hr, kd, aim, util };
  }, [scatter]);

  const correlationData = useMemo(() => [
    { name: "Leetify Rating", value: pearson.lr, color: "hsl(var(--chart-1))" },
    { name: "HLTV Rating", value: pearson.hr, color: "hsl(var(--chart-2))" },
    { name: "Kill/Death Ratio", value: pearson.kd, color: "hsl(var(--chart-3))" },
    { name: "Aim Rating", value: pearson.aim, color: "hsl(var(--chart-4))" },
    { name: "Utility Rating", value: pearson.util, color: "hsl(var(--chart-5))" },
  ], [pearson]);

  const calculateRegression = useCallback((data: any[], xKey: string, yKey: string, axisMin: number, axisMax: number) => {
    if (data.length < 2) return null;
    
    const validData = data.filter(item => 
      !isNaN(item[xKey]) && !isNaN(item[yKey]) && 
      isFinite(item[xKey]) && isFinite(item[yKey])
    );
    
    if (validData.length < 2) return null;
    
    const n = validData.length;
    const sumX = validData.reduce((sum, item) => sum + item[xKey], 0);
    const sumY = validData.reduce((sum, item) => sum + item[yKey], 0);
    const sumXY = validData.reduce((sum, item) => sum + item[xKey] * item[yKey], 0);
    const sumX2 = validData.reduce((sum, item) => sum + item[xKey] * item[xKey], 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const lineData = [
      { [xKey]: axisMin, [yKey]: slope * axisMin + intercept },
      { [xKey]: axisMax, [yKey]: slope * axisMax + intercept }
    ];
    
    return { slope, intercept, lineData };
  }, []);

  const getSampledData = useCallback((data: any[], key: string, maxPoints: number = 1000) => {
    if (data.length <= maxPoints) return data;
    
    const step = Math.ceil(data.length / maxPoints);
    const sampled = [];
    for (let i = 0; i < data.length; i += step) {
      sampled.push(data[i]);
    }
    return sampled;
  }, []);

  const getAxisScales = useCallback((data: any[], key: string) => {
    if (data.length === 0) return { min: 0, max: 100 };
    
    const values = data.map(item => item[key]).filter(val => !isNaN(val) && isFinite(val));
    if (values.length === 0) return { min: 0, max: 100 };
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    
    const padding = range * 0.1;
    
    let adjustedMin, adjustedMax;
    
    if (range === 0) {
      adjustedMin = min - 1;
      adjustedMax = max + 1;
    } else if (range < 1) {
      const precision = Math.pow(10, Math.floor(-Math.log10(range)) + 1);
      adjustedMin = Math.floor((min - padding) * precision) / precision;
      adjustedMax = Math.ceil((max + padding) * precision) / precision;
    } else if (range < 10) {
      adjustedMin = Math.floor((min - padding) * 2) / 2;
      adjustedMax = Math.ceil((max + padding) * 2) / 2;
    } else if (range < 100) {
      adjustedMin = Math.floor((min - padding) / 5) * 5;
      adjustedMax = Math.ceil((max + padding) / 5) * 5;
    } else {
      adjustedMin = Math.floor((min - padding) / 10) * 10;
      adjustedMax = Math.ceil((max + padding) / 10) * 10;
    }
    
    return { min: adjustedMin, max: adjustedMax };
  }, []);

  const getCurrentData = useCallback(() => {
    const { lr, hr, kd, aim, util } = chartData;
    
    switch (selectedMetric) {
      case "LR":
        return { 
          data: lr, 
          key: "lr", 
          name: "Leetify Rating", 
          ...getAxisScales(lr, "lr")
        };
      case "HR":
        return { 
          data: hr, 
          key: "hr", 
          name: "HLTV Rating", 
          ...getAxisScales(hr, "hr")
        };
      case "KD":
        return { 
          data: kd, 
          key: "kd", 
          name: "Kill/Death Ratio", 
          ...getAxisScales(kd, "kd")
        };
      case "AIM":
        return { 
          data: aim, 
          key: "aim", 
          name: "Aim Rating", 
          ...getAxisScales(aim, "aim")
        };
      case "Util":
        return { 
          data: util, 
          key: "util", 
          name: "Utility Rating", 
          ...getAxisScales(util, "util")
        };
      default:
        return { 
          data: aim, 
          key: "aim", 
          name: "Aim Rating", 
          ...getAxisScales(aim, "aim")
        };
    }
  }, [selectedMetric, chartData, getAxisScales]);

  const handleModeChange = useCallback((newMode: ChartMode) => {
    setIsLoading(true);
    setMode(newMode);
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  const handleMetricChange = useCallback((newMetric: MetricType) => {
    setIsMetricLoading(true);
    setSelectedMetric(newMetric);
    setTimeout(() => setIsMetricLoading(false), 200);
  }, []);

  const renderCorrelationsChart = useCallback(() => (
    <ResponsiveContainer width="100%" height={600}>
      <BarChart
        data={correlationData}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" className="text-muted-foreground" />
        <YAxis 
          domain={[-1, 1]}
          label={{ value: "Pearson Correlation", position: "left", angle: -90, offset: 0 }}
          className="text-muted-foreground"
        />
        <Tooltip 
          cursor={{ strokeDasharray: "3 3" }}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const dataPoint = payload[0];
              return (
                <div className="bg-card p-3 rounded-lg shadow-lg border border-border">
                  <div className="text-sm text-card-foreground">
                    <div className="font-semibold">{dataPoint.payload.name}</div>
                    <div className="text-muted-foreground">Correlation: {dataPoint.value?.toFixed(3)}</div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="value">
          {correlationData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
        <ReferenceLine y={0} stroke="#6b7280" strokeWidth={3} strokeDasharray="5 5" />
      </BarChart>
    </ResponsiveContainer>
  ), [correlationData]);

  const renderScatterPlot = useCallback(() => {
    const { data, key, name, min, max } = getCurrentData();
    
    const sampledData = getSampledData(data, key);
    
    const regression = calculateRegression(sampledData, key, "wr", min, max);
    
    return (
      <ResponsiveContainer width="100%" height={600}>
        <ComposedChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            type="number"
            dataKey={key}
            name={key}
            label={{ value: name, position: "bottom", offset: 0 }}
            domain={[min, max]}
            tickFormatter={(value) => value.toFixed(2)}
            className="text-muted-foreground"
          />
          <YAxis
            type="number"
            dataKey="wr"
            name="wr"
            unit="%"
            label={{
              value: "Win Rate (%)",
              position: "left",
              angle: -90,
              offset: 0,
            }}
            domain={[0, 100]}
            className="text-muted-foreground"
          />
          <Tooltip 
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const dataPoint = payload[0].payload;
                return (
                  <div className="bg-card p-3 rounded-lg shadow-lg border border-border">
                    <div className="text-sm text-card-foreground">
                      <div className="font-semibold">{name}: {dataPoint[key].toFixed(2)}</div>
                      <div className="text-muted-foreground">Win Rate: {dataPoint.wr.toFixed(1)}%</div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter 
            name={name} 
            data={sampledData} 
            fill="hsl(var(--primary))"
            isAnimationActive={false}
            shape="circle"
          />
          {regression && (
            <Line
              type="monotone"
              data={regression.lineData}
              dataKey="wr"
              stroke="#dc2626"
              strokeWidth={3}
              strokeDasharray="8 4"
              dot={false}
              name="Trend Line"
              connectNulls={true}
              isAnimationActive={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    );
  }, [getCurrentData, getSampledData, calculateRegression]);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-32">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-center p-4 bg-card rounded-lg border border-border shadow-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleModeChange("correlations")}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
              mode === "correlations"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span>Correlations</span>
          </button>
          
          <button
            onClick={() => handleModeChange("raw")}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
              mode === "raw"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span>Raw Data</span>
          </button>
        </div>

        {mode === "raw" && <div className="w-px h-8 bg-border mx-4"></div>}

        {mode === "raw" && (
          <div className="flex items-center space-x-1">
            {(["LR", "HR", "KD", "AIM", "Util"] as MetricType[]).map((metric) => (
              <button
                key={metric}
                onClick={() => handleMetricChange(metric)}
                disabled={isMetricLoading}
                className={`px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                  selectedMetric === metric
                    ? "bg-secondary text-secondary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                } ${isMetricLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {metric}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card rounded-lg p-6 border border-border shadow-lg">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          mode === "correlations" ? renderCorrelationsChart() : renderScatterPlot()
        )}
      </div>
    </div>
  );
}
