import { useState, useEffect } from 'react'
import { firebase, db } from 'firebaseApp'

type OrderByType = {
  criteria: null | string | firebase.firestore.FieldPath
  desc?: boolean
}

type Where =
  | []
  | [
      fieldPath: string | firebase.firestore.FieldPath,
      opStr: firebase.firestore.WhereFilterOp,
      value: any
    ]

export type LoadingState = 'loading' | 'loaded' | 'doesNotExist' | 'error'
export default function useCollection<T>(
  path: null | string,
  orderBy: OrderByType = { criteria: null, desc: false },
  where: Where = []
) {
  const [state, setState] = useState<LoadingState>(() => 'loading')
  const [docs, setDocs] = useState<Array<{ id: string } & T>>([])

  const [queryField, queryOperator, queryValue] = where
  useEffect(() => {
    // if there is not a path, bail
    if (!path) return

    let collection: firebase.firestore.Query<firebase.firestore.DocumentData> = db.collection(
      path
    )

    if (orderBy.criteria) {
      collection = collection.orderBy(
        orderBy.criteria,
        orderBy.desc ? 'desc' : 'asc'
      )
    }

    if (queryField) {
      if (queryOperator === undefined) {
        throw new Error('queryOperator must not be undefined')
      }
      collection = collection.where(queryField, queryOperator, queryValue)
    }

    return collection.onSnapshot(
      (snapshot) => {
        if (snapshot.empty) {
          setState('doesNotExist')
          setDocs([])
          return
        }
        const docs = snapshot.docs.map((doc) => {
          // I'm not actually sure if type casting is right, I'm kind of copying https://github.com/CSFrequency/react-firebase-hooks/blob/master/firestore/useCollection.ts#L64
          const data = doc.data() as T
          return { ...data, id: doc.id }
        })

        // pass back the loading state, the docs, and the collection so a component
        // can detect if the data has been updated
        setDocs(docs)
        setState('loaded')
      },
      (error) => {
        console.error(error)
        setState('error')
      }
    )
  }, [
    orderBy.criteria,
    orderBy.desc,
    path,
    queryField,
    queryOperator,
    queryValue,
  ])

  return { docs, state, collection: path }
}
