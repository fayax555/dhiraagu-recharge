import { NextApiRequest, NextApiResponse } from 'next'
import { chromium } from 'playwright-chromium'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const browser = await chromium.launch({
    chromiumSandbox: false,
    headless: false,
    // proxy: {
    //   server: '103.110.109.139:3127',
    // },
  })

  try {
    const context = await browser.newContext()
    context.setDefaultNavigationTimeout(100000)
    const page = await context.newPage()

    await page.goto(
      'https://www.dhiraagu.com.mv/ocs/service_reload_public.aspx',
      { waitUntil: 'domcontentloaded' }
    )

    const { mobileNo, total } = req.body

    const captcha = await page
      .locator(
        '#cf-error-details > div.cf-wrapper.cf-header.cf-error-overview > h1'
      )
      .isVisible()
    if (captcha) {
      await page.locator('#label').click()
    }

    console.log('captcha:-', captcha)

    await page
      .locator(
        '#ctl00_ContentPlaceHolder1_rbl_method > tbody > tr > td:nth-child(2) > label'
      )
      .click()

    await page.type('#ctl00_ContentPlaceHolder1_radTxt_reloadNo', mobileNo)
    await page.locator('#ctl00_ContentPlaceHolder1_radTxt_reloadNo2').click()
    await page.type('#ctl00_ContentPlaceHolder1_radTxt_reloadNo2', mobileNo)
    await page.locator('#ctl00_ContentPlaceHolder1_radTxt_Amount').click()
    await page.type('#ctl00_ContentPlaceHolder1_radTxt_Amount', total)

    const errText = await page
      .locator('#ctl00_ContentPlaceHolder1_lbl_Err_Mobile')
      .textContent()
    console.log('errText:-', errText)

    if (errText) {
      await browser.close()
      return res.status(401).json({
        error: errText,
      })
    }

    await page
      .locator(
        '#ctl00_ContentPlaceHolder1_rbl_method > tbody > tr > td:nth-child(2) > label'
      )
      .click()
    await page.locator('#ctl00_ContentPlaceHolder1_lbtn_Preview').click()

    await page.check('#ctl00_ContentPlaceHolder1_chk_tandc')
    await page.locator('#ctl00_ContentPlaceHolder1_img_pay').click()
    await page.locator('#ctl00_ContentPlaceHolder1_btn_pay > img').click()
    await page
      .locator('#root > div > div.sc-gHftXq.cPdftn > div > div')
      .isVisible()

    await browser.close()
    res.status(200).json({ bmlUrl: page.url() })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
    await browser.close()
  }
}
