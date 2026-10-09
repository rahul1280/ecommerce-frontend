import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SearchX, X } from 'lucide-react';
import { getProducts } from '../api/productApi';
import ProductGrid, { ProductSkeletons } from '../components/ProductGrid';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import Message from '../components/Message';
import { CATEGORIES, capitalize, formatPrice } from '../utils/helpers';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
  { value: 'oldest', label: 'Oldest first' },
];

const PAGE_SIZE = 12;

// The URL holds the filters (/products?category=books&sort=price_asc&page=2),
// so search, category, price and sorting always work together, results can be shared and the back button works.
const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Math.max(parseInt(searchParams.get('page'), 10) || 1, 1);

  const [form, setForm] = useState({ search, minPrice, maxPrice });
  const [filterError, setFilterError] = useState('');
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Keep the form in sync when the URL changes (for example from a home page link)
  useEffect(() => {
    setForm({ search, minPrice, maxPrice });
    setFilterError('');
  }, [search, minPrice, maxPrice]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    getProducts({
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      page,
      limit: PAGE_SIZE,
    })
      .then((response) => {
        if (cancelled) return;
        setProducts(response.data);
        setPagination(response.pagination);
      })
      .catch((err) => {
        if (cancelled) return;
        setProducts([]);
        setPagination(null);
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, category, minPrice, maxPrice, sort, page]);

  // Merge changes into the URL and drop empty values
  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === '' || value === undefined || value === null) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    setSearchParams(next);
  };

  // Used by the search box and by the price filter, so pressing Enter in either applies both
  const handleFilterSubmit = (event) => {
    event.preventDefault();

    const min = form.minPrice.trim();
    const max = form.maxPrice.trim();

    if (min !== '' && max !== '' && Number(min) > Number(max)) {
      setFilterError('The minimum price cannot be higher than the maximum price.');
      return;
    }

    setFilterError('');
    updateParams({ search: form.search.trim(), minPrice: min, maxPrice: max, page: '' });
  };

  const handleClear = () => {
    setSearchParams({});
  };

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setFilterError('');
  };

  const hasFilters = search || category || minPrice || maxPrice || sort !== 'newest';

  // Small removable tags that show which filters are active
  const activeFilters = [];
  if (search) {
    activeFilters.push({ key: 'search', label: `Search: "${search}"`, clear: { search: '' } });
  }
  if (category) {
    activeFilters.push({ key: 'category', label: `Category: ${capitalize(category)}`, clear: { category: '' } });
  }
  if (minPrice || maxPrice) {
    const priceLabel =
      minPrice && maxPrice
        ? `${formatPrice(minPrice)} to ${formatPrice(maxPrice)}`
        : minPrice
          ? `From ${formatPrice(minPrice)}`
          : `Up to ${formatPrice(maxPrice)}`;
    activeFilters.push({ key: 'price', label: priceLabel, clear: { minPrice: '', maxPrice: '' } });
  }

  const emptyText = search
    ? `No products match "${search}"${category ? ` in ${capitalize(category)}` : ''}. Try a different search or remove some filters.`
    : hasFilters
      ? 'No products match these filters. Try removing some of them.'
      : 'There are no products yet. Please check back soon.';

  return (
    <div className="container page">
      <div className="page-header">
        <h1>Products</h1>
        <p aria-live="polite">
          {pagination && !loading ? `${pagination.total} product${pagination.total === 1 ? '' : 's'} found` : ' '}
        </p>
      </div>

      <form className="search-bar" onSubmit={handleFilterSubmit} role="search">
        <Search size={20} aria-hidden="true" />
        <input
          id="search"
          name="search"
          type="search"
          value={form.search}
          onChange={handleChange}
          placeholder="Search by name, brand or description"
          aria-label="Search products"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      <div className="category-chips" role="group" aria-label="Filter by category">
        <button
          type="button"
          className={category === '' ? 'category-chip category-chip-active' : 'category-chip'}
          aria-pressed={category === ''}
          onClick={() => updateParams({ category: '', page: '' })}
        >
          All
        </button>
        {CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            className={category === item ? 'category-chip category-chip-active' : 'category-chip'}
            aria-pressed={category === item}
            onClick={() => updateParams({ category: item, page: '' })}
          >
            {capitalize(item)}
          </button>
        ))}
      </div>

      <div className="listing-toolbar">
        <form className="price-filter" onSubmit={handleFilterSubmit}>
          <div className="toolbar-field">
            <label htmlFor="minPrice">Min price</label>
            <input id="minPrice" name="minPrice" type="number" min="0" inputMode="numeric" value={form.minPrice} onChange={handleChange} placeholder="0" />
          </div>
          <div className="toolbar-field">
            <label htmlFor="maxPrice">Max price</label>
            <input id="maxPrice" name="maxPrice" type="number" min="0" inputMode="numeric" value={form.maxPrice} onChange={handleChange} placeholder="Any" />
          </div>
          <button type="submit" className="btn btn-outline">
            Apply
          </button>
        </form>

        <div className="toolbar-field toolbar-sort">
          <label htmlFor="sort">Sort by</label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => updateParams({ sort: event.target.value === 'newest' ? '' : event.target.value, page: '' })}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Message type="error">{filterError}</Message>

      {activeFilters.length > 0 && (
        <div className="active-filters">
          {activeFilters.map((filter) => (
            <span key={filter.key} className="filter-tag">
              {filter.label}
              <button type="button" onClick={() => updateParams({ ...filter.clear, page: '' })} aria-label={`Remove filter: ${filter.label}`}>
                <X size={14} aria-hidden="true" />
              </button>
            </span>
          ))}
          <button type="button" className="clear-filters" onClick={handleClear}>
            Clear all filters
          </button>
        </div>
      )}

      {loading && <ProductSkeletons count={PAGE_SIZE} />}

      {!loading && error && <Message type="error">Unable to load products. {error}</Message>}

      {!loading && !error && products.length === 0 && (
        <EmptyState icon={SearchX} title="No products found" text={emptyText}>
          {hasFilters && (
            <button className="btn btn-primary" onClick={handleClear}>
              Clear all filters
            </button>
          )}
        </EmptyState>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <ProductGrid products={products} />
          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            onChange={(newPage) => {
              updateParams({ page: newPage === 1 ? '' : String(newPage) });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}
    </div>
  );
};

export default Products;
