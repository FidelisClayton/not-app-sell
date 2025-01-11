import { Errors } from "@shared/lib/error";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { AppRepository } from "@shared/repositories/app-repository";
import { ProductRepository } from "@shared/repositories/product-repository";
import { PageRepository } from "@shared/repositories/page-repository";
import { BlockRepository } from "@shared/repositories/block-repository";
import { BlockType } from "@shared/models/block-model";
import { AppDocument } from "@shared/models/app-model";
import plimit from "p-limit";
import axios from "axios";
import { generatePresignedUrl } from "@shared/lib/s3";

const limit = plimit(5);

const PROMPT_1 = `
### Purpose
I want you to act as an AI ebook generator. Based on the following inputs, generate an outline for an ebook in JSON format. The JSON should include the following keys:

- 'title;: The title of the ebook.
- 'description': A super short description about the ebook.
- 'chapters': An array of chapter objects, where each object has:
  - 'title': The name of the chapter.
  - 'description': A short description of the chapter's content.

### Example JSON:
{
 "title": "Criando Laços Fortes",
 "description": "Construindo Relacionamentos Saudáveis com Seus Filhos",
 "chapters": [
   {
     "title": "A importancia de criar laços fortes",
     "description": "Uma introdução abrangente, explicando a importância de construir relacionamentos saudáveis com seus filhos e as diversas formas através das quais você pode criar laços fortes."
   }
 ],
}

### Inputs:

- Title of the ebook: [TITLE]
- Description of the ebook: [DESCRIPTION]
- Number of chapters: [NUMBER_OF_CHAPTERS]
- Language: pt-br
- Additional guidance:
    [GUIDANCE]

### Output
Return the result as a valid JSON.
`;

const PROMPT_2 = `
### Purpose
Based on the following ebook outline, expand on the chapter titled "[CHAPTER_TITLE]: [CHAPTER_DESCRIPTION]". 

Here is the context:
- Ebook title: "[EBOOK_TITLE]"
- Description: "[EBOOK_DESCRIPTION]"
- Additional guidance:
[ADDITIONAL_GUIDANCE]

- Previous outline: 
\`\`\`
[JSON_OUTLINE]
\`\`\`

### Task
Expand the chapter "[CHAPTER_TITLE]: [CHAPTER_DESCRIPTION]" with the following details:
- A detailed description of the content (400-1000 words).
- Break it into subtopics 4-6 subtopics (each subtopic must have a title, with h4 markup, this is essential to make the text easy to read)
- Don't go into other subjects that will be handled by other chapters (as specified in the outline)
- Provide actionable advice, practical examples, or illustrative details.
- For the \`content\`, instead of using "\n" to break lines, you must wrap paragraphs with the HTML tag \`p\`. You can also use \`strong\`, \`s\`, \`h4\`, \`ul\`, \`ol\`, and \`li\` if needed
- The title of each section of the suggested structure should not be used, instead, embed each section naturally in the text
- The content must be in Brazilian Portuguese (pt-br)
- Generate a rich content, with headers, bold, lists, etc.

### Output
Return the expanded content in JSON format with:
- "title": Title of the capter
- "content": The content of the chapter (rich text)

### Example
{
  "title": "[CHAPTER_TITLE]",
  "content": "Content here"
}
`;

const PROMPT_3 = `
### Goal
Generate a prompt that will be user by Leonardo AI to generate an image

### Rules
- You must complete the following template:
\`\`\`
a cute pastel colors thick line Notion style doodle of [DESCRIPTION_OF_THE_SCENE]. Pastel color tones, simple loose comic design, flat style illustration, simple setting, padding margins. All the characters are North American. Male adults should never be the main character. The scene should never have 2 mothers or 2 fathers.
\`\`\`
- You must not add text to the image
- The prompt might be in english

### Output
Output only the prompt you've created. No other text. Only the prompt.

Generate the prompt for the following text:
[TITLE]
[DESCRIPTION]
`;

// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

type Chapter = {
  title: string;
  content: string;
  imageUrl?: string;
};

type EbookChapter = {
  title: string;
  description: string;
};
type Ebook = {
  title: string;
  description: string;
  chapters: Array<EbookChapter>;
  coverUrl?: string;
};

const uploadImageToS3 = async (imageUrl: string) => {
  const fileResponse = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });
  const fileName = new URL(imageUrl).pathname.split("/").reverse()[0];
  const presignedUrl = await generatePresignedUrl(fileName, "image/png");
  await axios.put(presignedUrl, fileResponse.data, {
    headers: {
      "Content-Type": "image/png",
    },
  });

  return presignedUrl.split("?")[0];
};

const generateOutline = async ({
  title,
  description,
  numberOfChapters,
  guidance,
}: {
  title: string;
  description: string;
  numberOfChapters: number;
  guidance?: string;
}) => {
  const prompt = PROMPT_1.replaceAll("[TITLE]", title)
    .replaceAll("[DESCRIPTION]", description)
    .replaceAll("[NUMBER_OF_CHAPTERS]", numberOfChapters.toString())
    .replaceAll("[GUIDANCE]", guidance ?? "");

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "You are an useful assistant. Provide output in valid JSON.",
      },
      { role: "user", content: prompt },
    ],
  });

  const responseText = response.choices[0].message.content;
  const ebook = responseText ? JSON.parse(responseText) : null;

  console.log(ebook, responseText);

  const ebookCoverPrompt = await generateImagePrompt(
    `${ebook.title}: ${ebook.description}`,
  );
  if (ebookCoverPrompt) {
    const ebookCoverUrl = await generateImage(ebookCoverPrompt);
    return {
      ...ebook,
      coverUrl: ebookCoverUrl,
    } as Ebook;
  }

  return ebook as Ebook;
};

