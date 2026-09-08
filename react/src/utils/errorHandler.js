export function handleApiError(error, fallbackMessage = 'Ocorreu um erro inesperado') {
  if (error.response) {
    const message =
      error.response.data?.detail || error.response.data?.message || fallbackMessage
    return { message, status: error.response.status }
  } else if (error.request) {
    return { message: 'Erro de conexão. Verifique sua internet.', status: null }
  } else {
    return { message: fallbackMessage, status: null }
  }
}