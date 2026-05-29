import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Phone, Building, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';

function getInitials(name) {
  if (!name || typeof name !== 'string') return 'U';
  return name.trim().split(/\s+/).map((p) => p[0]).join('').toUpperCase().slice(0, 2) || 'U';
}

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name ?? '',
        phone: user.phone ?? '',
        company: user.company ?? '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateProfile(formData);
    } catch (err) {
      setError(err?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-16 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
            <Link to="/dashboard">
              <ArrowLeft className="size-4" />
              Back to dashboard
            </Link>
          </Button>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
          Profile
        </h1>
        <p className="text-muted-foreground mb-8">
          Manage your account information
        </p>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-border">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-600/20 text-foreground text-lg font-semibold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{user?.name || 'User'}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm px-3 py-2.5">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="profile-name">Full name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="profile-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="pl-10 h-11 rounded-xl border-border/80"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="profile-email"
                    type="email"
                    value={user?.email ?? ''}
                    disabled
                    className="pl-10 h-11 rounded-xl border-border/80 bg-muted/50 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-phone">Phone (optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="profile-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                    className="pl-10 h-11 rounded-xl border-border/80"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-company">Company (optional)</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="profile-company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company"
                    className="pl-10 h-11 rounded-xl border-border/80"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 rounded-xl font-semibold"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 size-5 animate-spin" />
                    Saving…
                  </>
                ) : (
                  'Save changes'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
