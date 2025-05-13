import api from './api'

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed')
  }
}

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials)
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed')
  }
}


export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}