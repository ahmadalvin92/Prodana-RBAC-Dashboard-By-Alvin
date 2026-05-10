import { Boxes, CheckCircle2, Users, UserRoundCheck } from "lucide-react";
import { useEffect, useState } from "react";
import Alert from "../components/ui/Alert";
import Badge from "../components/ui/Badge";
import DataQueryAssistant from "../components/ui/DataQueryAssistant";
import LoadingState from "../components/ui/LoadingState";
import Table from "../components/ui/Table";
import { dashboardService } from "../services/dashboardService";
import { brand } from "../utils/brand";
import { formatCurrency, formatDate } from "../utils/formatters";

const StatCard = ({ label, value, icon: Icon, tone }) => (
  <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-muted">{label}</p>
        <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-md ${tone}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

const CompanyProfile = () => (
  <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-brand">Prodana Operations</p>
        <h2 className="mt-2 text-xl font-bold text-ink">Crowdfunding administration for SME funding workflows.</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          This workspace supports internal teams in maintaining user access, product records, and operational summaries for
          {brand.companyName}, a licensed SME funding platform powered by Protemus.
        </p>
      </div>
      <div className="grid min-w-0 grid-cols-3 gap-3 sm:min-w-[360px]">
        <div className="flex h-16 items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-3">
          <img src={brand.assets.protemus} alt="Protemus Capital" className="max-h-11 w-auto object-contain" />
        </div>
        <div className="flex h-16 items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-3">
          <img src={brand.assets.geneva} alt="Geneva Capital Group" className="max-h-11 w-auto object-contain" />
        </div>
        <div className="flex h-16 items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-3">
          <img src={brand.assets.ggi} alt="GGI" className="max-h-11 w-auto object-contain" />
        </div>
      </div>
    </div>
  </section>
);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await dashboardService.getStats();
        setStats(response.data);
      } catch (exception) {
        setError(exception.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return <LoadingState label="Loading dashboard..." />;
  }

  const userColumns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role", render: (item) => <Badge>{item.role.name}</Badge> },
    { key: "createdAt", header: "Created", render: (item) => formatDate(item.createdAt) },
  ];

  const productColumns = [
    { key: "name", header: "Product" },
    { key: "sku", header: "SKU" },
    { key: "price", header: "Price", render: (item) => formatCurrency(item.price) },
    { key: "stock", header: "Stock" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Daily overview for account access, products, and active records.</p>
      </div>
      <Alert message={error} />
      <CompanyProfile />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={stats?.cards.users || 0} icon={Users} tone="bg-blue-50 text-blue-700" />
        <StatCard
          label="Active Users"
          value={stats?.cards.activeUsers || 0}
          icon={UserRoundCheck}
          tone="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          label="Total Products"
          value={stats?.cards.products || 0}
          icon={Boxes}
          tone="bg-amber-50 text-amber-700"
        />
        <StatCard
          label="Active Products"
          value={stats?.cards.activeProducts || 0}
          icon={CheckCircle2}
          tone="bg-rose-50 text-rose-700"
        />
      </div>
      <DataQueryAssistant />
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-ink">Recent Users</h2>
          <Table columns={userColumns} data={stats?.recentUsers || []} />
        </section>
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-ink">Recent Products</h2>
          <Table columns={productColumns} data={stats?.recentProducts || []} />
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
