const niceboardApi = async (path) => {
  const url = new URL(API_BASE_URL + path)
  url.searchParams.set("key", API_KEY)
  console.log(url.toString())
  try {
    const resp = await fetch(url)
    return await resp.json()
  } catch (err) {
    console.log(err)
    return { error: true }
  }
}

const ContentRewriter = content => ({
  element: (element) => {
    element.setAttribute("content", content)
  }
})

const cloudinaryImage = ({ logo, text }) => {
  const logoStr = logo ? `l_fetch:${btoa(logo)}` : `l_jidrlogo`
  const preOpts = `dpr_2.0,c_fit,co_rgb:ffffff,g_north_west,l_text:helvetica_60_weight_bold:`
  const postOpts = `,w_700,x_90,y_360/dpr_2.0,c_scale,g_north_west,h_150,${logoStr},r_8,w_150,x_105,y_145/v1611594735/templates/social-template-v2_jzmvol`
  return `https://res.cloudinary.com/jobsindevrel/image/upload/${[preOpts, encodeURIComponent(text), postOpts].join('')}`
}

const jobs = async (request) => {
  try {
    const jobIdMatch = request.url.match(/\/job\/(\d*)/)

    // Fail silently
    if (!jobIdMatch) { throw new Error("Unexpected result from regex") }

    const jobId = jobIdMatch[1]
    const apiData = await niceboardApi(`/jobs/${jobId}`)

    if (apiData.error) { throw new Error("API request failed") }

    const j = apiData.results.job

    const job = {
      description: j.description_html.slice(0, 240),
      logo: j.company.logo_small_url,
      company: j.company.name,
      title: j.title
    }

    const imageUrl = cloudinaryImage({
      logo: job.logo,
      text: `${job.company} is hiring a ${job.title}`
    })

    return new HTMLRewriter()
      .on("meta[name='twitter:card']", ContentRewriter("summary_large_image"))
      .on("meta[property='og:description']", ContentRewriter(job.description))
      .on("meta[name='twitter:description']", ContentRewriter(job.description))
      .on("meta[property='og:image']", ContentRewriter(imageUrl))
      .on("meta[name='twitter:image']", ContentRewriter(imageUrl))
      .transform(await fetch(request.url))
  } catch (err) {
    console.log(err.message)
    return fetch(request.url)
  }
}

export default jobs