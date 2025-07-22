import { useParams, Link } from "react-router-dom";
import blogPosts from "./blogData";

interface BlogContentBlock {
  type: "paragraph" | "subtitle" | "image";
  text?: string;
  src?: string;
  alt?: string;
}

interface BlogPost {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  summary: string;
  content: BlogContentBlock[];
  image: string;
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const post = (blogPosts as BlogPost[]).find((p) => p.id === id);

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Không tìm thấy bài viết</h2>
        <Link to="/blog" className="text-blue-600 hover:underline">Quay lại Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-12">
      <div className="relative w-full h-72 md:h-96 overflow-hidden shadow-lg">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover object-center scale-105 blur-[1px] brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full px-6 pb-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-2">{post.title}</h1>
          {post.subtitle && (
            <h2 className="text-lg md:text-2xl font-semibold text-orange-100 drop-shadow mb-1 italic">{post.subtitle}</h2>
          )}
          <p className="text-orange-200 text-base md:text-lg font-medium drop-shadow">{post.date}</p>
        </div>
        <Link
          to="/blog"
          className="absolute top-4 left-4 bg-white/80 hover:bg-white text-orange-600 font-semibold px-4 py-2 rounded-full shadow transition-all backdrop-blur border border-orange-200"
        >
          &larr; Quay lại Blog
        </Link>
      </div>
      <div className="max-w-2xl mx-auto -mt-16 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-orange-100">
          <p className="text-lg md:text-xl text-gray-700 font-medium mb-6 italic text-center">{post.summary}</p>
          <div className="prose prose-lg max-w-none text-gray-900 leading-relaxed" style={{fontSize: '1.15rem'}}>
            {post.content.map((block, idx) => {
              if (block.type === "paragraph") {
                return <p key={idx} className="mb-5 text-justify">{block.text}</p>;
              }
              if (block.type === "subtitle") {
                return <h3 key={idx} className="text-xl md:text-2xl font-bold text-[#ee4d2d] mt-8 mb-3">{block.text}</h3>;
              }
              if (block.type === "image") {
                return (
                  <div key={idx} className="flex justify-center my-6">
                    <img
                      src={block.src}
                      alt={block.alt || "Blog hình ảnh"}
                      className="rounded-xl shadow-lg max-h-80 object-cover border border-orange-100"
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 