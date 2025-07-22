import { Link } from "react-router-dom";
import blogPosts from "./blogData";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  image: string;
}

export default function Blog() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#ee4d2d]">Blog Thú Cưng</h1>
      <div className="space-y-8">
        {(blogPosts as unknown as BlogPost[]).map((post) => (
          <Link
            to={`/blog/${post.id}`}
            key={post.id}
            className="block bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-4 border hover:shadow-lg transition-shadow duration-200"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full md:w-48 h-32 object-cover rounded-lg"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#ee4d2d] mb-1">{post.title}</h2>
                <p className="text-gray-500 text-sm mb-2">{post.date}</p>
                <p className="text-gray-700 mb-2">{post.summary}</p>
                <span className="text-blue-600 hover:underline">Đọc thêm</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 