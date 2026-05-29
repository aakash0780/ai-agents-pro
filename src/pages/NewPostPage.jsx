import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { blogAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function NewPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(slug);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    excerpt: '',
    content: '',
  });
  const canCreatePost = user?.role === 'ADMIN';

  useEffect(() => {
    if (!isEditing || !slug) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    blogAPI
      .getPostBySlug(slug)
      .then(({ post }) => {
        if (cancelled) return;

        const canEdit = user?.role === 'ADMIN' || user?.id === post?.author?.id;
        if (!post || !canEdit) {
          setError('You do not have permission to edit this post.');
          return;
        }

        setFormData({
          id: post.id,
          title: post.title || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Failed to load post');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isEditing, slug, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim() || undefined,
        content: formData.content.trim(),
      };

      const { post } = isEditing
        ? await blogAPI.updatePost(formData.id, payload)
        : await blogAPI.createPost(payload);

      toast.success(isEditing ? 'Post updated.' : 'Post published.');
      navigate(`/blog/${post.slug}`);
    } catch (err) {
      setError(err?.message || `Failed to ${isEditing ? 'update' : 'create'} post`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] pt-16 pb-16 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isEditing && !canCreatePost) {
    return (
      <div className="min-h-[calc(100vh-4rem)] pt-16 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 mb-6 text-muted-foreground hover:text-foreground">
            <Link to="/blog">
              <ArrowLeft className="size-4" />
              Back to blog
            </Link>
          </Button>
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-4 text-sm text-destructive">
            You do not have permission to create posts.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-16 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 mb-6 text-muted-foreground hover:text-foreground">
          <Link to={isEditing && slug ? `/blog/${slug}` : '/blog'}>
            <ArrowLeft className="size-4" />
            Back to blog
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
          {isEditing ? 'Edit post' : 'New post'}
        </h1>
        <p className="text-muted-foreground mb-8">
          {isEditing ? 'Update your post' : 'Share your thoughts on AI & Technology'}
        </p>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{isEditing ? 'Edit post' : 'Create a post'}</CardTitle>
            <CardDescription>
              Title and content are required. Excerpt is optional and used in the blog list.
            </CardDescription>
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
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. How AI is Changing Software Development"
                  className="h-11 rounded-xl border-border/80"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt (optional)</Label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Short summary for the blog listing"
                  rows={2}
                  className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your post here. You can use plain text and line breaks."
                  rows={12}
                  className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[200px]"
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-xl font-semibold"
                  disabled={saving || (isEditing && !formData.id)}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 size-5 animate-spin" />
                      {isEditing ? 'Saving…' : 'Publishing…'}
                    </>
                  ) : (
                    isEditing ? 'Save changes' : 'Publish post'
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to={isEditing && slug ? `/blog/${slug}` : '/blog'}>Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
