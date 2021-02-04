import { css } from 'twin.macro'
import { line, curveBasis } from 'd3-shape'

export { Pipe, PipeAttribution }

function Pipe(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      height="512"
      viewBox="0 0 512 512"
      width="512"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      css={css`
        transform: scale(-1, 1);
      `}
    >
      <title>Pipe</title>
      <g>
        <path d="m179.465 247.955c0-5.583-4.526-10.109-10.109-10.109h-159.247c-5.583 0-10.109 4.526-10.109 10.109v30.064h179.465z" />
        <path d="m497 216.198h-96.975c-25.052 0-49.491 8.78-68.815 24.724l-151.745 125.2v-58.103h-179.465v46.958c0 66.838 54.376 121.214 121.214 121.214 33.387 0 65.957-11.702 91.709-32.95.042-.035.084-.07.126-.106l230.927-196.938h53.024c8.284 0 15-6.716 15-15s-6.716-14.999-15-14.999z" />
        {/* path smoke */}
        <path
          d={dAttribute}
          fill="none"
          strokeWidth="30"
          stroke="black"
          strokeLinecap="round"
          strokeDashoffset={0}
          css={animationCss}
        />
      </g>
    </svg>
  )
}

const coordinates: [number, number][] = [
  [95, 195],
  [95, 160],
  [150, 175],
  [150, 110],
  [115, 110],
  [40, 115],
  [40, 50],
  [80, 50],
  [130, 50],
  [130, 20],
]
const dAttribute = line().curve(curveBasis)(coordinates) ?? undefined // undefined to suppress TS

const lengthPercentage = 1 / 3
const animationCss = css`
  --dasharray: calc(100% * ${lengthPercentage});
  stroke-dashoffset: 0;
  stroke-dasharray: var(--dasharray);
  animation: dash 1.4s linear normal infinite;

  @keyframes dash {
    from {
      stroke-dashoffset: calc(var(--dasharray) * 2);
    }
    to {
      stroke-dashoffset: 0;
    }
  }
`

function PipeAttribution() {
  return (
    <div>
      Icon made by{' '}
      <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
        Freepik
      </a>{' '}
      from{' '}
      <a href="https://www.flaticon.com/" title="Flaticon">
        www.flaticon.com
      </a>
    </div>
  )
}
