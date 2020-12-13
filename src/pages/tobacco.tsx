function Tobacco() {
  return (
    <main className="flex flex-col items-center">
      <form
        className="mt-8 space-y-4 w-80"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <h1 className="text-4xl ">Add purchase</h1>
        {/* <label></label> */}
        <input className="w-full" type="date" />
      </form>
    </main>
  )
}

export default Tobacco
