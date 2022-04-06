// __tests__/index.test.jsx

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest'
import Home from '../pages/index'

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading')

    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('welcome to next.js with express with typescript!');
  })
})