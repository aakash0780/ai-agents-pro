import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Page not found</CardTitle>
          <p className="text-muted-foreground mt-2">
            The page you’re looking for doesn’t exist or may have moved.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="w-full sm:w-auto">
            <Link to="/">Go to Home</Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link to="/contact">Contact us</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

