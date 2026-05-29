import React from 'react'
import { Link } from 'react-router-dom'

class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[RouteErrorBoundary]', error, info.componentStack)
  }

  handleRetry = () => {
    this.setState({ error: null })
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm font-medium text-[#ffb4b4]">
          {import.meta.env.DEV ? this.state.error.message : 'Something went wrong on this page.'}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={this.handleRetry}
            className="rounded-lg border border-[var(--border-warm)] px-4 py-2 text-sm text-[var(--text-2)] hover:border-[var(--green)] hover:text-[var(--green)]"
          >
            Try again
          </button>
          <Link
            to="/"
            className="rounded-lg border border-[var(--border-warm)] px-4 py-2 text-sm text-[var(--text-2)] no-underline hover:border-[var(--green)] hover:text-[var(--green)]"
          >
            Go home
          </Link>
        </div>
      </div>
    )
  }
}

export default RouteErrorBoundary
