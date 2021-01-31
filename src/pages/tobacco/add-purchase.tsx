import tw from 'twin.macro'
import Image from 'next/image'
import PageLayout from 'components/page-layout'
import { Machine, assign, EventObject } from 'xstate'
import { useMachine } from '@xstate/react'
import { db, storageRef, TobaccoPurchase } from 'firebaseApp'
import { TOBACCO_PURCHASES } from 'constants/collections'
import useAuthRedirect from 'hooks/useAuthRedirect'
import { useState } from 'react'

function AddPurchase() {
  const [state, send] = useMachine(purchaseMachine)

  const handleUpdate = (newContext: Partial<Context>) =>
    send('UPDATE_CONTEXT', { data: newContext })

  const { date, name, amount, description, imageUrl } = state.context
  const submitDisabled = !state.matches('inputting.complete')

  return (
    <form
      tw="my-8 space-y-4 w-80"
      onSubmit={(e) => {
        e.preventDefault()
        send('SUBMIT')
      }}
    >
      <h1 tw="text-4xl ">Add purchase</h1>
      <div>
        <Label tw="text-lg" htmlFor="date">
          Purchase date *
        </Label>
        <input
          id="date"
          tw="w-full"
          type="date"
          value={date ?? ''}
          onChange={(e) => handleUpdate({ date: e.target.value })}
          required
        />
      </div>

      <div>
        <Label tw="text-lg" htmlFor="name">
          Name *
        </Label>
        <input
          tw="block w-full"
          id="name"
          type="text"
          value={name ?? ''}
          onChange={(e) => handleUpdate({ name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label tw="text-lg" htmlFor="amount">
          Amount (oz) *
        </Label>
        <input
          tw="block w-full"
          id="amount"
          type="number"
          value={amount ?? ''}
          onChange={(e) => {
            const val = e.target.value
            handleUpdate({ amount: val === '' ? null : Number(val) })
          }}
          required
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <Label tw="text-lg" htmlFor="description">
          Description
        </Label>
        <textarea
          tw="block w-full"
          id="description"
          value={description ?? ''}
          onChange={(e) => handleUpdate({ description: e.target.value })}
        />
      </div>

      <AddImage
        imageUrl={imageUrl}
        onChange={(url) => handleUpdate({ imageUrl: url })}
      />

      <button
        css={[
          tw`w-full py-2 text-2xl font-medium rounded-md`,
          submitDisabled
            ? tw`bg-gray-400 text-gray-50`
            : tw`text-pink-100 bg-yellow-700`,
        ]}
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
  )
}

const AddPurchasePageLayout = ({ children }: { children: React.ReactNode }) => {
  useAuthRedirect()
  return <PageLayout title="Add Tobacco Purchase" children={children} />
}

AddPurchase.PageLayout = AddPurchasePageLayout

export default AddPurchase

function AddImage({
  imageUrl,
  onChange,
}: {
  imageUrl: null | string
  onChange: (imageUrl: string) => void
}) {
  const [imageData, setImageData] = useState<null | {
    width: number
    height: number
  }>(null)
  return (
    <div>
      {imageUrl !== null && imageData !== null ? (
        <Image
          src={imageUrl}
          width={imageData.width}
          height={imageData.height}
          alt="Image uploaded by user"
        />
      ) : (
        <p>
          <Label tw="text-lg" htmlFor="image">
            Add image
          </Label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => {
              const { files } = e.target
              if (files && files[0]) {
                const reader = new FileReader()
                reader.readAsDataURL(files[0])
                reader.onload = function (e) {
                  //Initiate the JavaScript Image object.
                  const image = document.createElement('img')
                  const src = e.target?.result
                  if (typeof src !== 'string') {
                    throw new Error(
                      'Something went wrong with the image upload'
                    )
                  }
                  image.src = src

                  //Validate the File Height and Width.
                  image.onload = () => {
                    const { width, height } = image
                    onChange(src)
                    setImageData({ width, height })
                  }
                  image.onerror = (e) => {
                    console.warn(e)
                    throw new Error(
                      'Something went wrong with the image upload'
                    )
                  }
                }
              }
            }}
          />
        </p>
      )}
    </div>
  )
}

function Label({ htmlFor, ...props }: React.ComponentPropsWithoutRef<'label'>) {
  return <label htmlFor={htmlFor} tw="text-4xl" {...props} />
}

type Nullable<T> = { [P in keyof T]: T[P] | null }
type Context = Nullable<Omit<TobaccoPurchase, 'date'> & { date: string }>

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
          console.warn(event.data)
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
        if (date === null || isNaN(new Date(date).valueOf())) return false
        if (name === null || name === '') return false
        if (amount === null || amount <= 0) return false
        return true
      },
    },
    services: {
      upload: async ({ date, ...rest }) => {
        if (date === null) {
          throw new Error(`date is null`)
        }
        const collectionRef = db.collection(TOBACCO_PURCHASES)
        let data = { ...rest, date: new Date(date) }
        const { imageUrl } = data
        // if there is an image, upload the data to firestore, then the image to storage,
        // then update the doc with the storage path
        if (imageUrl !== null) {
          data.imageUrl = null
          // upload the data
          const { id } = await collectionRef.add(data)

          // upload the image
          const imageRef = storageRef.child(`tobacco-purchases/${id}.jpeg`)
          const result = await imageRef.putString(imageUrl, 'data_url')
          const downloadUrl = await result.ref.getDownloadURL()

          // update the imageUrl
          await collectionRef.doc(id).update({ imageUrl: downloadUrl })
        } else {
          // upload the data
          await collectionRef.add(data)
        }
        // if there were no issues, we can resolve
        return Promise.resolve()
      },
    },
  }
)
