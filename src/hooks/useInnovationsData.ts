import { useEffect, useState } from 'react'
import { useExists, useJson } from '@artifact/client/hooks'
import { innovationsSchema, type Innovation } from '../types/innovation'

const useInnovationsData = () => {
  const exists = useExists('innovations.json')
  const raw = useJson('innovations.json')
  const [data, setData] = useState<Innovation[]>([])

  useEffect(() => {
    if (raw !== undefined) {
      setData(innovationsSchema.parse(raw))
    }
  }, [raw])

  const loading = exists === null || (exists && raw === undefined)
  const error = exists === false ? 'innovations.json not found' : null

  return { data, loading, error }
}

export default useInnovationsData
