import Head from 'next/head'
import styles from 'styles/Home.module.scss'
import type { NextPage } from 'next'
import Form from 'components/Form'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>dhiraagu recharge</title>
        <meta name='description' content='recharge with 1 click' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <h1>Dhiraagu Recharge</h1>
        <Form />
      </main>
    </>
  )
}

export default Home
