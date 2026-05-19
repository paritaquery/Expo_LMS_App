import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { EmptyState } from '../empty-state';

describe('EmptyState', () => {
  it('renders title and description', () => {
    const { getByText } = render(
      <EmptyState title="No items" description="Check back later." />
    );

    expect(getByText('No items')).toBeTruthy();
    expect(getByText('Check back later.')).toBeTruthy();
  });

  it('renders action when provided', () => {
    const { getByText } = render(
      <EmptyState
        title="No items"
        description="Check back later."
        action={<Text>Retry</Text>}
      />
    );

    expect(getByText('Retry')).toBeTruthy();
  });
});
