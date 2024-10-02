import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://tarunnemali2004:Iamtarun2004@cluster0.cdklqgg.mongodb.net/food-del"
    )
    .then(() => {
      console.log(`Database connected`);
    })
    .catch((err) => console.log(err));
};
