const { env } = process;

export const MONGO_URI = process.env.MONGO_URI;
export const {
  Mongo_URI_Server,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DATABASE,
} = process.env;

// export const MONGO_OPTIONS: ConnectionOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// };

// export default () => ({
//   MONGO_URI,
//   MONGO_OPTIONS,
//   // port: parseInt(process.env.PORT, 10) || 3000,
//   // database: {
//   //   host: process.env.DATABASE_HOST,
//   //   port: parseInt(process.env.DATABASE_PORT, 10) || 5432
//   // }
// });
// export const MONGO_URI = `mongodb://${MONGO_USERNAME}:${encodeURIComponent(<string>MONGO_PASSWORD)
//   }@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`

// export const connectDB = async () => {
//   try {
//     // const conn = await mongoose.connect("mongodb://localhost:27017/mern", MONGO_OPTIONS)

//     const conn = await mongoose.connect(Mongo_URI_Server as string, MONGO_OPTIONS)
//     console.log(`MongoDB Connected: ${conn.connection.host}`)

//   } catch (error) {
//     console.error(`Error: ${error.message}`)
//     process.exit(1)
//   }
// }
