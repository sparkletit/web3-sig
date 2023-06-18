import styles from './layout.module.css'

export default function Layout({ children }) {
  const clickyId = process.env.NEXT_PUBLIC_CLICKY
  const href = 'https://clicky.com/' + clickyId
  const dataid = clickyId
  return (
    <div className={styles.container + ' flex flex-col justify-center'}>
      {children}

      <a title='Privacy-friendly Web Analytics' href={href}>
        <img
          alt='Clicky'
          src='//static.getclicky.com/media/links/badge.gif'
          border='0'
        />
      </a>
      <script async data-id={dataid} src='//static.getclicky.com/js'></script>
    </div>
  )
}
