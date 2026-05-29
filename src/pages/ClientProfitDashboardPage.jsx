import { Link } from 'react-router-dom';
import { ArrowLeft, Bot, DollarSign, Gauge, HandCoins, MessageSquareHeart, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const metricCards = [
  {
    title: 'Monthly revenue influenced',
    value: '$186,400',
    trend: '+18.2% vs last month',
    icon: DollarSign,
  },
  {
    title: 'Support cost saved',
    value: '$42,900',
    trend: '31% lower ticket handling cost',
    icon: HandCoins,
  },
  {
    title: 'Leads captured',
    value: '1,284',
    trend: '+23% qualified leads',
    icon: Users,
  },
  {
    title: 'Response-time improvement',
    value: '89%',
    trend: 'From 4m 12s to 28s',
    icon: Gauge,
  },
];

const roiSignals = [
  {
    label: 'Automation ROI',
    value: 312,
    suffix: '%',
    description: 'Revenue and cost impact after platform + setup spend.',
  },
  {
    label: 'Estimated profit impact',
    value: 97200,
    prefix: '$',
    description: 'Net monthly profit contribution from AI-led workflows.',
  },
];

const channelLift = [
  { name: 'Website chat conversion lift', value: 74 },
  { name: 'WhatsApp follow-up recovery', value: 68 },
  { name: 'Lead qualification automation', value: 81 },
  { name: 'Tier-1 support deflection', value: 77 },
];

const monthlySnapshot = [
  { month: 'Jan', influencedRevenue: '$132k', supportSavings: '$28k', qualifiedLeads: 932 },
  { month: 'Feb', influencedRevenue: '$149k', supportSavings: '$31k', qualifiedLeads: 1008 },
  { month: 'Mar', influencedRevenue: '$164k', supportSavings: '$37k', qualifiedLeads: 1139 },
  { month: 'Apr', influencedRevenue: '$186k', supportSavings: '$43k', qualifiedLeads: 1284 },
];

function formatSignalValue(signal) {
  if (signal.prefix) {
    return `${signal.prefix}${signal.value.toLocaleString()}`;
  }

  if (signal.suffix) {
    return `${signal.value}${signal.suffix}`;
  }

  return String(signal.value);
}

export function ClientProfitDashboardPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050507] pt-16 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Button variant="ghost" size="sm" asChild className="-ml-2 mb-3 gap-2 text-[#8b949e] hover:text-[#f2f2f2]">
              <Link to="/dashboard">
                <ArrowLeft className="size-4" />
                Back to dashboard
              </Link>
            </Button>
            <h1 className="font-[system-ui] text-3xl font-semibold tracking-tight text-[#f2f2f2] sm:text-4xl">
              Client Profit Dashboard
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-[#b8b3b0] sm:text-base">
              ROI snapshot for sales, support, and automation performance. Demo values are mocked and ready to be replaced by API data.
            </p>
          </div>
          <div className="rounded-xl border border-[#3d3a39] bg-[#101010] px-4 py-3 text-sm text-[#8b949e]">
            Last updated: <span className="font-semibold text-[#f2f2f2]">Today</span>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((metric) => (
            <Card key={metric.title} className="border-[#3d3a39] bg-[#101010] shadow-[rgba(92,88,85,0.2)_0_0_15px]">
              <CardHeader className="pb-3">
                <CardDescription className="text-[#8b949e]">{metric.title}</CardDescription>
                <CardTitle className="flex items-center justify-between gap-3 text-3xl text-[#f2f2f2]">
                  <span>{metric.value}</span>
                  <span className="rounded-lg border border-[#3d3a39] bg-[#050507] p-2">
                    <metric.icon className="size-5 text-[#00d992]" />
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-[#00d992]">{metric.trend}</CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card className="border-[#3d3a39] bg-[#101010] shadow-[rgba(92,88,85,0.2)_0_0_15px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#f2f2f2]">
                <TrendingUp className="size-5 text-[#00d992]" />
                ROI Signals
              </CardTitle>
              <CardDescription className="text-[#8b949e]">Key profit and efficiency outcomes.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {roiSignals.map((signal) => (
                <article key={signal.label} className="rounded-xl border border-[#3d3a39] bg-[#050507] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8b949e]">{signal.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-[#f2f2f2]">{formatSignalValue(signal)}</p>
                  <p className="mt-2 text-sm text-[#b8b3b0]">{signal.description}</p>
                </article>
              ))}
            </CardContent>
          </Card>

          <Card className="border-[#3d3a39] bg-[#101010] shadow-[rgba(92,88,85,0.2)_0_0_15px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#f2f2f2]">
                <Bot className="size-5 text-[#00d992]" />
                Automation Lift by Workflow
              </CardTitle>
              <CardDescription className="text-[#8b949e]">
                Relative impact contribution across high-volume AI workflows.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {channelLift.map((item) => (
                <article key={item.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <p className="text-[#f2f2f2]">{item.name}</p>
                    <p className="font-semibold text-[#00d992]">{item.value}%</p>
                  </div>
                  <div className="h-2 rounded-full bg-[#1b1b1b]">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#00d992] via-[#4fe0bc] to-[#9cf8dd] transition-all duration-500"
                      style={{ width: `${item.value}%` }}
                      role="progressbar"
                      aria-label={item.name}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={item.value}
                    />
                  </div>
                </article>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-6">
          <Card className="border-[#3d3a39] bg-[#101010] shadow-[rgba(92,88,85,0.2)_0_0_15px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#f2f2f2]">
                <MessageSquareHeart className="size-5 text-[#00d992]" />
                Monthly Performance Snapshot
              </CardTitle>
              <CardDescription className="text-[#8b949e]">Trend view of influenced revenue, support savings, and lead capture.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#3d3a39] text-left text-[#8b949e]">
                      <th className="py-3 font-medium">Month</th>
                      <th className="py-3 font-medium">Revenue Influenced</th>
                      <th className="py-3 font-medium">Support Savings</th>
                      <th className="py-3 font-medium">Qualified Leads</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlySnapshot.map((row) => (
                      <tr key={row.month} className="border-b border-[#1f1f1f] text-[#f2f2f2]">
                        <td className="py-3 font-medium">{row.month}</td>
                        <td className="py-3">{row.influencedRevenue}</td>
                        <td className="py-3">{row.supportSavings}</td>
                        <td className="py-3">{row.qualifiedLeads.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
