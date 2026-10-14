export interface SearchPageProps {
  searchParams: Promise<{q?: string; query?: string; search?: string;}>;
}