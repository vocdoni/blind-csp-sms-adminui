import React from 'react'
import { screen } from '@testing-library/react'
import { render } from './test-utils'
import { App } from './App'

test('renders token input', () => {
  render(<App />)
  const tokenfield = screen.getByText(/Token/i)
  expect(tokenfield).toBeInTheDocument()
})
