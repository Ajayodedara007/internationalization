import { Locale } from '../../../i18.config'
import { getDictionary } from '../../../lib/disctionary'

export default async function Home({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  const { page } = await getDictionary(lang)


  console.log("page",lang)
  return (
    <section className='py-24'>
      <div className='container'>
        <h1 className='text-3xl font-bold'>{page.home.title}</h1>
        <p className='text-gray-500'>{page.home.description}</p>
      </div>
    </section>
  )
}