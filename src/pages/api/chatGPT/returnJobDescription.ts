interface IJobDescription {
  jobTitle: string;
  industry: string;
  keywords: string;
  tone: string;
  numWords: number;
}

const generateDescription = async({
  jobTitle,
  industry,
  keywords,
  tone,
  numWords,
}: IJobDescription) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: `Write a job description for a ${jobTitle} role ${industry ? `in the ${industry} industry` : ""} that is around ${numWords || 200} words in a ${tone || "neutral"} tone. ${keywords ? `Incorporate the following keywords: ${keywords}.` : ""}. The job description should be described in a way that is SEO friendly, highlighting its unique features and benefits.`,
          max_tokens: 100,
          temperature: 0.5
        }),
      }
    );
    const data = await response.json();

    return data.choices[0].text;
  } catch (error) {
    console.log(error);
  }
}

export default async function handler(req: any, res: any) {
  const { jobTitle, industry, keywords, tone, numWords } = req.body;

  const jobDescription = await generateDescription({
    jobTitle,
    industry,
    keywords,
    tone,
    numWords,
  });

  res.status(200).json({ jobDescription })
}