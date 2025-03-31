import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Table from '../components/Table/index';

interface TestUser {
  id: string;
  name: string;
  email: string;
}

const mockData: TestUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
  },
];

const columns = [
  {
    header: 'Name',
    accessor: (user: TestUser) => user.name,
    sortable: true,
  },
  {
    header: 'Email',
    accessor: (user: TestUser) => user.email,
    sortable: true,
  },
];

describe('Table Component', () => {
  it('renders table with data', () => {
    render(<Table data={mockData} columns={columns} />);

    // Check if headers are rendered
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('displays empty message when no data is provided', () => {
    render(<Table data={[]} columns={columns} emptyMessage='No users found' />);
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('handles sorting', () => {
    render(<Table data={mockData} columns={columns} />);

    // Click on Name column header
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);

    // Get all name cells
    const nameCells = screen
      .getAllByRole('cell')
      .filter((cell) =>
        mockData.some((user) => user.name === cell.textContent)
      );

    // Check if names are sorted alphabetically
    expect(nameCells[0].textContent).toBe('Jane Smith');
    expect(nameCells[1].textContent).toBe('John Doe');
  });

  it('handles pagination', () => {
    // Create 15 items to test pagination
    const largeData = Array.from({ length: 15 }, (_, i) => ({
      id: String(i + 1),
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    }));

    render(<Table data={largeData} columns={columns} pageSize={5} />);
  });
});
