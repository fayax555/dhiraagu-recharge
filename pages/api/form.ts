import { NextApiRequest, NextApiResponse } from 'next'
import { chromium } from 'playwright-chromium'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const browser = await chromium.launch({ chromiumSandbox: false })
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto(
      'https://www.dhiraagu.com.mv/ocs/service_reload_public.aspx'
    )

    const { mobileNo, total } = req.body

    await page.type('#ctl00_ContentPlaceHolder1_radTxt_reloadNo', mobileNo)
    await page.locator('#ctl00_ContentPlaceHolder1_radTxt_reloadNo2').click()
    await page.type('#ctl00_ContentPlaceHolder1_radTxt_reloadNo2', mobileNo)
    await page.locator('#ctl00_ContentPlaceHolder1_radTxt_Amount').click()
    await page.type('#ctl00_ContentPlaceHolder1_radTxt_Amount', total)

    const [element] = await page.$$('#ctl00_ContentPlaceHolder1_lbl_Err_Mobile')
    const errText = await (await element.getProperty('textContent')).jsonValue()
    console.log(errText)

    if (errText) {
      return res.status(401).json({
        error: errText,
      })
    }

    await page
      .locator(
        '#ctl00_ContentPlaceHolder1_rbl_method > tbody > tr > td:nth-child(2) > label'
      )
      .click()
    await page.locator('#ctl00_ContentPlaceHolder1_lbtn_Preview > img').click()
    await page.check('#ctl00_ContentPlaceHolder1_chk_tandc')
    await page.locator('#ctl00_ContentPlaceHolder1_img_pay').click()
    await page.locator('#ctl00_ContentPlaceHolder1_btn_pay > img').click()

    // await page.locator('#ctl00_ContentPlaceHolder1_lbl_Err_Mobile').click()

    console.log(page.url())

    await browser.close()
    res.status(200).json({ bmlUrl: page.url() })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}
