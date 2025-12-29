import { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Eye,
  MousePointer,
  Users,
  DollarSign,
  Share2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AnalyticsData {
  date: string;
  totalViews: number;
  uniqueViews: number;
  totalClicks: number;
  uniqueClicks: number;
  ctr: number;
}

interface LinkClick {
  linkId: string;
  timestamp: number;
  linkTitle: string;
}

interface TrafficSource {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface AnalyticsProps {
  username: string;
  links: Array<{ id: string; title: string }>;
}

export default function Analytics({
  username,
  links,
}: AnalyticsProps) {
  const [dateRange, setDateRange] = useState("7");
  const [analyticsData, setAnalyticsData] = useState<
    AnalyticsData[]
  >([]);
  const [linkClicks, setLinkClicks] = useState<LinkClick[]>([]);

  useEffect(() => {
    // Load click data from localStorage
    const savedClicks = localStorage.getItem(
      `analytics_${username}`,
    );
    if (savedClicks) {
      setLinkClicks(JSON.parse(savedClicks));
    }

    // Generate mock analytics data for demonstration
    const data = generateMockData(parseInt(dateRange));
    setAnalyticsData(data);
  }, [username, dateRange]);

  const generateMockData = (days: number): AnalyticsData[] => {
    const data: AnalyticsData[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const totalViews = Math.floor(Math.random() * 100) + 50;
      const uniqueViews = Math.floor(totalViews * 0.7);
      const totalClicks = Math.floor(Math.random() * 50) + 10;
      const uniqueClicks = Math.floor(totalClicks * 0.8);
      const ctr =
        totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

      data.push({
        date: formatDate(date),
        totalViews,
        uniqueViews,
        totalClicks,
        uniqueClicks,
        ctr: parseFloat(ctr.toFixed(2)),
      });
    }

    return data;
  };

  const formatDate = (date: Date): string => {
    const month = date.toLocaleString("en", { month: "short" });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const stats = useMemo(() => {
    const totalViews = analyticsData.reduce(
      (sum, d) => sum + d.totalViews,
      0,
    );
    const totalClicks = analyticsData.reduce(
      (sum, d) => sum + d.totalClicks,
      0,
    );
    const avgCTR =
      analyticsData.length > 0
        ? analyticsData.reduce((sum, d) => sum + d.ctr, 0) /
          analyticsData.length
        : 0;

    return {
      views: totalViews,
      clicks: totalClicks,
      ctr: avgCTR.toFixed(2),
      subscribers: 0,
      revenue: 0,
    };
  }, [analyticsData]);

  const linkStats = useMemo(() => {
    const stats = new Map<string, number>();
    linkClicks.forEach((click) => {
      const count = stats.get(click.linkId) || 0;
      stats.set(click.linkId, count + 1);
    });

    return Array.from(stats.entries())
      .map(([linkId, clicks]) => {
        const link = links.find((l) => l.id === linkId);
        return {
          linkId,
          title: link?.title || "Unknown",
          clicks,
        };
      })
      .sort((a, b) => b.clicks - a.clicks);
  }, [linkClicks, links]);

  // Generate traffic sources based on total views
  const trafficSources = useMemo(() => {
    const totalViews = stats.views;

    if (totalViews === 0) {
      return [];
    }

    // Define traffic source distribution percentages
    const sources = [
      { name: "Facebook", percentage: 35, color: "#1877f2" },
      { name: "TikTok", percentage: 25, color: "#000000" },
      { name: "Instagram", percentage: 15, color: "#e4405f" },
      { name: "Zalo", percentage: 10, color: "#0068ff" },
      {
        name: "Truy cập trực tiếp",
        percentage: 10,
        color: "#8bc34a",
      },
      { name: "Khác", percentage: 5, color: "#9e9e9e" },
    ];

    return sources.map((source) => ({
      name: source.name,
      value: Math.round((totalViews * source.percentage) / 100),
      percentage: source.percentage,
      color: source.color,
    }));
  }, [stats.views]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-black">Analytics</h2>
          <div className="w-5 h-5 bg-[#e0e2d9] rounded-full flex items-center justify-center">
            <span className="text-[#676b5f] text-[12px]">
              ?
            </span>
          </div>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 Days</SelectItem>
            <SelectItem value="14">14 Days</SelectItem>
            <SelectItem value="30">30 Days</SelectItem>
            <SelectItem value="90">90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Overview */}
      <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-black">Lifetime</h3>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-[#8bc34a] rounded-full" />
              <span className="text-[#676b5f]">
                Views: {stats.views}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-[#2196f3] rounded-full" />
              <span className="text-[#676b5f]">
                Clicks: {stats.clicks}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-[#00bcd4] rounded-full" />
              <span className="text-[#676b5f]">
                CTR: {stats.ctr}%
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-[#ff9800] rounded-full" />
              <span className="text-[#676b5f]">
                Subscribers: {stats.subscribers}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-[#9c27b0] rounded-full" />
              <span className="text-[#676b5f]">
                Revenue: --
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={analyticsData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e0e2d9"
            />
            <XAxis
              dataKey="date"
              stroke="#676b5f"
              tick={{ fill: "#676b5f", fontSize: 12 }}
            />
            <YAxis
              stroke="#676b5f"
              tick={{ fill: "#676b5f", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e0e2d9",
                borderRadius: "8px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line
              type="monotone"
              dataKey="totalViews"
              stroke="#8bc34a"
              name="Total Views"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="uniqueViews"
              stroke="#4caf50"
              name="Unique Views"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="totalClicks"
              stroke="#2196f3"
              name="Total Clicks"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="uniqueClicks"
              stroke="#03a9f4"
              name="Unique Clicks"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="ctr"
              stroke="#00bcd4"
              name="Click Through Rate"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Link Performance */}
      <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
        <h3 className="text-black mb-4">Link Performance</h3>

        {linkStats.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#676b5f]">
              No click data yet. Share your links to start
              tracking!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {linkStats.map((stat) => (
              <div
                key={stat.linkId}
                className="flex items-center justify-between p-4 bg-[#f6f7f5] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <MousePointer className="w-4 h-4 text-[#676b5f]" />
                  <span className="text-black">
                    {stat.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#676b5f]">
                    {stat.clicks} clicks
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Traffic Sources */}
      <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Share2 className="w-5 h-5 text-[#676b5f]" />
          <h3 className="text-black">Traffic sources</h3>
        </div>

        {trafficSources.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#676b5f]">
              Chưa có dữ liệu truy cập. Chia sẻ link của bạn để
              bắt đầu theo dõi!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e0e2d9",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [
                      `${value} views`,
                      "",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend with Stats */}
            <div className="flex flex-col justify-center space-y-4">
              {trafficSources.map((source) => (
                <div
                  key={source.name}
                  className="flex items-center justify-between p-3 bg-[#f6f7f5] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="text-black">
                      {source.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#676b5f]">
                      {source.value} views
                    </span>
                    <span className="text-black font-medium">
                      {source.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* See More Analytics */}
      <button className="w-full bg-white border border-[#e0e2d9] rounded-lg p-4 hover:bg-[#f6f7f5] transition-colors flex items-center justify-between">
        <span className="text-black">See more Analytics</span>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}