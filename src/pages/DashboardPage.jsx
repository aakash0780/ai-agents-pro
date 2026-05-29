import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LayoutDashboard, User, Settings, ArrowRight, Sparkles, PenLine, TrendingUp } from 'lucide-react';

function getInitials(name) {
  if (!name || typeof name !== 'string') return 'U';
  return name.trim().split(/\s+/).map((p) => p[0]).join('').toUpperCase().slice(0, 2) || 'U';
}

export function DashboardPage() {
  const { user } = useAuth();
  const canCreatePost = user?.role === 'ADMIN';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050507] pt-24 pb-16 text-[#f2f2f2]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative mb-8 overflow-hidden rounded-lg border border-[#3d3a39] bg-[#101010] p-6 shadow-[rgba(92,88,85,0.2)_0_0_15px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(0,217,146,0.16),transparent_42%)]" aria-hidden="true" />
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00d992]">User area</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#f2f2f2]">
            Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-[#b8b3b0]">
              Welcome back. Manage your profile, review client profit reporting, and continue your AI automation setup.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {/* Profile summary card */}
          <Card className="overflow-hidden border-[#3d3a39] bg-[#101010] shadow-[rgba(92,88,85,0.2)_0_0_15px]">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-[#f2f2f2]">
                <User className="size-5 text-[#00d992]" />
                Your profile
              </CardTitle>
              <CardDescription className="text-[#8b949e]">
                View and edit your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Avatar className="h-16 w-16 shrink-0 border-2 border-[#3d3a39]">
                <AvatarFallback className="bg-[#0d1512] text-xl font-semibold text-[#00d992]">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold text-[#f2f2f2]">{user?.name || 'User'}</p>
                <p className="truncate text-sm text-[#8b949e]">{user?.email}</p>
                {user?.company && (
                  <p className="mt-0.5 text-sm text-[#8b949e]">{user.company}</p>
                )}
              </div>
              <Button asChild variant="outline" className="shrink-0 gap-2 border-[#3d3a39] bg-[#050507] text-[#f2f2f2] hover:border-[#00d992]/50 hover:bg-[#0d1512] hover:text-[#00d992]">
                <Link to="/profile">
                  Edit profile
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="border-[#3d3a39] bg-[#101010] shadow-[rgba(92,88,85,0.2)_0_0_15px]">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-[#f2f2f2]">
                <Sparkles className="size-5 text-[#00d992]" />
                Workspace shortcuts
              </CardTitle>
              <CardDescription className="text-[#8b949e]">
                Protected routes and high-intent account actions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="h-11 w-full justify-start gap-2 border border-[#00d992]/60 bg-[#00d992] text-[#050507] hover:bg-[#2fd6a1]">
                <Link to="/get-started">
                  <Sparkles className="size-4" />
                  Get started intake
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 w-full justify-start gap-2 border-[#3d3a39] bg-[#050507] text-[#f2f2f2] hover:border-[#00d992]/50 hover:bg-[#0d1512] hover:text-[#00d992]">
                <Link to="/blog">
                  <LayoutDashboard className="size-4" />
                  Blog (AI & Technology)
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 w-full justify-start gap-2 border-[#3d3a39] bg-[#050507] text-[#f2f2f2] hover:border-[#00d992]/50 hover:bg-[#0d1512] hover:text-[#00d992]">
                <Link to="/client-profit-dashboard">
                  <TrendingUp className="size-4" />
                  Client profit dashboard
                </Link>
              </Button>
              {canCreatePost ? (
                <Button asChild variant="outline" className="h-11 w-full justify-start gap-2 border-[#3d3a39] bg-[#050507] text-[#f2f2f2] hover:border-[#00d992]/50 hover:bg-[#0d1512] hover:text-[#00d992]">
                  <Link to="/blog/new">
                    <PenLine className="size-4" />
                    New post
                  </Link>
                </Button>
              ) : null}
              <Button asChild variant="outline" className="h-11 w-full justify-start gap-2 border-[#3d3a39] bg-[#050507] text-[#f2f2f2] hover:border-[#00d992]/50 hover:bg-[#0d1512] hover:text-[#00d992]">
                <Link to="/profile">
                  <Settings className="size-4" />
                  Account settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
