import type {NextPage} from 'next'
import Head from 'next/head'
import {useState} from 'react'
import Paginate from '../components/Paginate'
import ProductGrid from '../components/product/ProductGrid'
import Hero from '../components/elements/Hero'
import {useGetAllProductsQuery} from '../store/api/baseApi'
import {IProductFilter} from '../types/product'
import SearchForm from '../components/elements/SearchForm'
import QueryResults from '../components/QueryResult'
import {NextSeo} from 'next-seo'

const css = {
  main: 'pb-12 sm:pb-16',
  products: '',
  results: 'relative mt-10 sm:mt-14 max-w-site mx-auto px-4',
  resultsIcon: 'w-32 text-gray-200',
  resultsText: 'absolute text-2xl left-0 top-1/2 -translate-y-1/2 w-full text-center text-gray-700',
}

const QUERY_FILTER = {
  limit: 8,
  keyword: '',
}

const SearchPage: NextPage = () => {
  const [filter, setFilter] = useState<IProductFilter>(QUERY_FILTER)
  const {data, isLoading, isFetching} = useGetAllProductsQuery(filter)
  const {found = 0, total = 0, pages = 1, page = 1, products = []} = data || {}
  const showLoader = isLoading || isFetching

  const onSearchSubmit = (value: string) => {
    setFilter((filter: IProductFilter) => ({
      ...filter,
      keyword: value,
      page: undefined,
    }))
  }

  return (
    <div>
      <NextSeo title="Search" />
      <div className={css.main}>
        <Hero title="Search" />
        <SearchForm
          placeholder='Enter product name e.g. "chair"...'
          onSubmitValue={onSearchSubmit}
        />
        <div className={css.results}>
          <QueryResults
            isLoading={showLoader}
            page={page}
            limit={QUERY_FILTER.limit}
            total={total}
            found={found}
          >
            <ProductGrid data={products} isLoading={showLoader} skeletons={filter.limit} />
            <Paginate
              setFilter={setFilter}
              pages={!showLoader && pages > 1 ? pages : 0}
              page={page}
            />
          </QueryResults>
        </div>
      </div>
    </div>
  )
}

export default SearchPage
