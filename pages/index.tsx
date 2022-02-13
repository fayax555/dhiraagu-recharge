import { useState } from 'react'
import Head from 'next/head'
import styles from 'styles/Home.module.scss'
import type { NextPage } from 'next'
import Form from 'components/Form'

const Home: NextPage = () => {
  const [err500, setErr500] = useState('')

  return (
    <>
      <Head>
        <title>dhiraagu recharge</title>
        <meta name='description' content='recharge with 1 click' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        {err500 && <p className={styles.err500}>{err500}</p>}
        <h1>Dhiraagu Recharge</h1>
        <Form {...{ setErr500 }} />
      </main>
    </>
  )
}

export default Home
