import { PostDetails } from "../../components/post-details";
import { posts } from "../../posts";
import { useRouter } from "next/router";

const Slogan = ({ article }: { article: typeof posts[0] }) => (
    <div
        style={{ backgroundImage: `url(/assets/posts/${article.photo})` }}
        className="flex w-full h-128 uppercase text-white bg-center bg-cover justify-center"
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
                                <PostDetails date={post.date} author={post.author} />
                                <span dangerouslySetInnerHTML={{ __html: post.content }}></span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Article;
