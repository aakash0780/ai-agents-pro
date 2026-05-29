import { useEffect, useMemo, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { BellRing, Globe2, Monitor, RefreshCw, Search, Smartphone, Tablet, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { getSocketUrl, visitorsAPI } from '@/lib/api';

function relativeTime(value) {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.floor(diff / 60000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} day ago`;
}

function maskIp(ip) {
  if (!ip || ip === 'unknown') return 'unknown';
  const parts = ip.split('.');
  if (parts.length !== 4) return ip;
  return `${parts.slice(0, 3).join('.')}.xxx`;
}

function referrerLabel(referrer) {
  if (!referrer || referrer === 'direct') return 'direct';
  try {
    return new URL(referrer).hostname.replace(/^www\./, '');
  } catch {
    return referrer;
  }
}

function deviceIcon(device) {
  if (device === 'mobile') return <Smartphone className="h-4 w-4 text-[#00d992]" />;
  if (device === 'tablet') return <Tablet className="h-4 w-4 text-[#00d992]" />;
  return <Monitor className="h-4 w-4 text-[#00d992]" />;
}

function StatCard({ title, value, detail, icon }) {
  const StatIcon = icon;

  return (
    <div className="rounded-lg border border-[#3d3a39] bg-[#101010] p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[#8b949e]">{title}</p>
        <StatIcon className="h-4 w-4 text-[#00d992]" />
      </div>
      <p className="text-3xl font-semibold text-[#00d992]">{value}</p>
      <p className="mt-2 text-sm text-[#b8b3b0]">{detail}</p>
    </div>
  );
}

export function VisitorDashboard() {
  const [stats, setStats] = useState({ total: 0, today: 0, countries: 0, devices: {}, recent: [] });
  const [visitors, setVisitors] = useState([]);
  const [connected, setConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [query, setQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [toastVisitor, setToastVisitor] = useState(null);

  const fetchDashboardData = async () => {
    const [statsResponse, visitorsResponse] = await Promise.all([
      visitorsAPI.getStats(),
      visitorsAPI.getVisitors({ limit: 50 }),
    ]);
    return { statsResponse, visitorsResponse };
  };

  const applyDashboardData = ({ statsResponse, visitorsResponse }) => {
    setStats(statsResponse);
    setVisitors(visitorsResponse.visitors || []);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    let active = true;

    fetchDashboardData()
      .then((data) => {
        if (active) applyDashboardData(data);
      })
      .catch((error) => {
        toast.error(error?.message || 'Unable to load visitor dashboard');
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const socket = io(getSocketUrl(), {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });
    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join-admin');
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('new-visitor', (visitor) => {
      setVisitors((current) => [visitor, ...current].slice(0, 50));
      setStats((current) => ({
        ...current,
        total: current.total + 1,
        today: current.today + 1,
        recent: [visitor, ...(current.recent || [])].slice(0, 10),
        devices: {
          ...current.devices,
          [visitor.device]: (current.devices?.[visitor.device] || 0) + 1,
        },
      }));
      setLastUpdated(new Date());
      setToastVisitor(visitor);
      window.setTimeout(() => setToastVisitor(null), 8000);
    });

    return () => socket.disconnect();
  }, []);

  const filteredVisitors = useMemo(() => {
    const term = query.trim().toLowerCase();
    return visitors.filter((visitor) => {
      const matchesDevice = deviceFilter === 'all' || visitor.device === deviceFilter;
      const haystack = [
        visitor.city,
        visitor.region,
        visitor.country,
        visitor.browser,
        visitor.os,
        visitor.page,
        visitor.referrer,
        visitor.ip,
      ].join(' ').toLowerCase();
      return matchesDevice && (!term || haystack.includes(term));
    });
  }, [visitors, query, deviceFilter]);

  const deviceTotal = Object.values(stats.devices || {}).reduce((sum, count) => sum + count, 0) || 1;
  const deviceRows = ['desktop', 'mobile', 'tablet'].map((device) => {
    const count = stats.devices?.[device] || 0;
    return {
      device,
      count,
      percent: Math.round((count / deviceTotal) * 100),
    };
  });

  const topCountries = useMemo(() => {
    const counts = visitors.reduce((acc, visitor) => {
      const country = visitor.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});
    const max = Math.max(1, ...Object.values(counts));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, count]) => ({ country, count, percent: Math.round((count / max) * 100) }));
  }, [visitors]);

  return (
    <div className="min-h-screen bg-[#050507] px-4 pb-16 pt-24 text-[#f2f2f2] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-[#3d3a39] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#00d992]/30 bg-[#00d992]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#00d992]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#00d992]" />
                Live
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-[#8b949e]">
                {connected ? <Wifi className="h-4 w-4 text-[#00d992]" /> : <WifiOff className="h-4 w-4" />}
                {connected ? 'Connected to real-time stream' : 'Connecting to stream'}
              </span>
            </div>
            <h1 className="text-3xl font-normal text-[#f2f2f2]">Live Visitor Dashboard</h1>
            <p className="mt-2 text-sm text-[#8b949e]">
              Last updated {lastUpdated ? lastUpdated.toLocaleTimeString() : 'loading...'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => fetchDashboardData().then(applyDashboardData).catch((error) => toast.error(error?.message || 'Refresh failed'))}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#3d3a39] px-4 text-sm text-[#f2f2f2] transition hover:border-[#00d992]"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Visitor statistics">
          <StatCard title="Today's Visitors" value={stats.today} detail="Visitors today" icon={BellRing} />
          <StatCard title="Total Visitors" value={stats.total} detail="All-time tracked visitors" icon={Globe2} />
          <StatCard title="Countries" value={stats.countries} detail="Unique countries reached" icon={Globe2} />
          <StatCard
            title="Device Split"
            value={`${deviceRows[0].percent}%`}
            detail={`${deviceRows[0].percent}% Desktop · ${deviceRows[1].percent}% Mobile · ${deviceRows[2].percent}% Tablet`}
            icon={Monitor}
          />
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="rounded-lg border border-[#3d3a39] bg-[#101010]">
            <div className="flex flex-col gap-3 border-b border-[#3d3a39] p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#f2f2f2]">Real-time Visitor Feed</h2>
                <p className="text-sm text-[#8b949e]">Showing the latest 50 visits</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b949e]" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search visitors"
                    className="h-10 rounded-md border border-[#3d3a39] bg-[#050507] pl-9 pr-3 text-sm text-[#f2f2f2] outline-none focus:border-[#00d992]"
                  />
                </label>
                <select
                  value={deviceFilter}
                  onChange={(event) => setDeviceFilter(event.target.value)}
                  className="h-10 rounded-md border border-[#3d3a39] bg-[#050507] px-3 text-sm text-[#f2f2f2] outline-none focus:border-[#00d992]"
                >
                  <option value="all">All devices</option>
                  <option value="desktop">Desktop</option>
                  <option value="mobile">Mobile</option>
                  <option value="tablet">Tablet</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead className="bg-[#050507] text-xs uppercase tracking-[0.14em] text-[#8b949e]">
                  <tr>
                    {['Time', 'Location', 'Device', 'Browser', 'OS', 'Page', 'Referrer', 'IP'].map((heading) => (
                      <th key={heading} className="px-4 py-3 font-medium">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {filteredVisitors.map((visitor, index) => (
                      <Motion.tr
                        key={visitor.id}
                        initial={{ opacity: 0, y: -8, backgroundColor: 'rgba(0,217,146,0.16)' }}
                        animate={{ opacity: 1, y: 0, backgroundColor: index % 2 === 0 ? '#101010' : '#050507' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="border-t border-[#3d3a39]"
                      >
                        <td className="px-4 py-3 text-[#b8b3b0]">{relativeTime(visitor.timestamp)}</td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-[#f2f2f2]">{visitor.city}, {visitor.country}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-2 capitalize text-[#b8b3b0]">
                            {deviceIcon(visitor.device)}
                            {visitor.device}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#b8b3b0]">{visitor.browser}</td>
                        <td className="px-4 py-3 text-[#b8b3b0]">{visitor.os}</td>
                        <td className="max-w-[190px] truncate px-4 py-3 text-[#00d992]">{visitor.page}</td>
                        <td className="max-w-[160px] truncate px-4 py-3 text-[#b8b3b0]">{referrerLabel(visitor.referrer)}</td>
                        <td className="px-4 py-3 font-mono text-xs text-[#8b949e]">{maskIp(visitor.ip)}</td>
                      </Motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          <aside className="space-y-6">
            <section className="rounded-lg border border-[#3d3a39] bg-[#101010] p-5">
              <h2 className="text-lg font-semibold text-[#f2f2f2]">Top Countries</h2>
              <div className="mt-5 space-y-4">
                {topCountries.length ? topCountries.map((item) => (
                  <div key={item.country}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-[#b8b3b0]">{item.country}</span>
                      <span className="text-[#8b949e]">{item.count}</span>
                    </div>
                    <progress className="visitor-progress" value={item.percent} max="100" aria-label={`${item.country} visitor share`} />
                  </div>
                )) : (
                  <p className="text-sm text-[#8b949e]">No country data yet.</p>
                )}
              </div>
            </section>

            <section className="rounded-lg border border-[#3d3a39] bg-[#101010] p-5">
              <h2 className="text-lg font-semibold text-[#f2f2f2]">Device Chart</h2>
              <div className="mt-5 space-y-4">
                {deviceRows.map((item) => (
                  <div key={item.device}>
                    <div className="mb-1 flex justify-between text-sm capitalize">
                      <span className="text-[#b8b3b0]">{item.device}</span>
                      <span className="text-[#8b949e]">{item.count} · {item.percent}%</span>
                    </div>
                    <progress className="visitor-progress" value={item.percent} max="100" aria-label={`${item.device} visitor share`} />
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </div>

      <AnimatePresence>
        {toastVisitor ? (
          <Motion.div
            initial={{ opacity: 0, x: 24, y: 24 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 24, y: 24 }}
            className="fixed bottom-5 right-5 z-[120] w-[min(360px,calc(100vw-2rem))] rounded-lg border border-[#00d992] bg-[#101010] p-4 shadow-[0_0_30px_rgba(0,217,146,0.18)]"
          >
            <p className="text-sm font-semibold text-[#f2f2f2]">New visitor</p>
            <p className="mt-1 text-sm text-[#b8b3b0]">
              {toastVisitor.city}, {toastVisitor.country} · {toastVisitor.device} · {toastVisitor.browser}
            </p>
          </Motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
