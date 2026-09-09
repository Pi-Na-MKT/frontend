import { renderHook, act } from '@testing-library/react'
import { useForm } from './useForm'

describe('useForm', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() =>
      useForm({ name: '', email: '' })
    )
    
    expect(result.current.values).toEqual({ name: '', email: '' })
  })

  it('updates values when handleChange is called', () => {
    const { result } = renderHook(() =>
      useForm({ name: '', email: '' })
    )
    
    act(() => {
      result.current.handleChange('name', 'Test')
    })
    
    expect(result.current.values.name).toBe('Test')
  })

  it('resets values to initial', () => {
    const { result } = renderHook(() =>
      useForm({ name: '', email: '' })
    )
    
    act(() => {
      result.current.handleChange('name', 'Test')
    })
    
    act(() => {
      result.current.reset()
    })
    
    expect(result.current.values).toEqual({ name: '', email: '' })
  })
})
