export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();
};

export const getInitialsColor = (initials: string): string => {
  switch (initials) {
    case 'AM':
      return 'bg-emerald-200';
    case 'EW':
      return 'bg-pink-200';
    default:
      return 'bg-purple-200';
  }
}; 