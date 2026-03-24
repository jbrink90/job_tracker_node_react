import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import Home from '..';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    tr: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock PageFooter
vi.mock('../../components/PageFooter', () => ({
  PageFooter: () => <footer data-testid="page-footer">Footer</footer>,
}));

// Mock EditSlideout to avoid mdxeditor import issues
vi.mock('../../components/EditSlideout', () => ({
  EditSlideout: () => <div data-testid="edit-slideout">EditSlideout</div>,
}));

describe('Home Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderHome = () => {
    return render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
  };

  it('renders the JobTrackr logo and title in the navbar', () => {
    renderHome();
    expect(screen.getByText('JobTrackr')).toBeInTheDocument();
    expect(screen.getAllByAltText('JobTrackr Logo')).toHaveLength(2);
  });

  it('renders navigation buttons in the AppBar', () => {
    renderHome();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
  });

  it('navigates to /login when Login or Get Started (navbar) is clicked', async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getByRole('button', { name: 'Login' }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');

    mockNavigate.mockClear();

    await user.click(screen.getByRole('button', { name: 'Get Started' }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders the hero section', () => {
    renderHome();
    expect(screen.getByText(/Keep Track of Your/i)).toBeInTheDocument();
    expect(screen.getByText('Dream Gig')).toBeInTheDocument();
  });

  it('has "Get Started Free" button that navigates to /dashboard', async () => {
    const user = userEvent.setup();
    renderHome();
    await user.click(screen.getByRole('button', { name: /get started free/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('has "See How It Works" button', async () => {
    const user = userEvent.setup();
    renderHome();
    await user.click(screen.getByRole('button', { name: /see how it works/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders the demo job table', () => {
    renderHome();
    expect(screen.getByText('TechCorp')).toBeInTheDocument();
    expect(screen.getByText('Offer Received')).toBeInTheDocument();
  });

  it('renders the three feature panels', () => {
    renderHome();
    expect(screen.getByText('Update with Markdown')).toBeInTheDocument();
    expect(screen.getByText('Track Status')).toBeInTheDocument();
    expect(screen.getByText('Magic Login')).toBeInTheDocument();
  });

  it('renders the PageFooter', () => {
    renderHome();
    expect(screen.getByTestId('page-footer')).toBeInTheDocument();
  });
});