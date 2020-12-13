import Head from 'next/head'

function Tobacco() {
  return (
    <main className="flex flex-col items-center">
      <Head>
        <title>Add purchase</title>
      </Head>
      <form
        className="mt-8 space-y-4 w-80"
        onSubmit={(e) => {
          console.log('hey')
          e.preventDefault()
        }}
      >
        <h1 className="text-4xl ">Add purchase</h1>
        <div>
          <Label className="text-lg" htmlFor="date">
            Purchase date *
          </Label>
          <input id="date" className="w-full" type="date" required />
        </div>

        <div>
          <Label className="text-lg" htmlFor="description">
            Name *
          </Label>
          <input className="block w-full" id="name" type="text" required />
        </div>

        <div>
          <Label className="text-lg" htmlFor="description">
            Amount (oz) *
          </Label>
          <input
            className="block w-full"
            id="name"
            type="number"
            required
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <Label className="text-lg" htmlFor="description">
            Description
          </Label>
          <textarea className="block w-full" id="description" />
        </div>

        <div>
          <Label className="text-lg" htmlFor="image">
            Add image
          </Label>
          <input type="file" id="image" accept="image/*" />
        </div>

        <button
          className="w-full py-2 text-2xl font-medium text-pink-100 bg-yellow-700 rounded-md"
          type="submit"
        >
          Submit
        </button>
      </form>
    </main>
  )
}

function Label({ htmlFor, ...props }: React.ComponentPropsWithoutRef<'label'>) {
  return <label htmlFor={htmlFor} className="text-4xl" {...props} />
}

export default Tobacco
