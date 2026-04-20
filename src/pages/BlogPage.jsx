import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { blogAPI } from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PenLine, Calendar, User, ArrowRight, Loader2, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function BlogPage() {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    blogAPI
      .getPosts(true)
      .then(({ posts: list }) => {
        if (!cancelled) setPosts(list);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Failed to load posts');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const canManagePost = (post) => user?.role === 'ADMIN' || user?.id === post.author?.id;

  const handleDelete = async (post) => {
    setDeletingId(post.id);
    try {
      await blogAPI.deletePost(post.id);
      setPosts((current) => current.filter((item) => item.id !== post.id));
      toast.success('Post deleted.');
    } catch (err) {
      toast.error(err?.message || 'Failed to delete post');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] pt-16 pb-16 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-16 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Blog
            </h1>
            <p className="mt-1 text-muted-foreground">
              AI & Technology insights and updates
            </p>
          </div>
          {isAuthenticated && (
            <Button asChild className="shrink-0 gap-2">
              <Link to="/blog/new">
                <PenLine className="size-4" />
                New post
              </Link>
            </Button>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {posts.length === 0 && !error && (
          <Card className="border-border/80">
            <CardContent className="py-12 text-center text-muted-foreground">
              <p className="mb-4">No posts yet.</p>
              {isAuthenticated ? (
                <Button asChild>
                  <Link to="/blog/new">Write the first post</Link>
                </Button>
              ) : (
                <p className="text-sm">Sign in to create a post.</p>
              )}
            </CardContent>
          </Card>
        )}

        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.id}>
              <Card className="border-border/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <User className="size-3.5" />
                    <span>{post.author?.name || post.author?.email || 'Author'}</span>
                    <span className="opacity-60">·</span>
                    <Calendar className="size-3.5" />
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-xl font-semibold text-foreground hover:text-primary hover:underline"
                  >
                    {post.title}
                  </Link>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground line-clamp-2 mb-4">
                    {post.excerpt || post.content?.slice(0, 160) || 'No excerpt.'}
                    {(post.content?.length || 0) > 160 && !post.excerpt ? '…' : ''}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="ghost" size="sm" asChild className="gap-1 text-primary p-0 h-auto">
                      <Link to={`/blog/${post.slug}`}>
                        Read more
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    {canManagePost(post) && (
                      <>
                        <Button variant="outline" size="sm" asChild className="gap-2">
                          <Link to={`/blog/${post.slug}/edit`}>
                            <Pencil className="size-4" />
                            Edit
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="gap-2" disabled={deletingId === post.id}>
                              <Trash2 className="size-4" />
                              {deletingId === post.id ? 'Deleting…' : 'Delete'}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This permanently removes "{post.title}". This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-white hover:bg-destructive/90"
                                onClick={() => handleDelete(post)}
                              >
                                Delete post
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
