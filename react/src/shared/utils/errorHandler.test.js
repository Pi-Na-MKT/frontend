import { handleApiError } from './errorHandler'

describe('errorHandler', () => {
  it('returns response detail when available', () => {
    const error = {
      response: {
        data: {
          detail: 'Test error message'
        }
      }
    }
    
    expect(handleApiError(error)).toEqual({ message: 'Test error message', status: undefined })
  })

  it('returns response message when detail not available', () => {
    const error = {
      response: {
        data: {
          message: 'Fallback message'
        }
      }
    }
    
    expect(handleApiError(error)).toEqual({ message: 'Fallback message', status: undefined })
  })

  it('returns default message for other errors', () => {
    const error = new Error('Unexpected error')
    
    expect(handleApiError(error)).toEqual({ message: 'Ocorreu um erro inesperado', status: null })
  })
})
