"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Loader2, ChevronDown, MousePointerClick } from "lucide-react";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="h-[250px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-bluelight" />
    </div>
  ),
});

type TimeRange = "week" | "month" | "year";

export default function PlatformActivityDetailCard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any>(null);

  const timeRanges: { key: TimeRange; label: string }[] = [
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "year", label: "This Year" },
  ];

  // Fetch data based on time range
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));

        let categories: string[] = [];
        let dataPoints = 0;

        if (timeRange === "week") {
          categories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
          dataPoints = 7;
        } else if (timeRange === "month") {
          categories = ["Week 1", "Week 2", "Week 3", "Week 4"];
          dataPoints = 4;
        } else {
          categories = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          dataPoints = 12;
        }

        const baseValue = 8000;
        const variance = 3000;
        const data = Array.from(
          { length: dataPoints },
          (_, i) => baseValue + Math.floor(Math.random() * variance + i * 500)
        );

        setChartData({
          categories,
          series: [{ name: "Total Clicks", data }],
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const chartOptions: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        height: 250,
        zoom: { enabled: false },
        toolbar: { show: false },
        fontFamily: "Figtree, sans-serif",
      },
      colors: ["#f97316"], // Orange
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          shadeIntensity: 0.1,
          gradientToColors: ["#fdba74"],
          inverseColors: false,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
      stroke: { curve: "smooth", width: 3 },
      dataLabels: { enabled: false },
      tooltip: {
        enabled: true,
        theme: "light",
        y: { formatter: (val) => val.toLocaleString("en-US") + " clicks" },
      },
      xaxis: {
        categories: chartData?.categories || [],
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: { formatter: (val) => val.toFixed(0) },
      },
      grid: {
        show: true,
        borderColor: "#f1f1f1",
        strokeDashArray: 4,
      },
      legend: { show: false },
    }),
    [chartData]
  );

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 font-figtree">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <MousePointerClick className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-[1.6em] font-bold text-slate-800">
              Platform Activity
            </h3>
            <p className="text-[1.1em] text-slate-400">
              Clicks and views over time
            </p>
          </div>
        </div>

        {/* Time Range Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsRangeOpen(!isRangeOpen)}
            className="flex items-center gap-2 text-[1.3em] font-medium text-slate-600 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300"
          >
            {timeRanges.find((r) => r.key === timeRange)?.label}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isRangeOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isRangeOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsRangeOpen(false)}
              />
              <div className="absolute top-full right-0 mt-2 p-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-20">
                {timeRanges.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => {
                      setTimeRange(r.key);
                      setIsRangeOpen(false);
                    }}
                    className={`block w-full text-left text-[1.2em] px-3 py-2 rounded-lg transition-colors ${
                      timeRange === r.key
                        ? "bg-orange-50 text-orange-600 font-semibold"
                        : "text-slate-600 hover:bg-gray-50"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[250px] -ml-2">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-200" />
          </div>
        ) : (
          <Chart
            options={chartOptions}
            series={chartData?.series || []}
            type="area"
            height="100%"
            width="100%"
          />
        )}
      </div>
    </div>
  );
}
