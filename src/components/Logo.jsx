import logoDepto from '@/images/depto-white.png'
import Image from 'next/image'

export function Logo(props) {
  return (
    <div {...props} className="rounded-full bg-indigo-500 shadow-xl">
      <Image height={70} src={logoDepto} alt={'depto'} unoptimized />
    </div>
  )
}
