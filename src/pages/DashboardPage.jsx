import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LayoutDashboard, User, Settings, ArrowRight, Sparkles, PenLine } from 'lucide-react';

function getInitials(name) {
  if (!name || typeof name !== 'string') return 'U';
  return name.trim().split(/\s+/).map((p) => p[0]).join('').toUpperCase().slice(0, 2) || 'U';
}

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-16 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back. Here’s an overview of your account.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {/* Profile summary card */}
          <Card className="border-border/80 shadow-sm overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="size-5 text-primary" />
                Your profile
              </CardTitle>
              <CardDescription>
                View and edit your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-border shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-600/20 text-foreground text-xl font-semibold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{user?.name || 'User'}</p>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                {user?.company && (
                  <p className="text-sm text-muted-foreground mt-0.5">{user.company}</p>
                )}
              </div>
              <Button asChild variant="outline" className="shrink-0 gap-2">
                <Link to="/profile">
                  Edit profile
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                Quick actions
              </CardTitle>
              <CardDescription>
                Get started with AI Agents Pro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start gap-2 h-11">
                <Link to="/blog">
                  <LayoutDashboard className="size-4" />
                  Blog (AI & Technology)
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start gap-2 h-11">
                <Link to="/blog/new">
                  <PenLine className="size-4" />
                  New post
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start gap-2 h-11">
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
