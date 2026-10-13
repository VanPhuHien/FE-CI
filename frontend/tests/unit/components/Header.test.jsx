import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from '@/components/Header/Header'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { MOCK_AUTH_CONTEXT_DEFAULT } from '../../utils/mockData'
import { tr } from '../../utils/i18n'

vi.mock('@/context/AuthContext')
vi.mock('@/context/ThemeContext')

describe('Header', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ ...MOCK_AUTH_CONTEXT_DEFAULT })
    useTheme.mockReturnValue({ isDark: false, toggleTheme: vi.fn() })
  })

  it('language switch: toggles vi <-> en, updates UI text, <html lang> and persisted choice', async () => {
    const user = userEvent.setup()
    render(<Header onNavigate={vi.fn()} currentPath="/" />)
    const switchBtn = screen.getByRole('button', { name: 'Switch language' })

    expect(switchBtn).toHaveTextContent('VI')
    expect(screen.getAllByText(tr('nav:features')).length).toBeGreaterThan(0)

    await user.click(switchBtn)

    expect(switchBtn).toHaveTextContent('EN')
    expect(document.documentElement.lang).toBe('en')
    expect(localStorage.getItem('elingo_lng')).toBe('en')
    expect(screen.getAllByText(tr('nav:features')).length).toBeGreaterThan(0) // tr() lúc này trả bản en

    await user.click(switchBtn)
    expect(switchBtn).toHaveTextContent('VI')
    expect(document.documentElement.lang).toBe('vi')
  })
})
