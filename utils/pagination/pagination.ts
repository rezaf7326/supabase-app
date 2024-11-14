import { PaginationMetadata } from './pagination-metadata.interface';

export class Pagination {
  private readonly _totalItems: number;
  private readonly _totalPages: number;
  private readonly _page: number;
  private readonly _pageSize: number;

  constructor(totalItems: number, page: number, pageSize: number) {
    this._totalItems = totalItems;
    this._totalPages = Math.ceil(totalItems / pageSize);
    this._page = page;
    this._pageSize = pageSize;
  }

  get totalPages(): number {
    return this._totalPages;
  }

  get totalItems(): number {
    return this._totalItems;
  }

  get prevPage(): number | null {
    return this._totalItems
      ? this.isPageInRange(this._page - 1)
        ? this._page - 1
        : null
      : null;
  }

  get currPage(): number | null {
    return this._totalItems
      ? this.isPageInRange(this._page)
        ? this._page
        : null
      : null;
  }

  get nextPage(): number | null {
    return this._totalItems
      ? this.isPageInRange(this._page + 1)
        ? this._page + 1
        : null
      : null;
  }

  /**
   * actual page size regarding the edge cases
   */
  get pageSize(): number {
    if (!this._totalItems || !this.isPageInRange(this._page)) {
      return 0;
    }
    const skippedItems = (this._page - 1) * this._pageSize;

    return this._totalItems - (skippedItems + this._pageSize) >= 0
      ? this._pageSize
      : this._totalItems - skippedItems;
  }

  get paginatedMetadata(): PaginationMetadata {
    return {
      prevPage: this.prevPage,
      currPage: this.currPage,
      nextPage: this.nextPage,
      pageSize: this.pageSize,
      totalPages: this.totalPages,
      totalItems: this.totalItems,
    };
  }

  private isPageInRange(page: number): boolean {
    return 0 < page && page <= this._totalPages;
  }
}
