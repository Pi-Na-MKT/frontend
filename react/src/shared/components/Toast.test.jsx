import { render, screen } from '@testing-library/react'
import { vi, beforeEach, afterEach } from 'vitest'
import Toast from './Toast'

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders success message', () => {
    render(<Toast message="Success!" type="success" onClose={() => {}} />)
    expect(screen.getByText('Success!')).toBeInTheDocument()
  })

  it('renders error message', () => {
    render(<Toast message="Error!" type="error" onClose={() => {}} />)
    expect(screen.getByText('Error!')).toBeInTheDocument()
  })

  it('auto-dismisses after delay', () => {
    const onClose = vi.fn()
    render(<Toast message="Test" type="success" onClose={onClose} />)
    
    vi.advanceTimersByTime(3000)
    expect(onClose).toHaveBeenCalled()
  })
})
