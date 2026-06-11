import { startOfDay, subDays, addDays, isSameDay, isBefore, parseISO, format } from 'date-fns';
import { ja } from 'date-fns/locale';

export function calculateStreak(completions: string[]): number {
  if (completions.length === 0) return 0;
  const sorted = [...completions].sort().reverse();
  let streak = 0;
  let cursor = startOfDay(new Date());
  for (const dateStr of sorted) {
    const d = parseISO(dateStr);
    if (isSameDay(d, cursor)) {
      streak++;
      cursor = subDays(cursor, 1);
    } else if (isBefore(d, cursor)) {
      break;
    }
  }
  return streak;
}

export function calculateBestStreak(completions: string[]): number {
  if (completions.length === 0) return 0;
  const sorted = [...completions].sort();
  let best = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = parseISO(sorted[i - 1]);
    const curr = parseISO(sorted[i]);
    if (isSameDay(curr, subDays(prev, -1))) {
      current++;
      if (current > best) best = current;
    } else {
      current = 1;
    }
  }
  return best;
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function tomorrowISO(): string {
  return format(addDays(new Date(), 1), 'yyyy-MM-dd');
}

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'M月d日(E)', { locale: ja });
}

export function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    days.push(format(subDays(new Date(), i), 'yyyy-MM-dd'));
  }
  return days;
}

export function formatGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'おはようございます';
  if (h < 18) return 'こんにちは';
  return 'こんばんは';
}
