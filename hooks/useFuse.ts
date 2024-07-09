import Fuse, { IFuseOptions } from "fuse.js"
import { useCallback, useEffect, useMemo, useState } from "react"

const useFuse = <T>(list: T[], keys: string[]) => {
  const [filterQuery, setFilterQuery] = useState("")
  const [filterResults, setFilterResults] = useState(list)

  const fuseOptions: IFuseOptions<T> = useMemo(
    () => ({
      keys,
      threshold: 0.4,
    }),
    [keys]
  )

  const fuse = useMemo(() => new Fuse<T>(list, fuseOptions), [list])

  const handleSearch = useCallback(() => {
    if (!filterQuery) return
    const results = fuse.search(filterQuery)
    setFilterResults(results.map((result) => result.item))
  }, [filterQuery, list])

  useEffect(() => {
    if (list && list.length > 0) {
      if (!filterQuery) {
        setFilterResults(list)
        return
      }
      handleSearch()
    }
  }, [filterQuery, list, handleSearch])

  return {
    setFilterQuery,
    filterQuery,
    filterResults,
  }
}

export default useFuse
