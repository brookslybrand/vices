import Head from 'next/head'
import { Machine, assign, EventObject } from 'xstate'
import { useMachine } from '@xstate/react'
import { format } from 'date-fns'
import clsx from 'clsx'
import { db } from 'firebaseApp'
import { useEffect } from 'react'

interface Context {
  date: null | Date
  name: null | string
  amount: null | number
  description: null | string
  imageUrl: null | string
}

const initialContext: Context = {
  date: null,
  name: null,
  amount: null,
  description: null,
  imageUrl: null,
}

const purchaseMachine = Machine(
  {
    id: 'purchase',
    context: initialContext,
    initial: 'inputting',
    states: {
      inputting: {
        initial: 'check',
        on: {
          UPDATE_CONTEXT: {
            target: '.check',
            actions: 'updateContext',
          },
        },
        states: {
          incomplete: {},
          // middle state is to check whether or not the new context means the data is properly filled out
          check: {
            always: [
              { target: 'complete', cond: 'isComplete' },
              { target: 'incomplete' },
            ],
          },
          complete: {
            on: {
              SUBMIT: '#purchase.uploading',
            },
          },
        },
      },
      uploading: {
        invoke: {
          id: 'upload',
          src: 'upload',
          onDone: { target: 'uploaded' },
          onError: { target: 'failed' },
        },
      },
      uploaded: {
        entry: ['clearContext'],
        on: {
          UPDATE_CONTEXT: {
            target: 'inputting',
            actions: 'updateContext',
          },
        },
      },
      // TODO: make the failures a little more helpful
      failed: {
        entry: (context, event) => {
          console.error(event.data)
          window.alert('Something went wrong! Please try again')
        },
        always: 'inputting',
      },
    },
  },
  {
    actions: {
      updateContext: assign<Context, any>((context, event) => ({
        ...context,
        ...(event as EventObject & { data: Partial<Context> }).data, // this is due to a TS bug https://github.com/davidkpiano/xstate/issues/1198
      })),
      clearContext: assign(() => initialContext),
    },
    guards: {
      isComplete: ({ date, name, amount }) => {
        if (date === null) return false
        if (name === null || name === '') return false
        if (amount === null || amount <= 0) return false
        return true
      },
    },
    services: {
      upload: (context) => db.collection('tobacco-purchases').add(context),
    },
  }
)

function Tobacco() {
  const [state, send] = useMachine(purchaseMachine)

  const handleUpdate = (newContext: Partial<Context>) =>
    send('UPDATE_CONTEXT', { data: newContext })

  const { date, name, amount, description, imageUrl } = state.context
  const submitDisabled = !state.matches('inputting.complete')

  console.log(state.value)

  // TODO: delete
  useEffect(() => {
    handleUpdate({
      date: new Date(),
      name: 'Brooks',
      amount: 1.76,
    })
  }, [])

  return (
    <main className="flex flex-col items-center">
      <Head>
        <title>Add purchase</title>
      </Head>
      <form
        className="mt-8 space-y-4 w-80"
        onSubmit={(e) => {
          e.preventDefault()
          send('SUBMIT')
        }}
      >
        <h1 className="text-4xl ">Add purchase</h1>
        <div>
          <Label className="text-lg" htmlFor="date">
            Purchase date *
          </Label>
          <input
            id="date"
            className="w-full"
            type="date"
            value={date ? format(date, 'yyyy-MM-dd') : ''}
            onChange={(e) => handleUpdate({ date: new Date(e.target.value) })}
            required
          />
        </div>

        <div>
          <Label className="text-lg" htmlFor="name">
            Name *
          </Label>
          <input
            className="block w-full"
            id="name"
            type="text"
            value={name ?? ''}
            onChange={(e) => handleUpdate({ name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label className="text-lg" htmlFor="amount">
            Amount (oz) *
          </Label>
          <input
            className="block w-full"
            id="amount"
            type="number"
            value={amount ?? ''}
            onChange={(e) => handleUpdate({ amount: Number(e.target.value) })}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <Label className="text-lg" htmlFor="description">
            Description
          </Label>
          <textarea
            className="block w-full"
            id="description"
            value={description ?? ''}
            onChange={(e) => handleUpdate({ description: e.target.value })}
          />
        </div>

        <div>
          <Label className="text-lg" htmlFor="image">
            Add image
          </Label>
          <input
            type="file"
            id="image"
            accept="image/*"
            value={imageUrl ?? ''}
            onChange={(e) => handleUpdate({})} // TODO: implement uploading images
          />
        </div>

        <button
          className={clsx(
            'w-full py-2 text-2xl font-medium rounded-md',
            submitDisabled
              ? 'text-gray-50 bg-gray-400'
              : 'text-pink-100 bg-yellow-700'
          )}
          type="submit"
          disabled={submitDisabled}
        >
          {state.matches('uploading')
            ? 'Submitting...'
            : state.matches('uploaded')
            ? 'Submitted'
            : 'Submit'}
        </button>
      </form>
    </main>
  )
}

function Label({ htmlFor, ...props }: React.ComponentPropsWithoutRef<'label'>) {
  return <label htmlFor={htmlFor} className="text-4xl" {...props} />
}

export default Tobacco
