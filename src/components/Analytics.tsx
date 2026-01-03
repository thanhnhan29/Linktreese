import { useState, useMemo } from "react";
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
import { MousePointer, Share2, BarChart3 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { usePageAnalytics } from "@/features/analytics";

interface AnalyticsProps {
  pageId: string;
  username: string;
  links: Array<{ id: string; title: string }>; // Used for future features
  blocks?: Array<{ id: string; title: string; type: string }>;
}

export default function Analytics({
  pageId,
  username,
  links: _links,
  blocks = [],
}: AnalyticsProps) {
  const [dateRange, setDateRange] = useState("7");

  // Fetch real analytics data from database
  const { analytics, loading, error } = usePageAnalytics({
    pageId,
    days: parseInt(dateRange),
    enabled: !!pageId,
  });

  // Stats from real data
  const stats = useMemo(() => {
    if (!analytics) {
      return {
        views: 0,
        clicks: 0,
        ctr: "0.00",
        subscribers: 0,
        revenue: 0,
      };
    }

    return {
      views: analytics.totalViews,
      clicks: analytics.totalClicks,
      ctr: analytics.averageCTR.toFixed(2),
      subscribers: 0, // Not implemented yet
      revenue: 0, // Not implemented yet
    };
  }, [analytics]);

  // Check if we have any data
  const hasData =
    analytics && (analytics.totalViews > 0 || analytics.totalClicks > 0);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-black">Analytics</h2>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-[#e0e2d9] p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#8129d9] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#676b5f]">Đang tải dữ liệu analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-black">Analytics</h2>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-red-200 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-red-600 mb-2">
              Lỗi tải dữ liệu
            </h3>
            <p className="text-[#676b5f]">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-black">Analytics</h2>
          <div className="w-5 h-5 bg-[#e0e2d9] rounded-full flex items-center justify-center">
            <span className="text-[#676b5f] text-[12px]">?</span>
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
              <span className="text-[#676b5f]">Views: {stats.views}</span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-[#2196f3] rounded-full" />
              <span className="text-[#676b5f]">Clicks: {stats.clicks}</span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-[#00bcd4] rounded-full" />
              <span className="text-[#676b5f]">CTR: {stats.ctr}%</span>
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
              <span className="text-[#676b5f]">Revenue: --</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts - Views & Clicks + CTR */}
      {!hasData ? (
        <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-[#f6f7f5] rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-[#676b5f]" />
            </div>
            <h3 className="text-lg font-medium text-black mb-2">
              Chưa có dữ liệu
            </h3>
            <p className="text-[#676b5f] text-center max-w-md">
              Chia sẻ link trang của bạn để bắt đầu theo dõi lượt xem và click.
              <br />
              <span className="text-sm">vielink.vn/{username}</span>
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Chart 1: Views & Clicks (Counts) */}
          <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
            <h3 className="text-black mb-4">Views & Clicks Over Time</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={analytics?.dailyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e2d9" />
                <XAxis
                  dataKey="date"
                  stroke="#676b5f"
                  tick={{ fill: "#676b5f", fontSize: 12 }}
                />
                <YAxis
                  stroke="#676b5f"
                  tick={{ fill: "#676b5f", fontSize: 12 }}
                  label={{
                    value: "Count",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#676b5f", fontSize: 12 },
                  }}
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
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2: Click Through Rate (%) */}
          <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
            <h3 className="text-black mb-4">Click Through Rate (CTR) Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analytics?.dailyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e2d9" />
                <XAxis
                  dataKey="date"
                  stroke="#676b5f"
                  tick={{ fill: "#676b5f", fontSize: 12 }}
                />
                <YAxis
                  stroke="#676b5f"
                  tick={{ fill: "#676b5f", fontSize: 12 }}
                  label={{
                    value: "CTR (%)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#676b5f", fontSize: 12 },
                  }}
                  domain={[0, "auto"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e0e2d9",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)}%`, "CTR"]}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="ctr"
                  stroke="#00bcd4"
                  name="Click Through Rate"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#00bcd4" }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Link Performance */}
      <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
        <h3 className="text-black mb-4">Link Performance</h3>

        {!analytics?.linkStats || analytics.linkStats.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#676b5f]">
              Chưa có dữ liệu click. Chia sẻ link của bạn để bắt đầu theo dõi!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {analytics.linkStats.map((stat) => (
              <div
                key={stat.linkId}
                className="flex items-center justify-between p-4 bg-[#f6f7f5] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <MousePointer className="w-4 h-4 text-[#676b5f]" />
                  <span className="text-black">{stat.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#676b5f]">{stat.clicks} clicks</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Block Performance */}
      {blocks.length > 0 && (
        <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
          <h3 className="text-black mb-4">Block Performance</h3>

          {!analytics?.blockStats || analytics.blockStats.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#676b5f]">
                Chưa có dữ liệu click trên blocks.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.blockStats.map((stat) => (
                <div
                  key={stat.blockId}
                  className="flex items-center justify-between p-4 bg-[#f6f7f5] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <MousePointer className="w-4 h-4 text-[#676b5f]" />
                    <div>
                      <span className="text-black">{stat.title}</span>
                      <span className="text-xs text-[#676b5f] ml-2">
                        ({stat.type})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#676b5f]">{stat.clicks} clicks</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Traffic Sources */}
      <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Share2 className="w-5 h-5 text-[#676b5f]" />
          <h3 className="text-black">Traffic sources</h3>
        </div>

        {!analytics?.trafficSources || analytics.trafficSources.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#676b5f]">
              Chưa có dữ liệu truy cập. Chia sẻ link của bạn để bắt đầu theo
              dõi!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.trafficSources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {analytics.trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e0e2d9",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value} views`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend with Stats */}
            <div className="flex flex-col justify-center space-y-4">
              {analytics.trafficSources.map((source) => (
                <div
                  key={source.name}
                  className="flex items-center justify-between p-3 bg-[#f6f7f5] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="text-black">{source.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#676b5f]">{source.value} views</span>
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
