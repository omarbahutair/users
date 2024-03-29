const mongoose = require("mongoose");

mongoose.Promise = global.Promise; // to use ES6 promises instead of mongoose promise lib

before((done) => {
  // to run before the excution of any test
  mongoose.connect("mongodb://localhost/users_test"); // build a mongoose DB for testing
  mongoose.connection
    .once("open", () => {
      console.log("good to go!");
      done();
    })
    .on("error", (error) => console.warn("Warning", error));
});

// to avoid piling data in the collection while testing
beforeEach((done) => {
  const { users, comments, blogposts } = mongoose.connection.collections;

  users.drop(() => {
    // once all the data inside the collection is dropped
    // added the dropping of comments and blogPost models too
    comments.drop(() => {
      blogposts.drop(() => {
        done();
      });
    });
  });
});
