import React from 'react'
import { screen } from '@testing-library/react'
import { render } from './test-utils'
import { App } from './App'

test('renders API Base', () => {
  render(<App />)
  const tokenfield = screen.getByText(/API base/i)
  expect(tokenfield).toBeInTheDocument()
})
