import Paragraph from "../model/paragraph.js";

const createParagraph = async (req, res) => {
  try {
    const { text, difficulty } = req.body;
    if (!text || !difficulty)
      return res.status(500).json({ message: " fill all fields " });

    const newText = await new Paragraph({ text, difficulty });
    await newText.save();
    res.status(200).json({ message: "text added" });
  } catch (error) {
    return res.status(400).json({ message: "paragraph not added" });
  }
};

const getParagraph = async (req, res) => {
  try {
    const { difficulty } = req.query;
    if (!difficulty)
      return res.status(404).json({ message: "select the difficulty" });

    const randomText = await Paragraph.aggregate([
      { $match: { difficulty } },
      { $sample: { size: 1 } },
    ]);
    if (!randomText)
      return res
        .status(404)
        .json({ message: "text of this difficulty is not added" });

    res.status(200).json({ text: randomText[0].text });
  } catch (error) {
    res.status(404).json({ message: "unable to load text" });
  }
};
export { createParagraph, getParagraph };
