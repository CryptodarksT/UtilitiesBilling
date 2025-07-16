import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle 
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function StatsCards() {
  // Fetch real stats from API
  const { data: realStats, isLoading } = useQuery({
    queryKey: ["/api/stats/dashboard"],
    queryFn: () => apiRequest("GET", "/api/stats/dashboard"),
    retry: false,
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="card-shadow">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Use real data or show error
  const stats = realStats ? [
    {
      title: "Hóa đơn chưa thanh toán",
      value: realStats.unpaid || "0",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Đã thanh toán",
      value: realStats.paid || "0",
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Sắp hết hạn",
      value: realStats.dueSoon || "0",
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      title: "Quá hạn",
      value: realStats.overdue || "0",
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
  ] : [
    {
      title: "Hóa đơn chưa thanh toán",
      value: "0",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Đã thanh toán",
      value: "0",
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Sắp hết hạn",
      value: "0",
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      title: "Quá hạn",
      value: "0",
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title} className="card-shadow hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`rounded-full p-3 ${stat.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
