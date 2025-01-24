import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './RedirectButton.module.scss'

interface RedirectButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  href?: string
}

const RedirectButton: React.FC<RedirectButtonProps> = ({
  children,
  href,
  ...props 
}) => {
  const router = useRouter()
  const locale = router.locale ?? 'en'

  return (
    <Link href={href ? `/${href}` : ''} className={styles.link}>
      <button className={styles.button} {...props}>
        {children}
      </button>
    </Link>
  )
}

export default RedirectButton
