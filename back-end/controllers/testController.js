import Users from "../model/users.js";
import testInfo from "../model/test.js";
import mongoose, { mongo, Mongoose } from "mongoose";

const addTest = async (req, res) => {
  try {
    const testData = req.body; // we will get the userId from the localstorage and testData JSON from the tets page
    testData.fastest = false;
    console.log(testData);

    const fastestTest = await testInfo.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(String(testData.userId)), // this method is deprecated for converting number to objectId
          duration: Number(testData.duration),
          difficulty: String(testData.difficulty),
        },
      },
      { $sort: { speed: -1 } },
      { $limit: 1 },
    ]); // this way we only get the fastest test
    console.log("fastest", fastestTest);
    if (!fastestTest.length) {
      testData.fastest = true;
      /* console.log("first test added"); */
    }
    if (fastestTest.length && testData.speed > fastestTest[0].speed) {
      testData.fastest = true;
      const prevFastest = await testInfo.findByIdAndUpdate(
        fastestTest[0]._id,
        { fastest: false },
        { new: true }
      );
      console.log("prevFastest", prevFastest);
    }
    const test = new testInfo(testData);
    await test.save(); // so the test is saved
    res.status(200).json({ testId: test._id });
  } catch (error) {
    res.status(404).json({ message: "test not added" });
  }
};

const getTest = async (req, res) => {
  try {
    const testId = req.query.testId; // get the text id from the frontend

    const test = await testInfo.findOne({ _id: testId });
    if (!test) {
      return res.status(404).json({ message: "test not found" });
    }
    console.log(test);
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: "cannot get the test" });
  }
};

const getRecentTests = async (req, res) => {
  // to get most recent 10 tests
  try {
    const { duration, count, difficulty, userId } = req.body;
    console.log(duration, count, difficulty, userId);
    const test = await testInfo.aggregate([
      {
        $match: {
          duration,
          difficulty,
          userId: new mongoose.Types.ObjectId(String(userId)),
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: count },
    ]);
    console.log(test);
    res.status(200).json({ ...test });
  } catch (error) {
    res.status(404).json({ message: "cannot get recent tests" });
  }
};

const getTopTests = async (req, res) => {
  try {
    const { userId } = req.user;

    const test = await testInfo.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(String(userId)) } },
      { $sort: { speed: -1 } },
      { $limit: 10 },
    ]);
    res.status(200).json(test);
  } catch (error) {
    res.status(404).json({ message: "cannot get top tests" });
  }
};

const getMostAccurateTests = async (req, res) => {
  try {
    const { userId } = req.user;
    const test = await testInfo.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(String(userId)) } },
      { $sort: { accuracy: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json(test);
  } catch (error) {
    res.status(404).json({ message: "cannot get recent tests" });
  }
};

const getavgSpeedAndAccuracy = async (req, res) => {
  try {
    const { duration, userId, difficulty } = req.body;
    if (!duration || !userId) {
      return res.status(500).json({ message: "duration or userId is emtpy" });
    }
    /* console.log(duration, userId); */
    const avgSpeedResult = await testInfo.aggregate([
      {
        $match: {
          duration: Number(duration),
          userId: new mongoose.Types.ObjectId(String(userId)), // get all the test with duration required and by particular user
          difficulty: String(difficulty),
        },
      },
      {
        $group: {
          _id: null,
          avgSpeed: { $avg: "$speed" },
          avgAccuracy: { $avg: "$accuracy" },
        },
      },
    ]);

    if (!avgSpeedResult.length) {
      // no document found meaning 0 test taken by the user
      return res.status(200).json({
        message: "no test taken",
        averageSpeed: 0,
        averageAccuracy: 0,
      });
    }

    res.status(200).json({
      averageSpeed: avgSpeedResult[0].avgSpeed,
      averageAccuracy: avgSpeedResult[0].avgAccuracy,
    });
  } catch (error) {
    res.status(500).json({ message: "cannot get the avg speed" });
  }
};

const getTotalTest = async (req, res) => {
  try {
    const { duration, userId } = req.body;
    if (!duration)
      return res.status(500).json({ message: "please send the duration" });

    const tests =
      (await testInfo.aggregate([
        {
          $match: {
            duration: Number(duration),
            userId: new mongoose.Types.ObjectId(String(userId)),
          },
        },
      ])) || [];
    res.status(200).json({ total: tests.length });
  } catch (error) {
    res.status(500).json({ message: "total tests not found" });
  }
};
export {
  addTest,
  getTest,
  getRecentTests,
  getTopTests,
  getMostAccurateTests,
  getavgSpeedAndAccuracy,
  getTotalTest,
};
