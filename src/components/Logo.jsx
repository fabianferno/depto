import logoDepto from '@/images/depto-white.png'
import Image from 'next/image'

export function Logo(props) {
  return (
    <div {...props} className="rounded-lg bg-indigo-500 hover:shadow-lg">
      <Image height={70} src={logoDepto} alt={'depto'} unoptimized />
    </div>
  )
}
