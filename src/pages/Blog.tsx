import { Calendar, User, ArrowRight } from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: 'Understanding Employment Agreements in Australia',
    excerpt: 'Key considerations for Fair Work compliance when hiring employees...',
    author: 'Legal Team',
    date: '2024-01-15',
  },
  {
    id: 2,
    title: 'Contractor vs Employee: Getting it Right',
    excerpt: 'Avoid sham contracting issues with our comprehensive guide...',
    author: 'Legal Team',
    date: '2024-01-10',
  }
]

export default function Blog() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Legal Insights Blog</h1>
        <p className="text-xl text-gray-600">
          Stay informed about Australian business law
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{new Date(post.date).toLocaleDateString('en-AU')}</span>
            </div>
            
            <button className="text-[--color-navy] font-semibold hover:underline flex items-center">
              Read More
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}