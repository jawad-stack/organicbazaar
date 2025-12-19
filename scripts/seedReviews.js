import mongoose from "mongoose";

async function seedReviews() {
  const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    customerName: String,
    customerEmail: String,
    rating: Number,
    title: String,
    content: String,
    helpful: { type: Number, default: 0 },
    notHelpful: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

  // 2️⃣ Create model from schema
  const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);


  try {
    await mongoose.connect(
      "mongodb+srv://organicbazaar:ymYABNi3qTOKLQBC@cluster0.80ftwds.mongodb.net/?appName=Cluster0"
    );
    console.log("MongoDB connected");

    const productId = new mongoose.Types.ObjectId("6941fc4c95960555d6b8dcc1");

    const reviews = [
      {
        productId,
        customerName: "Salman Khan",
        customerEmail: "salman.khan@gmail.com",
        rating: 5,
        title: "Pure Desi Eggs",
        content:
          "Eggs bilkul pure thay, taste se clearly desi lagtay hain. Trusted seller.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        productId,
        customerName: "Ayesha Malik",
        customerEmail: "ayesha.malik@gmail.com",
        rating: 5,
        title: "Fresh & Healthy",
        content:
          "Very fresh desi eggs. Yolks are deep yellow and quality is excellent.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        productId,
        customerName: "Bilal Ahmed",
        customerEmail: "bilal.ahmed@gmail.com",
        rating: 4,
        title: "Good Quality",
        content:
          "Packing achi thi aur eggs bilkul fresh thay. Will order again.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        productId,
        customerName: "Hina Raza",
        customerEmail: "hina.raza@gmail.com",
        rating: 5,
        title: "Trusted Seller",
        content: "Seller bohat reliable hai. Desi anday bilkul natural hain.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        productId,
        customerName: "Usman Ali",
        customerEmail: "usman.ali@gmail.com",
        rating: 5,
        title: "Best for Home Use",
        content: "Rozana use ke liye best hain. Eggs bilkul pure aur fresh.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        productId,
        customerName: "Sana Iqbal",
        customerEmail: "sana.iqbal@gmail.com",
        rating: 4,
        title: "Natural Taste",
        content: "Taste se farq clear hai. Market walay eggs se kaafi behtar.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        productId,
        customerName: "Fahad Butt",
        customerEmail: "fahad.butt@gmail.com",
        rating: 5,
        title: "Original Desi Eggs",
        content: "Yolk strong hai aur shell bhi hard hai. Clearly desi eggs.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        productId,
        customerName: "Maryam Noor",
        customerEmail: "maryam.noor@gmail.com",
        rating: 5,
        title: "Healthy Choice",
        content: "Bachon ke liye leti hoon. Fully satisfied with purity.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        productId,
        customerName: "Zeeshan Akram",
        customerEmail: "zeeshan.akram@gmail.com",
        rating: 4,
        title: "Fresh Delivery",
        content: "Delivery fast thi aur eggs bilkul fresh condition mein mile.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        productId,
        customerName: "Nimra Shah",
        customerEmail: "nimra.shah@gmail.com",
        rating: 5,
        title: "Highly Recommended",
        content: "Desi anday hain, koi smell ya issue nahi. Trusted source.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        productId,
        customerName: "Adnan Qureshi",
        customerEmail: "adnan.qureshi@gmail.com",
        rating: 4,
        title: "Value for Money",
        content: "Price ke hisaab se quality bohat achi hai.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        productId,
        customerName: "Rabia Khalid",
        customerEmail: "rabia.khalid@gmail.com",
        rating: 5,
        title: "Pure & Safe",
        content: "Eggs bilkul saaf aur natural hain. Seller par trust hai.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        productId,
        customerName: "Imran Siddiqui",
        customerEmail: "imran.s@gmail.com",
        rating: 5,
        title: "Excellent Quality",
        content: "Desi eggs ki quality outstanding hai. Will buy again.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        productId,
        customerName: "Kiran Aslam",
        customerEmail: "kiran.aslam@gmail.com",
        rating: 4,
        title: "Satisfied",
        content: "Overall experience acha raha. Eggs fresh aur pure thay.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        productId,
        customerName: "Hamza Farooq",
        customerEmail: "hamza.farooq@gmail.com",
        rating: 5,
        title: "Authentic Seller",
        content: "Seller honest hai aur product bilkul genuine hai.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
    ];

    await Review.insertMany(reviews);
    console.log(`Inserted ${reviews.length} reviews successfully`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding reviews:", error);
    process.exit(1);
  }
}

seedReviews();
