
const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const AuthorSchema = new Schema(
    {
        name: String,
        img: String,
        articles: [{ type: Schema.Types.ObjectId, ref: "Articles" }],
        email: { type: String, required: true },
        password: { type: String, required: true, minlength: 8, selected: false },
        tokenArray: [{ token: String }],
        googleId: String,
    },
    { timestamps: true }
);

AuthorSchema.static(
    "addArticleIdToAuthor",
    async function (articleID, authorID) {
        await AuthorModel.findByIdAndUpdate(
            authorID,
            {
                $push: {
                    articles: articleID,
                },
            },
            { runValidators: true, new: true }
        );
    }
);

AuthorSchema.pre("save", async function (next) {
    const author = this;
    if (author.isModified("password")) {
        author.password = await bcrypt.hash(author.password, 9);
    }
    next();
});

AuthorSchema.statics.findByCrendor = async function (email, password) {
    const author = await this.findOne({ email });

    if (author) {
        const matching = await bcrypt.compare(password, author.password);
        if (matching) return author;
        else return null;
    } else return null;
};

const AuthorModel = model("Author", AuthorSchema);

module.exports = AuthorModel;