const generateChapter = async (
  ebook: Ebook,
  chapter: EbookChapter,
  additionalGuidance: string,
): Promise<Chapter> => {
  const prompt2 = PROMPT_2.replaceAll("[EBOOK_TITLE]", ebook.title)
    .replaceAll("[EBOOK_DESCRIPTION]", ebook.description)
    .replaceAll("[JSON_OUTLINE]", JSON.stringify(ebook, null, 2))
    .replaceAll("[CHAPTER_TITLE]", chapter.title)
    .replaceAll("[CHAPTER_DESCRIPTION]", chapter.description)
    .replaceAll("[ADDITIONAL_GUIDANCE]", additionalGuidance);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "You are an useful assistant" },
      { role: "user", content: prompt2 },
    ],
  });

  const responseText = response.choices[0].message.content;
  const responseJSON: Chapter | null = responseText
    ? JSON.parse(responseText)
    : null;

  console.log(responseJSON);

  console.log("chapter response text", responseText);

  // console.log("generating image prompt");
  // const coverPrompt = await generateImagePrompt(
  //   subtopics.map((subtopic) => subtopic.content).join("\n"),
  // );
  // console.log("image prompt generated", coverPrompt);
  //
  // if (coverPrompt) {
  //   console.log("generating coverUrl");
  //   const coverUrl = await generateImage(coverPrompt);
  //
  //   console.log("generated cover", coverUrl);
  //
  //   return {
  //     ...responseJSON,
  //     subtopics,
  //     title: responseJSON?.title ?? "",
  //     imageUrl: coverUrl!,
  //   };
  // }

  return {
    ...responseJSON,
    content: responseJSON?.content ?? "",
    title: responseJSON?.title ?? "",
  };
};

const generateImagePrompt = async (content: string) => {
  const prompt = PROMPT_3.replaceAll("[TITLE]", content).replaceAll(
    "[DESCRIPTION]",
    "",
  );

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are an useful assistant" },
      { role: "user", content: prompt },
    ],
  });

  return response.choices[0].message.content;
};

const generateImage = async (prompt: string) => {
  const response = await openai.images.generate({
    prompt,
    model: "dall-e-3",
    n: 1,
    size: "1024x1024",
    quality: "standard",
    response_format: "url",
  });

  const dalleUrl = response.data[0].url;

  if (!dalleUrl) return null;

  const s3Url = await uploadImageToS3(dalleUrl);

  return s3Url;
};

const persist = async (
  app: AppDocument,
  ebook: Ebook,
  chapters: Array<Chapter>,
) => {
  console.log("creating product", ebook);
  const newProduct = await ProductRepository.create({
    description: ebook.description,
    name: ebook.title,
    createdBy: "67635f7ef3cc96649902ec99",
    app: app._id.toString(),
    coverUrl: ebook.coverUrl,
  });
  console.log("created product", newProduct.name);

  let index = 0;
  for (const chapter of chapters) {
    console.log("creating chapter", chapter.title);
    const newPage = await PageRepository.create({
      createdBy: "67635f7ef3cc96649902ec99",
      content: "<p></p>",
      coverUrl: chapter.imageUrl ?? null,
      index,
      name: chapter.title ?? "Nome padrão",
      product: newProduct._id.toString(),
    });
    console.log("created chapter", newPage.name);

    console.log("[DB] Persisting content");
    await BlockRepository.create({
      index: 0,
      type: BlockType.Text,
      page: newPage._id.toString(),
      content: chapter.content,
    });

    index++;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { appId } = req.query;

  const title = "O Ciclo da Calma";
  const description =
    "Como Recuperar o Controle Emocional em Momentos Difíceis";
  const numberOfChapters = 5;
  const guidance = `
Passo a passo para manter a calma durante conflitos com os filhos.
Exercícios para gerenciar o estresse e a paciência.
`;
  const chapterAdditionalGuidance = `
- It must contain practical guidance
- It must contain real world examples
  `;

  if (req.method !== "POST")
    return res.status(405).json(Errors.METHOD_NOT_SUPPORTED);

  if (typeof appId !== "string")
    return res.status(400).json(Errors.BAD_REQUEST);

  const app = await AppRepository.getById(appId?.toString());

  if (!app) return res.status(404).json(Errors.RESOURCE_NOT_FOUND);

  const ebook = await generateOutline({
    numberOfChapters,
    description,
    title,
    guidance,
  });

  if (!ebook) return res.status(400).end();

  const chapters = await Promise.all(
    ebook.chapters.map((chapter) =>
      limit(async () => {
        console.log("[AI Generation]: Requesting chapter", chapter.title);
        const generatedChapter = await generateChapter(
          ebook,
          chapter,
          chapterAdditionalGuidance,
        );

        return generatedChapter;
      }),
    ),
  );

  try {
    await persist(app as AppDocument, ebook, chapters);
  } catch (e) {
    console.log(JSON.stringify(ebook, null, 2));
    console.log(JSON.stringify(chapters, null, 2));
    console.log((e as Error).message);
    return res.status(500).json(Errors.UNEXPECTED_ERROR);
  }

  return res.status(200).json({
    title: ebook.title,
    description: ebook.description,
    chapters,
  });
}
