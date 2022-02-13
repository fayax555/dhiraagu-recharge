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
      'https://my.ooredoo.mv/quickpay/quick_pay.php?sec=quick&type=recharge&true=1'
    )

    const { mobileNo, total } = req.body

    await page.type('#msisdn', mobileNo)
    await page.type('#billamount', total)
    await page.keyboard.press('Enter')
    await page.click('#bml > div > div.col-md-9.col-9')
    await page.click('#paymbut')
    await page.waitForNavigation()
    console.log(page.url())
    await browser.close()
    res.status(200).json({ bmlUrl: page.url() })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}
