'use client'

import { Component, type ReactNode } from 'react'

interface AssetBoundaryProps {
  /** Human-readable name for the log line. */
  label: string
  /** Rendered in place of `children` if they throw while loading. */
  fallback: ReactNode
  children: ReactNode
}

interface AssetBoundaryState {
  failed: boolean
}

/**
 * Keeps the world usable when an asset fails to load (CLAUDE.md §42): renders
 * `fallback` instead of the failed subtree and logs what failed, rather than
 * letting the error unmount the whole canvas.
 */
export class AssetBoundary extends Component<AssetBoundaryProps, AssetBoundaryState> {
  state: AssetBoundaryState = { failed: false }

  static getDerivedStateFromError(): AssetBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error(`[assets] ${this.props.label} failed to load; using fallback.`, error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
