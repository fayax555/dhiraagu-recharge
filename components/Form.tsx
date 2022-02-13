import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react'
import styles from 'styles/Form.module.scss'
import { useRouter } from 'next/router'

interface Props {}

const Form = () => {
  const router = useRouter()
  const [mobileNo, setMobileNo] = useState('')
  const [total, setTotal] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({ total: '', mobileNo: '' })
  const gstRef = useRef<HTMLInputElement>(null)
  const rechargeAmountRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!gstRef.current || !rechargeAmountRef.current) return

    const totalAmount = parseInt(total)
    const gst = (Math.round((totalAmount || 0) * 0.0566 * 100) / 100).toFixed(2)
    const rechargeAmount = parseInt(total) - parseFloat(gst)
    gstRef.current.value = gst
    rechargeAmountRef.current.value = String(rechargeAmount || 0)

    if (
      mobileNo.length !== 7 ||
      !totalAmount ||
      totalAmount < 20 ||
      totalAmount > 500
    ) {
      setIsDisabled(true)
    } else {
      setIsDisabled(false)
    }
  }, [total, mobileNo, error])

  useEffect(() => {
    if (mobileNo.length === 7) setError({ ...error, mobileNo: '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileNo.length])

  useEffect(() => {
    const totalAmount = parseInt(total)
    if (totalAmount >= 20 && totalAmount < 500)
      setError({ ...error, total: '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total])

  const handleTotalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const re = /^[0-9]+$/
    if (e.target.value === '' || re.test(e.target.value))
      setTotal(e.target.value)
  }

  const handleTotalBlur = () => {
    if (parseInt(total) < 20 || parseInt(total) > 500) {
      setError((curr) => ({
        ...curr,
        total: 'Enter a whole number amount between MVR 20 and 500.',
      }))
    }
  }

  const handleMobileNoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const re = /^[79]{1}[0-9]{0,6}$/
    if (e.target.value === '' || re.test(e.target.value))
      setMobileNo(e.target.value)
  }

  const handleMobileNoBlur = () => {
    if (mobileNo.length > 0 && mobileNo.length < 7) {
      setError((curr) => ({ ...curr, mobileNo: 'Enter a valid mobile number' }))
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    fetch('/api/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobileNo,
        total,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data?.bmlUrl) {
          router.push(data?.bmlUrl)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <label htmlFor='mobileNo'>Prepaid Mobile Number</label>
        <input
          type='text'
          id='mobileNo'
          value={mobileNo}
          onChange={handleMobileNoChange}
          onBlur={handleMobileNoBlur}
          // autoComplete='off'
        />
        <div className={styles.error}>{error.mobileNo}</div>
      </div>

      <div className={styles.inputWrapper}>
        <label htmlFor='total'>Total Amount (Including GST)</label>
        <input
          type='number'
          id='total'
          min={20}
          max={500}
          placeholder='MVR 20-500'
          value={total}
          onChange={handleTotalChange}
          onBlur={handleTotalBlur}
        />
        <div className={styles.error}>{error.total}</div>
      </div>

      <div className={styles.info}>
        <label htmlFor='gst'>GST Amount</label>
        <input disabled type='text' id='gst' ref={gstRef} />
      </div>

      <div className={styles.info}>
        <label htmlFor='rechargeAmount'>Recharge Amount</label>
        <input
          disabled
          type='text'
          id='rechargeAmount'
          ref={rechargeAmountRef}
        />
      </div>

      <button className={styles.button} type='submit' disabled={isDisabled}>
        <span>Continue</span>
        {isLoading && loadingSvg}
      </button>
    </form>
  )
}

const loadingSvg = (
  <svg
    version='1.1'
    id='L9'
    xmlns='http://www.w3.org/2000/svg'
    xmlnsXlink='http://www.w3.org/1999/xlink'
    x='0px'
    y='0px'
    viewBox='0 0 100 100'
    enableBackground='new 0 0 0 0'
    xmlSpace='preserve'
  >
    <path
      fill='#ffffff'
      d='M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50'
    >
      <animateTransform
        attributeName='transform'
        attributeType='XML'
        type='rotate'
        dur='1s'
        from='0 50 50'
        to='360 50 50'
        repeatCount='indefinite'
      />
    </path>
  </svg>
)

export default Form
