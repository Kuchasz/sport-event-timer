import { DateAdded } from "components/date-added";
import { posts } from "../../posts";
import { useRouter } from "next/router";

const Slogan = ({ article }: { article: typeof posts[0] }) => (
    <div
        style={{ backgroundImage: `url(/assets/posts/${article.photo})` }}
        className="flex w-full h-128 uppercase text-white bg-bottom bg-cover justify-center"
    >
        <div className="w-full max-w-6xl flex flex-col items-start justify-center">
            <div className="text-5xl font-semibold">{article.title}</div>
            <span className="mt-4 font-semibold">{article.excerpt}</span>
        </div>
    </div>
);

const Article = () => {
    const router = useRouter();
    const { alias } = router.query;

    const post = posts.find((p) => p.alias === alias);

    return (
        <div>
            {post === undefined ? (
                <div>POST DOES NOT EXIST</div>
            ) : (
                <div>
                    <Slogan article={post} />
                    <div className="flex w-full bg-gray-200 justify-center">
                        <div className="max-w-6xl my-14">
                            <div className="bg-white border border-gray-300 rounded-sm p-10">
                                <h2 className="text-2xl uppercase font-semibold">{post.title}</h2>
                                <div className="uppercase flex my-4 text-sm items-center font-semibold">
                                    <span>{post.author}</span>
                                    <span
                                        style={{ width: "2px", height: "20px" }}
                                        className="inline-block mx-4 bg-gray-300"
                                    ></span>
                                    <DateAdded date={post.date} />
                                </div>
                                <span>{post.content}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Article;
