import { db } from 'fb/firebase-client'
import { useState, useEffect, useRef } from 'react'
import { LoadingState } from './useCollection'

// an incredibly simple in-memory cache to avoid the page flickers while navigating
// the cache is updated every time the data updates
let cache: { [path: string]: any } = {}

function useDoc<T>(path: string) {
  // can be one of ['loading', 'loaded', 'doesNotExist', 'error']
  const [state, setState] = useState<LoadingState>(() =>
    cache[path] === undefined
      ? 'loading'
      : cache[path] === null
      ? 'doesNotExist'
      : 'loaded'
  )
  const [data, setData] = useState<null | ({ id: string } & T)>(
    () => cache[path] ?? null
  )
  const prevPath = useRef(path)
  useEffect(() => {
    if (prevPath.current !== path) {
      prevPath.current = path
      setData(null)
      setState('loading')
    }

    if (!path) {
      setData(null)
      setState('doesNotExist')
      return
    }

    return db.doc(path).onSnapshot(
      (doc) => {
        const exists = doc.exists
        setState(exists ? 'loaded' : 'doesNotExist')
        if (exists) {
          const docData = doc.data() as T
          setData({ ...docData, id: doc.id })
          cache[path] = docData
        } else {
          setData(null)
        }
      },
      (error) => {
        setData(null)
        setState('error')
      }
    )
  }, [path])
  return { state, data }
}

export default useDoc
