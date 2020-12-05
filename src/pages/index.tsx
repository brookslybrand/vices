import useCollection from 'hooks/useCollection'

export default function Home() {
  const { state, docs } = useCollection('test')

  console.log({ state, docs })
  return <h1>A whole lot of nothing</h1>
}
