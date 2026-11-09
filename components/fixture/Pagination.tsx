import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <nav
      aria-label='Pagination'
      className='mt-6 flex items-center justify-center gap-4'
    >
      <Button
        type='button'
        variant='outline'
        size='sm'
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </Button>
      <span aria-live='polite' className='text-sm text-muted-foreground'>
        Page {page} of {pageCount}
      </span>
      <Button
        type='button'
        variant='outline'
        size='sm'
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
