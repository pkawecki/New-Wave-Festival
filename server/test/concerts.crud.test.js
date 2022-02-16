const { Mongoose } = require("mongoose");
const { Concert } = require("./../models/universal.models");

describe("Concert", () => {
  const testConcOne = new Concert({
    performer: "testPerf1",
    genre: "testGenre1",
    price: "testPrice1",
    day: "testDay1",
    image: "testImage1",
  });
  const testConcTwo = new Concert({
    performer: "testPerf2",
    genre: "testGenre2",
    price: "testPrice2",
    day: "testDay2",
    image: "testImage2",
  });

  before(async () => {
    try {
      await Mongoose.connect("mongodb://localhost:27017/NewWaveDBTest", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.error(err);
    }
    await testConcOne.save();
    await testConcTwo.save();
  });

  describe("Reading data", () => {
    it("Should return ");
  });
});
