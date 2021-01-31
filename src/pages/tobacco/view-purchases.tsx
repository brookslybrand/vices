import Image, { ImageProps } from 'next/image'
import PageLayout from 'components/page-layout'
import { TobaccoPurchase } from 'firebaseApp'
import useCollection from 'hooks/useCollection'
import { TOBACCO_PURCHASES } from 'constants/collections'
import 'twin.macro'

function ViewPurchases() {
  const { state, docs: purchases } = useCollection<TobaccoPurchase>(
    TOBACCO_PURCHASES,
    { criteria: 'date', desc: true }
  )

  if (state === 'loading') return <h1 tw="text-4xl ">Loading...</h1>

  return (
    <div tw="w-80">
      <h1 tw="text-4xl font-display">Purchases</h1>
      <ul tw="my-10 space-y-8">
        {purchases.map((purchase) => (
          <li key={purchase.id}>
            <Purchase {...purchase} />
          </li>
        ))}
      </ul>
    </div>
  )
}

const ViewPurchasesPageLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <PageLayout title="View Tobacco Purchases" children={children} />
}

ViewPurchases.PageLayout = ViewPurchasesPageLayout

export default ViewPurchases

function Purchase({
  date,
  name,
  amount,
  description,
  imageUrl,
}: TobaccoPurchase) {
  return (
    <div tw="space-y-2">
      <h2 tw="text-2xl font-display">
        {name} <span tw="text-base">{amount} (oz)</span>
      </h2>
      <h3 tw="text-lg font-light font-display">
        Purchased on {date.toDate().toLocaleDateString()}
      </h3>
      {imageUrl ? <CustomImage src={imageUrl} alt={name} /> : null}
      {description ? <p tw="font-light ">{description}</p> : null}
    </div>
  )
}

function CustomImage(props: Omit<ImageProps, 'layout' | 'width' | 'height'>) {
  return (
    // dimensions are the same as the container
    <div tw="relative h-80 w-80">
      <Image layout="fill" {...props} objectFit="contain" />
    </div>
  )
}
