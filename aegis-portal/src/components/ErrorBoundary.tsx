import React from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

type ErrorBoundaryState = {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="product-content">
          <Card className="empty-state">
            <h1>Something went wrong</h1>
            <p>The transparency dashboard could not render this view.</p>
            <Button onClick={() => window.location.reload()}>Reload</Button>
          </Card>
        </main>
      )
    }

    return this.props.children
  }
}
