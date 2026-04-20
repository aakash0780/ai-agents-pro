import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { blogAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
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
import { Calendar, User, ArrowLeft, Loader2, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    blogAPI
      .getPostBySlug(slug)
      .then(({ post: p }) => {
        if (!cancelled) setPost(p);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Post not found');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  const canManagePost = user?.role === 'ADMIN' || user?.id === post?.author?.id;

  const handleDelete = async () => {
    if (!post) return;
    setDeleting(true);
    try {
      await blogAPI.deletePost(post.id);
      toast.success('Post deleted.');
      navigate('/blog');
    } catch (err) {
      toast.error(err?.message || 'Failed to delete post');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] pt-16 pb-16 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-[calc(100vh-4rem)] pt-16 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-destructive mb-4">{error || 'Post not found'}</p>
          <Button asChild variant="outline">
            <Link to="/blog">Back to blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-[calc(100vh-4rem)] pt-16 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 mb-6 text-muted-foreground hover:text-foreground">
          <Link to="/blog">
            <ArrowLeft className="size-4" />
            Back to blog
          </Link>
        </Button>

        <header className="mb-8">
          {canManagePost && (
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Button variant="outline" size="sm" asChild className="gap-2">
                <Link to={`/blog/${post.slug}/edit`}>
                  <Pencil className="size-4" />
                  Edit post
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-2" disabled={deleting}>
                    <Trash2 className="size-4" />
                    {deleting ? 'Deleting…' : 'Delete post'}
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
                      onClick={handleDelete}
                    >
                      Delete post
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="size-4" />
              {post.author?.name || post.author?.email || 'Author'}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
          </div>
        </header>

        {post.excerpt && (
          <p className="text-lg text-muted-foreground border-l-4 border-primary/30 pl-4 mb-8">
            {post.excerpt}
          </p>
        )}

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
            {post.content}
          </div>
        </div>
      </div>
    </article>
  );
}
