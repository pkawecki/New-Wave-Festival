const chaiHttp = require("chai-http");
const chai = require("chai");

const server = require("../server");

chai.use(chaiHttp);
describe("GET concerts/", () => {
  describe("/performer/:performer", () => {
    const expect = chai.expect;
    const request = chai.request;
    const performerFirstName = "Maybell";
    it("should return array of given performer concerts with proper input data", async () => {
      const performerLastName = "Haley";
      const perfName = performerFirstName + "%20" + performerLastName;
      const res = await request(server).get(`/concerts/performer/${perfName}`);
      let body = res.body;
      expect(body).to.be.an("array");
      expect(body.length).to.be.greaterThan(0);
      for (x of body) {
        expect(x.performer === perfName);
      }
    });

    it("should return array of given performer concerts with incorrect input data", async () => {
      const performerLastName = "Haleyy"; //INCORRECT LAST NAME
      const perfName = performerFirstName + "%20" + performerLastName;
      const res = await request(server).get(`/concerts/performer/${perfName}`);
      expect(res.status).to.equal(404);
    });
  });
  describe("/genre/:genre", () => {
    const expect = chai.expect;
    const request = chai.request;

    it("should return array of given genre concerts with proper data input", async () => {
      const genre = "Rock";
      const res = await request(server).get(`/concerts/genre/${genre}`);
      const body = res.body;
      expect(body).to.be.an("array");
      expect(body.length).to.be.greaterThan(0);
    });

    it("should return error with incorrect data input", async () => {
      const genre = "Rockk";
      const res = await request(server).get(`/concerts/genre/${genre}`);
      const body = res.body;
      expect(body.message).to.be.equal("not found");
    });
  });

  describe("/price/:price_min/:price_max", () => {
    const expect = chai.expect;
    const request = chai.request;
    it("should return an array of concerts within a given range of prices", async () => {
      const priceMin = 25;
      const priceMax = 25;
      const res = await request(server).get(
        `/concerts/price/${priceMin}/${priceMax}`
      );
      const body = res.body;
      expect(body).to.be.an("array");
      for (let x of body) {
        expect(x.price).to.be.greaterThanOrEqual(priceMin);
        expect(x.price).to.be.lessThanOrEqual(priceMax);
      }
    });
  });

  describe("/day/:day", () => {
    const expect = chai.expect;
    const request = chai.request;
    const day = 1;
    it("should return an array of concerts on given day", async () => {
      const res = await request(server).get(`/concerts/day/${day}`);
      const body = res.body;
      expect(body).to.be.an("array");
      for (let x of body) {
        expect(x.day).to.be.equal(day);
      }
    });
  });
});
