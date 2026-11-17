export type LoanStatus =
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'Borrowed'
  | 'Returned'
  | 'Cancelled';

export interface Book {
  id: string;
  category_id: string;
  category_name: string;
  title: string;
  author: string;
  publisher: string;
  publication_year: number;
  isbn: string;
  description: string;
  cover_image: string;
  stock_total: number;
  stock_borrowed: number;
  stock_reserved: number;
  is_active: boolean;
  pages?: number;
  badge?: 'Staff Pick' | 'Hot Sci-Fi' | 'Masterpiece' | 'Terpopuler' | 'Baru';
  color_accent?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_name: string;
  color: string;
}

export interface LoanItem {
  id: string;
  loan_request_id: string;
  book_id: string;
  book: Book;
  quantity: number;
}

export interface LoanRequest {
  id: string;
  request_code: string;
  borrower_name: string;
  phone: string;
  email?: string;
  status: LoanStatus;
  admin_note?: string;
  pickup_deadline?: string;
  borrowed_at?: string;
  due_date?: string;
  returned_at?: string;
  created_at: string;
  updated_at: string;
  items: LoanItem[];
}

export interface LibraryServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  tag: string;
}

export interface SiteSettings {
  library_name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  operating_hours: string;
  open_status: 'OPEN' | 'CLOSED';
  max_books_per_loan: number;
  loan_duration_days: number;
  pickup_deadline_hours: number;
}
