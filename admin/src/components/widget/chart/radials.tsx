'USE CLIENT';
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { getOrderReportsByDuration } from "@/services/reports";
import {TResponse, OrderReport } from "@/types/shared";

interface RadialsChartProps {
  selectChartDuration: string; // Adjust the type based on your actual usage
}



const RadialsChart: React.FC<RadialsChartProps> = ({ selectChartDuration }) => {
  const [data, setData] = useState<OrderReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const response = await getOrderReportsByDuration({ duration: selectChartDuration });
        console.log("response", response);
        setData(
          (response?.data as unknown as OrderReport[]).map((item) => ({
            status: item.status || "Unknown",
            totalOrders: item.totalOrders || 0,
            totalSubTotalPrice: item.totalSubTotalPrice || 0,
            totalProducts: item.totalProducts || 0,
          })) || []
        );
      } catch (error) {
        console.error("Failed to fetch order report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [selectChartDuration]);

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;

  const rawSeries = data.map((item) => item.totalOrders);
  const labels = data.map((item) => item.status);
  const totalOrders = rawSeries.reduce((sum, value) => sum + value, 0);
  const series = rawSeries.map((value) =>
    totalOrders === 0 ? 0 : Math.round((value / totalOrders) * 100)
  );
  console.log("series", series);
  console.log("labels", labels);


  const options: ApexOptions = {
    chart: { toolbar: { show: true } },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "30%",
        },
        track: {
          background: "#E2E8F0",
          strokeWidth: "85%",
        },
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
            formatter: (val) => `${val}%`,
          },
          total: {
            show: true,
            label: "Total",
            formatter: () => "100%",
          },
        },
      },
    },
    tooltip: {
      enabled: true,
      custom: function ({ seriesIndex }) {
        const item = data[seriesIndex];
        if (!item) return "";

        return `
          <div style="padding: 10px; font-size: 14px;">
            <strong>Status:</strong> ${item.status} <br/>
            <strong>Total Orders:</strong> ${item.totalOrders} <br/>
            <strong>Total Products:</strong> ${item.totalProducts} <br/>
            <strong>Total SubTotal Price:</strong> $${item.totalSubTotalPrice.toFixed(2)} <br/>
          </div>
        `;
      },
    },
    labels,
    colors: ["#4669FA", "#FA916B", "#50C793", "#0CE7FA"],
  };

  return (
    <div className="py-[30px]">
      <Chart options={options} series={series} type="radialBar" height={340} />
    </div>
  );
};

export default RadialsChart;
